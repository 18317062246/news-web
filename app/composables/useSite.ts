import { getSiteConfig, enabledCities } from '../config/sites'

export function useSite(siteKey: string | Ref<string | undefined>) {
  const key = computed(() => unref(siteKey) || enabledCities[0]?.key || 'ccdata')
  const site = computed(() => getSiteConfig(key.value))
  const config = useRuntimeConfig()
  const apiBase = computed(() => String(config.public.apiBase || '/api/'))
  return { key, site, apiBase }
}
