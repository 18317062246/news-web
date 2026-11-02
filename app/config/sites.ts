export interface SiteConfig {
  key: string
  apiCity: string
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

export const sites: Record<string, SiteConfig> = {
  ccdata: {
    key: 'ccdata',
    apiCity: 'ccdata',
    title: '中原地产_研究院观点',
    brandMark: '中原',
    brandTitle: '研究院观点',
    staticPrefix: '',
    defaultImage: 'https://static.centanet.com/v7p20415/images/error/220x165_loading.gif?v202005111',
    features: {
      search: false,
      citySwitch: false,
      sidebar: false
    }
  }
}

export function getSiteConfig(key: string | undefined) {
  return key ? sites[key] : undefined
}
