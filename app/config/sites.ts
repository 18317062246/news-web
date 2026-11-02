export interface SiteConfig {
  key: string
  apiCity: string
  cityName: string
  enabled: boolean
  navTitle: string
  title: string
  brandMark: string
  brandTitle: string
  staticPrefix: string
  defaultImage: string
  features: {
    search: boolean
    citySwitch: boolean
    sidebar: boolean
  }
}

const defaultImage = 'https://static.centanet.com/v7p20415/images/error/220x165_loading.gif?v202005111'

// Add one record here when a city is ready to share the site pages.
export const cityRegistry: SiteConfig[] = [

  {
    key: 'ccdata',
    apiCity: 'ccdata',
    cityName: '研究院',
    enabled: true,
    navTitle: '中原地产研究院',
    title: '中原地产_研究院观点',
    brandMark: '中原',
    brandTitle: '研究院观点',
    staticPrefix: '',
    defaultImage,
    features: { search: false, citySwitch: false, sidebar: false }
  },
  {
    key: 'tj', apiCity: 'tj', cityName: '天津', enabled: false,
    navTitle: '天津资讯', title: '天津房地产资讯', brandMark: '天津中原', brandTitle: '天津资讯',
    staticPrefix: '', defaultImage,
    features: { search: false, citySwitch: false, sidebar: false }
  },
  {
    key: 'sh', apiCity: 'sh', cityName: '上海', enabled: true,
    navTitle: '上海资讯', title: '上海房地产资讯', brandMark: '上海中原', brandTitle: '上海资讯',
    staticPrefix: '', defaultImage,
    features: { search: false, citySwitch: false, sidebar: false }
  },
  {
    key: 'bj', apiCity: 'bj', cityName: '北京', enabled: true,
    navTitle: '北京资讯', title: '北京房地产资讯', brandMark: '北京中原', brandTitle: '北京资讯',
    staticPrefix: '', defaultImage,
    features: { search: false, citySwitch: false, sidebar: false }
  }
]

export const sites: Record<string, SiteConfig> = Object.fromEntries(
  cityRegistry.map((site) => [site.key, site])
) as Record<string, SiteConfig>

export function getSiteConfig(key: string | undefined) {
  return key ? sites[key] : undefined
}

export function getEnabledSiteConfig(key: string | undefined) {
  const site = getSiteConfig(key)
  return site?.enabled ? site : undefined
}

export const enabledCities = cityRegistry.filter((site) => site.enabled)

// External city portals shown in the shared footer. Keep this separate from
// cityRegistry because these links do not imply a frontend site is enabled.
export const footerCities = [
  ['tj', '天津'], ['bj', '北京'], ['sh', '上海'], ['gz', '广州'], ['sz', '深圳'], ['mo', '澳门'], ['cq', '重庆'], ['cd', '成都'],
  ['wh', '武汉'], ['cs', '长沙'], ['hz', '惠州'], ['dg', '东莞'], ['cc', '长春'], ['dl', '大连'], ['sy', '沈阳'], ['nn', '南宁'],
  ['zj', '杭州'], ['nc', '南昌'], ['zh', '珠海'], ['xa', '西安'], ['fs', '佛山'], ['ganzhou', '赣州'], ['fz', '福州'], ['xm', '厦门'],
  ['hf', '合肥'], ['zs', '中山'], ['km', '昆明'], ['hrb', '哈尔滨'], ['nb', '宁波'], ['zq', '肇庆'], ['xy', '襄阳'], ['jn', '济南'],
  ['zz', '郑州'], ['hq', '横琴'], ['lz', '兰州']
] as const
