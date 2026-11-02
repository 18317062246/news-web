<script setup lang="ts">
import { sidebarBySite } from '../../config/sidebar'
const route = useRoute()
const { site, key } = useSite(route.params.site as string)
const { homeSections, rightSections, pending, error, loadHome } = useNews(site)
const sidebarItems = computed(() => sidebarBySite[key.value] || [])
const activeId = ref<number | undefined>()
const visibleSection = computed(() => homeSections.value.find(({ column }) => column.Id === activeId.value) || homeSections.value[0])

watch(homeSections, (sections) => {
  const first = sections[0]
  if (first && !sections.some(({ column }) => column.Id === activeId.value)) activeId.value = first.column.Id
}, { immediate: true })

useHead(() => ({ title: site.value?.title || '研究院观点' }))

onMounted(async () => {
  await loadHome()
})
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
