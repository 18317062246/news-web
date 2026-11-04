import { flattenColumns, getArticle, getArticles, getColumns, normalizeArticles } from '../services/news-api'
import type { ContentPlatform } from '../services/news-api'
import type { ArticleDetail, ArticleSummary, ColumnNode } from '../types/news'
import type { SiteConfig } from '../config/sites'
import { mockArticle, mockArticles, mockColumns } from '../services/mock-news'

export function useNews(site: Ref<SiteConfig | undefined>) {
  const apiBase = useRuntimeConfig().public.apiBase as string
  const mockApi = String(useRuntimeConfig().public.mockApi) === 'true'
  const columns = ref<ColumnNode[]>([])
  const articles = ref<ArticleSummary[]>([])
  const hotArticles = ref<ArticleSummary[]>([])
  const homeSections = ref<{ column: ColumnNode; articles: ArticleSummary[] }[]>([])
  const rightSections = ref<{ column: ColumnNode; articles: ArticleSummary[] }[]>([])
  const article = ref<ArticleDetail | null>(null)
  const pageTotal = ref(0)
  const total = ref(0)
  const pending = ref(false)
  const error = ref('')
  const platform = ref<ContentPlatform>('pc')
  let lastArticleId: number | undefined
  let lastList: { typeId?: number; page: number } | undefined
  let lastView: 'home' | 'list' | 'detail' | undefined

  function syncPlatform() {
    const nextPlatform: ContentPlatform = window.matchMedia('(max-width: 767px)').matches ? 'wap' : 'pc'
    if (nextPlatform === platform.value) return
    platform.value = nextPlatform
    if (!lastView) return
    if (lastView === 'home') {
      void loadHome()
    } else if (lastArticleId) {
      void loadColumns()
      void loadArticle(lastArticleId)
    } else if (lastList) {
      void loadColumns()
      void loadArticles(lastList.typeId, lastList.page)
      void loadHotArticles()
    }
  }

  onMounted(() => {
    syncPlatform()
    window.addEventListener('resize', syncPlatform, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('resize', syncPlatform))

  async function loadColumns() {
    if (!site.value) return
    try {
      const result = mockApi ? mockColumns() : await getColumns(apiBase, site.value.apiCity, platform.value)
      if (!Array.isArray(result.Result)) throw new Error('栏目数据格式异常')
      columns.value = result.Result
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '栏目加载失败'
    }
  }

  async function loadArticles(typeId?: number, page = 1) {
    if (!site.value) return
    lastList = { typeId, page }
    lastView = 'list'
    lastArticleId = undefined
    pending.value = true
    error.value = ''
    try {
      const result = mockApi ? mockArticles() : await getArticles(apiBase, site.value.apiCity, platform.value, { typeId, page })
      articles.value = normalizeArticles(result.Result)
      pageTotal.value = Number(result.Result?.PageTotal || 0)
      total.value = Number(result.Total || 0)
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '文章加载失败'
    } finally {
      pending.value = false
    }
  }

  async function loadHotArticles() {
    if (!site.value) return
    try {
      const result = mockApi
        ? mockArticles()
        : await getArticles(apiBase, site.value.apiCity, platform.value, { page: 1, pageSize: 10 })
      hotArticles.value = normalizeArticles(result.Result).slice(0, 10)
    } catch {
      hotArticles.value = []
    }
  }

  async function loadArticle(id: number) {
    if (!site.value) return
    lastArticleId = id
    lastView = 'detail'
    lastList = undefined
    pending.value = true
    error.value = ''
    try {
      const result = mockApi ? mockArticle(id) : await getArticle(apiBase, site.value.apiCity, platform.value, id)
      if (!result.Total || !result.Result?.id) {
        article.value = null
        error.value = '文章不存在或已下架'
        return
      }
      if (result.Result.Upper === 0) {
        article.value = null
        error.value = '文章不存在或已下架'
        return
      }
      if (!columns.value.length) await loadColumns()
      const siteColumnIds = new Set(flattenColumns(columns.value).map((column) => column.Id))
      if (!result.Result.Typeid || !siteColumnIds.has(result.Result.Typeid)) {
        article.value = null
        error.value = '文章不属于当前站点'
        return
      }
      article.value = result.Result
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '文章加载失败'
    } finally {
      pending.value = false
    }
  }

  async function loadHome() {
    if (!site.value) return
    lastView = 'home'
    lastArticleId = undefined
    lastList = undefined
    pending.value = true
    error.value = ''
    await loadColumns()
    const roots = columns.value
    const mainColumns = roots.filter((column) => column.Location !== 'right' && column.Location !== 'baike')
    const sidebarColumns = roots.filter((column) => column.Location === 'right')
    try {
      const loadSection = async (column: ColumnNode) => {
        const result = mockApi
          ? mockArticles()
          : await getArticles(apiBase, site.value!.apiCity, platform.value, { typeId: column.Id, page: 1, pageSize: 10 })
        return { column, articles: normalizeArticles(result.Result) }
      }
      const [main, side] = await Promise.all([
        Promise.all(mainColumns.map(loadSection)),
        Promise.all(sidebarColumns.map(loadSection))
      ])
      homeSections.value = main.filter((section) => section.articles.length > 0)
      rightSections.value = side.filter((section) => section.articles.length > 0)
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '首页资讯加载失败'
    } finally {
      pending.value = false
    }
  }

  return { columns, articles, hotArticles, homeSections, rightSections, article, pageTotal, total, pending, error, platform, loadColumns, loadArticles, loadHotArticles, loadArticle, loadHome }
}
