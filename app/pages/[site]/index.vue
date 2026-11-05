<script setup lang="ts">
import { sidebarBySite } from '../../config/sidebar'
const route = useRoute()
const { site, key } = useSite(route.params.site as string)
const {
  homeSections, rightSections, pending, appendPending, appendError,
  error, loadHome, loadMoreHomeSection
} = useNews(site)
const sidebarItems = computed(() => sidebarBySite[key.value] || [])
const activeId = ref<number | undefined>()
const visibleSection = computed(() => homeSections.value.find(({ column }) => column.Id === activeId.value) || homeSections.value[0])
const isWap = ref(false)
const loadMoreSentinel = ref<HTMLElement | null>(null)
let loadMoreObserver: IntersectionObserver | undefined
let scrollCheckFrame = 0

watch(homeSections, (sections) => {
  const first = sections[0]
  if (first && !sections.some(({ column }) => column.Id === activeId.value)) activeId.value = first.column.Id
}, { immediate: true })

useHead(() => ({ title: site.value?.title || '研究院观点' }))

function updateViewportMode() {
  isWap.value = window.matchMedia('(max-width: 767px)').matches
}

async function loadNextPage() {
  const section = visibleSection.value
  if (!isWap.value || !section || appendPending.value || section.page >= section.pageTotal) return
  await loadMoreHomeSection(section.column.Id, section.page + 1)
}

async function observeSentinel() {
  await nextTick()
  if (!loadMoreObserver || !loadMoreSentinel.value) return
  loadMoreObserver.disconnect()
  if (isWap.value && visibleSection.value && visibleSection.value.page < visibleSection.value.pageTotal) {
    loadMoreObserver.observe(loadMoreSentinel.value)
  }
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

onMounted(async () => {
  updateViewportMode()
  window.addEventListener('resize', updateViewportMode, { passive: true })
  await loadHome()
  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) void loadNextPage()
  }, { rootMargin: '500px 0px' })
  window.addEventListener('scroll', checkScrollPosition, { passive: true })
  document.addEventListener('scroll', checkScrollPosition, { capture: true, passive: true })
  await observeSentinel()
  checkScrollPosition()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode)
  window.removeEventListener('scroll', checkScrollPosition)
  document.removeEventListener('scroll', checkScrollPosition, true)
  if (scrollCheckFrame) window.cancelAnimationFrame(scrollCheckFrame)
  loadMoreObserver?.disconnect()
})

watch([isWap, activeId, homeSections], () => { void observeSentinel() }, { deep: true })
</script>

<template>
  <PageLayout :site-key="key" :brand-mark="site?.brandMark || ''" :brand-title="site?.brandTitle || ''" :show-sidebar="rightSections.length > 0 || Boolean(site?.features.sidebar && sidebarItems.length)">
    <template #navigation><span class="site-nav-label">{{ site?.navTitle || site?.brandTitle }}</span></template>
    <template #main>
      <div class="legacy-home__heading"><h1 class="page-title">{{ site?.brandTitle || site?.navTitle }}</h1></div>
      <nav v-if="homeSections.length" class="programa" aria-label="研究栏目">
        <button v-for="section in homeSections" :key="section.column.Id" type="button" class="programa__tab" :class="{ 'is-active': visibleSection?.column.Id === section.column.Id }" @click="activeId = section.column.Id">
          {{ section.column.ColumnsName }}
        </button>
        <NuxtLink v-if="visibleSection" class="programa__more" :to="`/${key}/list/?type=${visibleSection.column.Id}&page=1`">更多</NuxtLink>
      </nav>
      <p v-if="pending" class="notice">正在加载文章…</p>
      <div v-else-if="error" class="notice notice--error">
        <p>{{ error }}</p>
        <button class="retry-button" type="button" @click="loadHome()">重试</button>
      </div>
      <template v-else-if="visibleSection">
        <ArticleList :site-key="key" :articles="visibleSection.articles" :default-image="site?.defaultImage" />
        <div v-if="isWap" ref="loadMoreSentinel" class="wap-load-more" aria-live="polite">
          <span v-if="appendPending">正在加载更多资讯…</span>
          <template v-else-if="appendError">
            <span>{{ appendError }}</span>
            <button type="button" @click="loadNextPage">重试</button>
          </template>
          <template v-else-if="visibleSection.page < visibleSection.pageTotal">
            <span>继续上滑加载更多资讯</span>
            <button type="button" @click="loadNextPage">加载更多</button>
          </template>
          <span v-else-if="visibleSection.articles.length">已显示全部资讯</span>
        </div>
      </template>
      <p v-else class="empty-state">暂无文章</p>
    </template>
    <template #sidebar>
      <section v-for="section in rightSections" :key="section.column.Id" class="legacy-side-section">
        <h2 class="legacy-side-section__heading"><span>{{ section.column.ColumnsName }}</span><NuxtLink :to="`/${key}/list/?type=${section.column.Id}&page=1`">更多</NuxtLink></h2>
        <ol class="legacy-side-section__list">
          <li v-for="(article, index) in section.articles.slice(0, 6)" :key="article.ID">
            <span class="legacy-side-section__rank">{{ String(index + 1).padStart(2, '0') }}</span>
            <NuxtLink :to="`/${key}/detail/${article.ID}.html`">{{ article.Title }}</NuxtLink>
            <time>{{ article.PublishDate || '' }}</time>
          </li>
        </ol>
      </section>
      <Sidebar v-if="sidebarItems.length" :items="sidebarItems" />
    </template>
  </PageLayout>
</template>
