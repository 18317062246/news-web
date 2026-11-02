export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/',
    buildAssetsDir: '/_ccdata_assets/',
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'stylesheet', href: 'https://static.centanet.com/news/2024121377/pc/css/cent_basev3.css' },
        { rel: 'stylesheet', href: 'https://static.centanet.com/news/2024121377/pc/css/icons.css' },
        { rel: 'stylesheet', href: 'https://static.centanet.com/news/2024121377/pc/css/keio.css' },
        { rel: 'icon', type: 'image/x-icon', href: 'https://static.centanet.com/news/2024121377/pc/images/favicon.ico' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffffff' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://news.centanet.com/api/',
      staticBase: '',
      mockApi: false
    }
  },
  css: ['~/assets/css/main.css'],
  typescript: { strict: true, typeCheck: true }
})
