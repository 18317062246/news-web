<script setup lang="ts">
import { flattenColumns } from '../../../services/news-api'

const route = useRoute()
const router = useRouter()
const { site } = useSite(route.params.site as string)
const { columns, articles, pageTotal, pending, error, loadColumns, loadArticles } = useNews(site)
const typeId = computed(() => Number(route.query.type) || undefined)
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))
const activeColumn = computed(() => flattenColumns(columns.value).find((column) => column.Id === typeId.value))

useHead(() => ({ title: activeColumn.value?.ColumnsName ? `${activeColumn.value.ColumnsName} - ${site.value?.title}` : site.value?.title }))

async function load() {
  await loadColumns()
  await loadArticles(typeId.value, page.value)
}

onMounted(load)
watch([typeId, page], () => { if (import.meta.client) loadArticles(typeId.value, page.value) })

function goToPage(nextPage: number) {
  router.push({ query: { ...route.query, page: nextPage } })
}
</script>

<template>
  <PageLayout :site-key="String(route.params.site)" :brand-mark="site?.brandMark || ''" :brand-title="site?.brandTitle || ''">
    <template #navigation><span class="site-nav-label">研究院观点</span></template>
    <template #main>
      <h1 class="page-title">{{ activeColumn?.ColumnsName || '文章列表' }}</h1>
      <ColumnNav :site-key="String(route.params.site)" :columns="flattenColumns(columns)" :active-id="typeId" />
      <p v-if="pending" class="notice">正在加载文章…</p>
      <div v-else-if="error" class="notice notice--error">
        <p>{{ error }}</p>
        <button class="retry-button" type="button" @click="loadArticles(typeId, page)">重试</button>
      </div>
      <ArticleList v-else :site-key="String(route.params.site)" :articles="articles" :default-image="site?.defaultImage" />
      <nav v-if="pageTotal > 1" class="pagination" aria-label="文章分页">
        <a v-if="page > 1" href="#" @click.prevent="goToPage(page - 1)">上一页</a>
        <span>第 {{ page }} / {{ pageTotal }} 页</span>
        <a v-if="page < pageTotal" href="#" @click.prevent="goToPage(page + 1)">下一页</a>
      </nav>
    </template>
  </PageLayout>
</template>
