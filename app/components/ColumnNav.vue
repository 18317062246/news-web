<script setup lang="ts">
import type { ColumnNode } from '../types/news'

defineProps<{ siteKey: string; columns: ColumnNode[]; activeId?: number }>()

function columnHref(siteKey: string, id: number) {
  return `/${siteKey}/list/?type=${id}&page=1`
}
</script>

<template>
  <nav v-if="columns.length" class="column-nav" aria-label="文章栏目">
    <NuxtLink
      v-for="column in columns"
      :key="column.Id"
      :to="columnHref(siteKey, column.Id)"
      :aria-current="activeId === column.Id ? 'page' : undefined"
      class="column-nav__link"
      :class="{ 'is-active': activeId === column.Id }"
    >
      {{ column.ColumnsName }}
    </NuxtLink>
  </nav>
</template>
