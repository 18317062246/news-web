export interface ApiEnvelope<T> {
  Success: boolean
  Code?: number
  Msg?: string
  Result: T
  Total?: number
}

export interface ColumnNode {
  Id: number
  ColumnsName: string
  Url?: string
  Location?: string
  TopId?: number
  ChildList?: ColumnNode[] | null
}

export interface ArticleSummary {
  ID: number
  Title: string
  Source?: string
  Writer?: string
  PublishDate?: string
  Description?: string
  LitPic?: string
  TypeName?: string
  TypeID?: number
  ShareTitle?: string
}

export interface ArticleDetail {
  id?: number
  Title?: string
  Content?: string
  PublishDate?: string
  Sources?: string
  Write?: string
  Description?: string
  LitPic?: string
  Typename?: string
  Typeid?: number
  Upper?: number
  ShareTitle?: string
}

export interface ArticleListResult {
  NewsList?: ArticleSummary[] | null
  PageTotal?: number
}
