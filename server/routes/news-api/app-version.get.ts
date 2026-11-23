interface AppVersionResponse {
  Result?: {
    version?: string
    currentVersionReleaseDate?: string
  }
}

export default defineEventHandler(async () => {
  try {
    const response = await $fetch<AppVersionResponse>(
      'https://mobileapi.centanet.com/bizcom/java/json/reply/AppVersionRequest',
      { query: { cityen: 'sh', platform: 'pc' } }
    )
    const version = response.Result?.version
    const currentVersionReleaseDate = response.Result?.currentVersionReleaseDate

    if (!version || !currentVersionReleaseDate) {
      throw createError({ statusCode: 502, statusMessage: '版本信息格式异常' })
    }

    return { version, currentVersionReleaseDate }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 502, statusMessage: '暂时无法获取 APP 版本信息' })
  }
})
