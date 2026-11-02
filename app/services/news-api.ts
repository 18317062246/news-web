import type {
  ApiEnvelope,
  ArticleDetail,
  ArticleListResult,
  ArticleSummary,
  ColumnNode
} from '../types/news'

export class NewsApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'NewsApiError'
  }
}

async function request<T>(base: string, endpoint: string, query: Record<string, string | number | undefined>, signal?: AbortSignal) {
  const origin = import.meta.client ? window.location.origin : 'http://localhost'
  const url = new URL(endpoint, new URL(base, origin))
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  let response: Response
  try {
    const timeout = AbortSignal.timeout(8000)
    const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout
    response = await fetch(url, { signal: requestSignal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError' && signal?.aborted) throw error
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new NewsApiError('内容服务响应超时，请稍后重试')
    }
    throw new NewsApiError('暂时无法连接内容服务，请检查网络后重试')
  }

  if (!response.ok) throw new NewsApiError(`内容服务请求失败（${response.status}）`, response.status)

  let envelope: ApiEnvelope<T>
  try {
    envelope = await response.json() as ApiEnvelope<T>
  } catch {
    throw new NewsApiError('内容服务返回的数据格式无法识别')
  }
  if (!envelope.Success) throw new NewsApiError(envelope.Msg || '内容服务暂不可用')
  return envelope
}

export type ContentPlatform = 'pc' | 'wap'

export function getColumns(base: string, city: string, platform: ContentPlatform, signal?: AbortSignal) {
  return request<ColumnNode[]>(base, 'getcolumnlist', { cityen: city, platform }, signal)
}

export function getArticles(base: string, city: string, platform: ContentPlatform, options: { typeId?: number; page?: number; pageSize?: number }, signal?: AbortSignal) {
  return request<ArticleListResult>(base, 'getnewslist', {
    cityen: city,
    platform,
    typeid: options.typeId,
    page: options.page ?? 1,
    pagesize: options.pageSize ?? 15,
    order: 0,
    isdesc: 0,
    upper: 1
  }, signal)
}

export function getArticle(base: string, city: string, platform: ContentPlatform, id: number, signal?: AbortSignal) {
  return request<ArticleDetail>(base, 'getnewscontent', { cityen: city, platform, newsid: id }, signal)
}

export function flattenColumns(columns: ColumnNode[] = []): ColumnNode[] {
  return columns.flatMap((column) => [column, ...flattenColumns(column.ChildList ?? [])])
}

export function normalizeArticles(result: ArticleListResult | undefined): ArticleSummary[] {
  if (!result?.NewsList) return []
  if (!Array.isArray(result.NewsList)) throw new NewsApiError('文章列表格式异常')
  return result.NewsList.filter((item) => Number.isFinite(Number(item.ID)) && Boolean(item.Title))
}
