<script setup lang="ts">
import DOMPurify from 'dompurify'
const route = useRoute()
const { site } = useSite(route.params.site as string)
const { article, pending, error, loadArticle } = useNews(site)
const safeContent = computed(() => article.value?.Content ? DOMPurify.sanitize(article.value.Content, {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload']
}) : '')

useHead(() => ({ title: article.value?.Title ? `${article.value.Title} - ${site.value?.title || ''}` : site.value?.title }))

onMounted(() => {
  const id = Number(String(route.params.id).replace(/\.html$/, ''))
  if (Number.isInteger(id) && id > 0) {
    loadArticle(id)
  } else {
    error.value = '文章不存在或链接无效'
  }
})
</script>

<template>
  <PageLayout :site-key="String(route.params.site)" :brand-mark="site?.brandMark || ''" :brand-title="site?.brandTitle || ''">
    <template #navigation><span class="site-nav-label">{{ site?.navTitle || site?.brandTitle }}</span></template>
    <template #main>
      <div v-if="pending" class="notice">正在加载文章…</div>
      <div v-else-if="error" class="notice notice--error">{{ error }}</div>
      <article v-else-if="article" class="article-detail">
        <h1 class="article-detail__title">{{ article.Title }}</h1>
        <div class="article-detail__meta">{{ article.PublishDate }}<span v-if="article.Sources"> · {{ article.Sources }}</span></div>
        <div class="article-body" v-html="safeContent" />
      </article>
    </template>
  </PageLayout>
</template>
