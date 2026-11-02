<script setup lang="ts">
import type { SidebarModule } from '../config/sidebar'

defineProps<{ items: SidebarModule[] }>()
</script>

<template>
  <div v-if="items.length" class="sidebar-modules">
    <section v-for="(item, index) in items" :key="`${item.type}-${index}`" class="sidebar-module">
      <h2 class="sidebar-module__title">{{ item.title }}</h2>
      <a v-if="item.type === 'banner'" :href="item.href">
        <img :src="item.image" :alt="item.title" class="sidebar-module__banner">
      </a>
      <slot :name="item.type" :item="item" />
    </section>
  </div>
</template>
