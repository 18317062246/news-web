export type SidebarModule =
  | { type: 'hotArticles'; title: string; desktopOnly?: boolean }
  | { type: 'relatedColumns'; title: string; desktopOnly?: boolean }
  | { type: 'banner'; title: string; image: string; href: string; desktopOnly?: boolean }

export const sidebarBySite: Record<string, SidebarModule[]> = {
  ccdata: []
}
