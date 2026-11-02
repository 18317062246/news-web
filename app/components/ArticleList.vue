<script setup lang="ts">
import type { ArticleSummary } from '../types/news'

const props = defineProps<{ siteKey: string; articles: ArticleSummary[]; defaultImage?: string }>()

function articleHref(siteKey: string, id: number) {
  return `/${siteKey}/detail/${id}.html`
}

function imageUrl(url: string | undefined, size: 'desktop' | 'mobile') {
  if (!url) return props.defaultImage
  const match = url.match(/^(.*)(\.[^./?#]+)([?#].*)?$/)
  if (!match) return url
  const suffix = size === 'desktop' ? '_450x320_w' : '_180x130_c'
  return `${match[1]}${suffix}${match[2]}${match[3] || ''}`
}

function onImageError(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  if (image.src !== props.defaultImage && props.defaultImage) image.src = props.defaultImage
}

function formatPublishDate(value: string | number | undefined) {
  if (value === undefined || value === '') return ''
  const numericValue = Number(value)
  const date = Number.isFinite(numericValue)
    ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date)
}
</script>

<template>
  <div v-if="articles.length" class="article-list">
    <article v-for="article in articles" :key="article.ID" class="article-row">
      <NuxtLink :to="articleHref(siteKey, article.ID)" class="article-row__link">
        <picture>
          <source media="(max-width: 767px)" :srcset="imageUrl(article.LitPic, 'mobile')">
          <img class="article-row__image" :src="imageUrl(article.LitPic, 'desktop')" alt="" loading="lazy" @error="onImageError">
        </picture>
        <span class="article-row__copy">
          <span class="article-row__title">{{ article.Title }}</span>
          <span v-if="article.Description" class="article-row__description">{{ article.Description }}</span>
          <span class="article-row__meta">{{ formatPublishDate(article.PublishDate) }}<span v-if="article.TypeName"> · {{ article.TypeName }}</span></span>
        </span>
      </NuxtLink>
    </article>
  </div>
  <p v-else class="empty-state">暂无文章</p>
</template>
