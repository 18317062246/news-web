<script setup lang="ts">
import DOMPurify from 'dompurify'
import Sidebar from '../../../components/Sidebar.vue'
const route = useRoute()
const { site } = useSite(route.params.site as string)
const { article, hotArticles, pending, error, loadArticle, loadHotArticles } = useNews(site)
const sidebarItems = [{ type: 'hotArticles' as const, title: '热点排行榜' }]
const publishDate = computed(() => {
  const value = article.value?.PublishDate
  if (value == null || value === '') return ''
  const numericValue = Number(value)
  const date = Number.isFinite(numericValue)
    ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date)
})
const safeContent = computed(() => article.value?.Content ? DOMPurify.sanitize(article.value.Content, {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload']
}) : '')

useHead(() => ({ title: article.value?.Title ? `${article.value.Title} - ${site.value?.title || ''}` : site.value?.title }))

function loadDetail() {
  const id = Number(String(route.params.id).replace(/\.html$/, ''))
  if (Number.isInteger(id) && id > 0) {
    loadArticle(id)
  } else {
    error.value = '文章不存在或链接无效'
  }
}

onMounted(() => {
  loadDetail()
  void loadHotArticles()
})

watch(() => route.params.id, () => {
  if (import.meta.client) loadDetail()
})

function formatRankingDate(value: string | number | undefined) {
  if (value == null || value === '') return ''
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
      <div v-if="pending" class="notice">正在加载文章…</div>
      <div v-else-if="error" class="notice notice--error">{{ error }}</div>
      <article v-else-if="article" class="article-detail">
        <header class="article-detail__header">
          <h1 class="article-detail__title">{{ article.Title }}</h1>
          <div class="article-detail__meta">
            <time v-if="publishDate">{{ publishDate }}</time>
            <span v-if="article.Sources">来源：{{ article.Sources }}</span>
          </div>
        </header>
        <div class="article-body" v-html="safeContent" />
      </article>
      <section v-if="article && hotArticles.length" class="detail-mobile-ranking">
        <h2>热点排行</h2>
        <ArticleList :site-key="String(route.params.site)" :articles="hotArticles" :default-image="site?.defaultImage" />
      </section>
    </template>
    <template #sidebar>
      <Sidebar v-if="hotArticles.length" :items="sidebarItems">
        <template #hotArticles>
          <ol class="hot-ranking">
            <li v-for="(item, index) in hotArticles" :key="item.ID" class="hot-ranking__item">
              <span class="hot-ranking__rank">{{ index + 1 }}</span>
              <NuxtLink :to="`/${String(route.params.site)}/detail/${item.ID}.html`" :title="item.Title">{{ item.Title }}</NuxtLink>
              <time class="hot-ranking__date">{{ formatRankingDate(item.PublishDate) }}</time>
            </li>
          </ol>
        </template>
      </Sidebar>
    </template>
  </PageLayout>
</template>
