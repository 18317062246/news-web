import { getSiteConfig } from '../config/sites'

export function useSite(siteKey: string | Ref<string | undefined>) {
  const key = computed(() => unref(siteKey) || 'ccdata')
  const site = computed(() => getSiteConfig(key.value))
  const config = useRuntimeConfig()
  const apiBase = computed(() => String(config.public.apiBase || '/api/'))
  return { key, site, apiBase }
}
