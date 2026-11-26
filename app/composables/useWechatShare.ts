interface WechatShareInfo {
  title: string
  desc: string
  link: string
  imgUrl: string
}

interface WechatSdk {
  config(options: {
    debug: boolean
    appId: string
    timestamp: number
    nonceStr: string
    signature: string
    jsApiList: string[]
  }): void
  ready(callback: () => void): void
  error(callback: (error: unknown) => void): void
  updateAppMessageShareData?(info: WechatShareInfo): void
  updateTimelineShareData?(info: Omit<WechatShareInfo, 'desc'>): void
  onMenuShareAppMessage?(info: WechatShareInfo): void
  onMenuShareTimeline?(info: Omit<WechatShareInfo, 'desc'>): void
}

interface WechatTicketResponse {
  ResultNo: number
  Result?: string
}

declare global {
  interface Window {
    wx?: WechatSdk
  }
}

const wechatAppId = 'wx60781c054e21f045'
const ticketUrl = 'https://mobileapi.centanet.com/v6/java/json/reply/WeChatJsApiTicket?cityen=news&platform=wap'
let sdkPromise: Promise<WechatSdk> | undefined

function loadWechatSdk() {
  if (window.wx) return Promise.resolve(window.wx)
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<WechatSdk>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.onload = () => window.wx ? resolve(window.wx) : reject(new Error('微信 JS-SDK 未加载'))
    script.onerror = () => reject(new Error('微信 JS-SDK 加载失败'))
    document.head.appendChild(script)
  })
  return sdkPromise
}

function makeNonce() {
  const values = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(values, value => value.toString(16).padStart(2, '0')).join('')
}

async function sha1(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('')
}

function toAbsoluteUrl(value: string) {
  try {
    return new URL(value, window.location.origin).href
  } catch {
    return 'https://static.centanet.com/wap/img/m-logo.png'
  }
}

export async function updateWechatShare(info: {
  title: string
  description?: string
  image?: string
}) {
  if (!import.meta.client || !/MicroMessenger/i.test(navigator.userAgent)) return

  try {
    const [wx, ticketResponse] = await Promise.all([
      loadWechatSdk(),
      fetch(ticketUrl, { headers: { Accept: 'application/json' } })
    ])
    if (!ticketResponse.ok) throw new Error(`微信签名票据请求失败（${ticketResponse.status}）`)

    const ticketData = await ticketResponse.json() as WechatTicketResponse
    if (ticketData.ResultNo !== 0 || !ticketData.Result) throw new Error('微信签名票据无效')

    const timestamp = Math.floor(Date.now() / 1000)
    const nonceStr = makeNonce()
    const pageUrl = window.location.href.split('#')[0]
    const signatureSource = `jsapi_ticket=${ticketData.Result}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${pageUrl}`
    const signature = await sha1(signatureSource)
    const shareInfo: WechatShareInfo = {
      title: info.title || '中原地产',
      desc: info.description || '中原地产资讯',
      link: window.location.href,
      imgUrl: toAbsoluteUrl(info.image || 'https://static.centanet.com/wap/img/m-logo.png')
    }

    wx.config({
      debug: false,
      appId: wechatAppId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
      ]
    })
    wx.ready(() => {
      const timelineInfo = { title: shareInfo.title, link: shareInfo.link, imgUrl: shareInfo.imgUrl }
      wx.updateAppMessageShareData?.(shareInfo)
      wx.updateTimelineShareData?.(timelineInfo)
      wx.onMenuShareAppMessage?.(shareInfo)
      wx.onMenuShareTimeline?.(timelineInfo)
    })
    wx.error((error) => console.error('微信分享配置失败', error))
  } catch (error) {
    console.error('微信分享卡片配置失败', error)
  }
}
