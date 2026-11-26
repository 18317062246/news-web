import { getEnabledSiteConfig } from '../../app/config/sites'
import { getArticle } from '../../app/services/news-api'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character] || character)
}

function shareImage(value: string | undefined) {
  if (!value) return 'https://static.centanet.com/wap/img/m-logo.png'
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : 'https://static.centanet.com/wap/img/m-logo.png'
  } catch {
    return 'https://static.centanet.com/wap/img/m-logo.png'
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    if (event.method !== 'GET' || response.statusCode !== 200 || typeof response.body !== 'string') return

    const path = new URL(event.path, 'http://localhost').pathname
    const match = path.match(/^\/([^/]+)\/detail\/(\d+)\.html$/)
    if (!match) return

    const site = getEnabledSiteConfig(match[1])
    const articleId = Number(match[2])
    if (!site || !Number.isSafeInteger(articleId) || articleId <= 0) return

    try {
      const apiBase = String(useRuntimeConfig().public.apiBase)
      const result = await getArticle(apiBase, site.apiCity, 'wap', articleId, AbortSignal.timeout(2000))
      const article = result.Result
      if (!result.Total || article?.id !== articleId || article.Upper === 0 || !article.Title) return

      const title = escapeHtml(article.Title)
      const description = escapeHtml(article.Description || article.ShareTitle || '')
      const image = escapeHtml(shareImage(article.LitPic))
      const meta = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta property="og:type" content="article">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:image" content="${image}">`
      ].join('')
      response.body = response.body.replace('</head>', `${meta}</head>`)
    } catch (error) {
      console.error('文章分享信息加载失败', error)
    }
  })
})
