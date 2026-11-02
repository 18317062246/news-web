import type { ApiEnvelope, ArticleDetail, ArticleListResult, ArticleSummary, ColumnNode } from '../types/news'

const columns: ColumnNode[] = [
  { Id: 101, ColumnsName: '市场观察' },
  { Id: 102, ColumnsName: '行业研究' },
  { Id: 103, ColumnsName: '城市数据' },
  { Id: 104, ColumnsName: '政策解读' }
]

const articles: ArticleSummary[] = [
  { ID: 9001, Title: '房地产市场运行情况与趋势观察', Description: '这里是本地开发演示数据。接入真实 API 后将显示线上资讯内容。', PublishDate: '2026-10-29', TypeName: '市场观察' },
  { ID: 9002, Title: '重点城市房地产市场研究报告', Description: '用于验收首页图文列表、栏目切换和文章详情布局。', PublishDate: '2026-10-28', TypeName: '行业研究' },
  { ID: 9003, Title: '城市住房数据月度分析', Description: '演示数据不会进入生产环境，也不会替代内容服务。', PublishDate: '2026-10-27', TypeName: '城市数据' }
]

export function mockColumns(): ApiEnvelope<ColumnNode[]> {
  return { Success: true, Msg: 'mock', Result: columns }
}

export function mockArticles(): ApiEnvelope<ArticleListResult> {
  return { Success: true, Msg: 'mock', Result: { NewsList: articles, PageTotal: 1 }, Total: articles.length }
}

export function mockArticle(id: number): ApiEnvelope<ArticleDetail> {
  const item = articles.find((article) => article.ID === id)
  return {
    Success: Boolean(item),
    Msg: item ? 'mock' : '文章不存在或已下架',
    Result: item ? { id: item.ID, Title: item.Title, Description: item.Description, PublishDate: item.PublishDate, Typename: item.TypeName, Typeid: 101, Upper: 1, Content: `<p>${item.Description}</p><p>这是本地开发演示正文。</p>` } : {},
    Total: item ? 1 : 0
  }
}
