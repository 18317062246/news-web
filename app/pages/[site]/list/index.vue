<script setup lang="ts">
import { flattenColumns } from '../../../services/news-api'
import Sidebar from '../../../components/Sidebar.vue'
import type { ArticleSummary } from '../../../types/news'

const route = useRoute()
const router = useRouter()
const { site } = useSite(route.params.site as string)
const {
  columns, articles, hotArticles, pageTotal, pending, appendPending, appendError,
  error, loadColumns, loadArticles, loadMoreArticles, loadHotArticles
} = useNews(site)
const sidebarItems = [{ type: 'hotArticles' as const, title: '热点排行榜' }]
const typeId = computed(() => Number(route.query.type) || undefined)
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))
const activeColumn = computed(() => flattenColumns(columns.value).find((column) => column.Id === typeId.value))
const isWap = ref(false)
const loadedPage = ref(1)
const loadMoreSentinel = ref<HTMLElement | null>(null)
let loadMoreObserver: IntersectionObserver | undefined
let scrollCheckFrame = 0

useHead(() => ({ title: activeColumn.value?.ColumnsName ? `${activeColumn.value.ColumnsName} - ${site.value?.title}` : site.value?.title }))

async function load() {
  await loadColumns()
  await Promise.all([loadArticles(typeId.value, page.value), loadHotArticles()])
  loadedPage.value = page.value
}

async function loadNextPage() {
  if (!isWap.value || pending.value || appendPending.value || loadedPage.value >= pageTotal.value) return
  const nextPage = loadedPage.value + 1
  if (await loadMoreArticles(typeId.value, nextPage)) loadedPage.value = nextPage
}

function checkScrollPosition() {
  if (!isWap.value || scrollCheckFrame) return
  scrollCheckFrame = window.requestAnimationFrame(() => {
    scrollCheckFrame = 0
    const sentinel = loadMoreSentinel.value
    if (sentinel && sentinel.getBoundingClientRect().top <= window.innerHeight + 500) {
      void loadNextPage()
    }
  })
}

function updateViewportMode() {
  isWap.value = window.matchMedia('(max-width: 767px)').matches
}

onMounted(async () => {
  updateViewportMode()
  window.addEventListener('resize', updateViewportMode, { passive: true })
  await load()

  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) void loadNextPage()
  }, { rootMargin: '500px 0px' })
  window.addEventListener('scroll', checkScrollPosition, { passive: true })
  document.addEventListener('scroll', checkScrollPosition, { capture: true, passive: true })
  await nextTick()
  if (isWap.value && loadMoreSentinel.value) loadMoreObserver.observe(loadMoreSentinel.value)
  checkScrollPosition()
})

watch(isWap, async (enabled) => {
  await nextTick()
  if (!loadMoreObserver || !loadMoreSentinel.value) return
  if (enabled) loadMoreObserver.observe(loadMoreSentinel.value)
  else loadMoreObserver.unobserve(loadMoreSentinel.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode)
  window.removeEventListener('scroll', checkScrollPosition)
  document.removeEventListener('scroll', checkScrollPosition, true)
  if (scrollCheckFrame) window.cancelAnimationFrame(scrollCheckFrame)
  loadMoreObserver?.disconnect()
})

watch([typeId, page], async () => {
  if (!import.meta.client) return
  loadedPage.value = page.value
  await loadArticles(typeId.value, page.value)
  if (isWap.value && page.value === 1 && loadMoreSentinel.value) loadMoreObserver?.observe(loadMoreSentinel.value)
})

function goToPage(nextPage: number) {
  router.push({ query: { ...route.query, page: nextPage } })
}

const visiblePages = computed(() => {
  const start = Math.max(1, Math.min(page.value - 2, pageTotal.value - 4))
  const end = Math.min(pageTotal.value, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
})

function formatPublishDate(value: ArticleSummary['PublishDate']) {
  if (value === undefined || value === '') return ''
  const numericValue = Number(value)
  const date = Number.isFinite(numericValue)
    ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date)
}
</script>

<template>
  <PageLayout :site-key="String(route.params.site)" :brand-mark="site?.brandMark || ''" :brand-title="site?.brandTitle || ''" show-sidebar>
    <template #navigation><span class="site-nav-label">{{ site?.navTitle || site?.brandTitle }}</span></template>
    <template #main>
      <h1 class="page-title list-page__title">{{ activeColumn?.ColumnsName || '文章列表' }}</h1>
      <p v-if="pending" class="notice">正在加载文章…</p>
      <div v-else-if="error" class="notice notice--error">
        <p>{{ error }}</p>
        <button class="retry-button" type="button" @click="loadArticles(typeId, page)">重试</button>
      </div>
      <ArticleList v-else :site-key="String(route.params.site)" :articles="articles" :default-image="site?.defaultImage" />
      <div v-if="isWap" ref="loadMoreSentinel" class="wap-load-more" aria-live="polite">
        <span v-if="appendPending">正在加载更多资讯…</span>
        <template v-else-if="appendError">
          <span>{{ appendError }}</span>
          <button type="button" @click="loadNextPage">重试</button>
        </template>
        <template v-else-if="loadedPage < pageTotal">
          <span>继续上滑加载更多资讯</span>
          <button type="button" @click="loadNextPage">加载更多</button>
        </template>
        <span v-else-if="articles.length">已显示全部资讯</span>
      </div>
      <nav v-else-if="pageTotal > 1" class="pagination" aria-label="文章分页">
        <div class="pagination__inner">
          <a v-if="page > 1" href="#" aria-label="上一页" @click.prevent="goToPage(page - 1)">&lt;</a>
          <template v-for="pageNumber in visiblePages" :key="pageNumber">
            <span v-if="pageNumber === page" class="is-current" aria-current="page">{{ pageNumber }}</span>
            <a v-else href="#" @click.prevent="goToPage(pageNumber)">{{ pageNumber }}</a>
          </template>
          <a v-if="page < pageTotal" href="#" aria-label="下一页" @click.prevent="goToPage(page + 1)">&gt;</a>
        </div>
      </nav>
    </template>
    <template #sidebar>
      <Sidebar :items="sidebarItems">
        <template #hotArticles>
          <ol v-if="hotArticles.length" class="hot-ranking">
            <li v-for="(article, index) in hotArticles" :key="article.ID" class="hot-ranking__item">
              <span class="hot-ranking__rank">{{ index + 1 }}</span>
              <NuxtLink :to="`/${String(route.params.site)}/detail/${article.ID}.html`" :title="article.Title">
                {{ article.Title }}
              </NuxtLink>
              <time class="hot-ranking__date">{{ formatPublishDate(article.PublishDate) }}</time>
            </li>
          </ol>
        </template>
      </Sidebar>
    </template>
  </PageLayout>
</template>
