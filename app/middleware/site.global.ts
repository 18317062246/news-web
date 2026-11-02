import { getSiteConfig } from '../config/sites'

export default defineNuxtRouteMiddleware((to) => {
  const legacyList = to.path.match(/^\/([^/]+)\/list\/c(\d+)(?:\/p(\d+))?\/?$/)
  if (legacyList && getSiteConfig(legacyList[1])) {
    return navigateTo({
      path: `/${legacyList[1]}/list/`,
      query: {
        ...to.query,
        type: legacyList[2],
        page: legacyList[3] || to.query.page || '1'
      }
    }, { replace: true })
  }

  const legacyPage = to.path.match(/^\/([^/]+)\/list\/p(\d+)\/?$/)
  if (legacyPage && getSiteConfig(legacyPage[1])) {
    return navigateTo({ path: `/${legacyPage[1]}/list/`, query: { ...to.query, page: legacyPage[2] } }, { replace: true })
  }

  const siteParam = to.params.site
  if (!siteParam) return
  const siteKey = Array.isArray(siteParam) ? siteParam[0] : siteParam
  if (!getSiteConfig(siteKey)) {
    return abortNavigation(createError({ statusCode: 404, statusMessage: '站点不存在' }))
  }
})
