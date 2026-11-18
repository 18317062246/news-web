<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number } }>()

const message = computed(() => props.error.statusCode === 404
  ? '您访问的页面不存在或者暂时无法访问～'
  : '页面暂时无法访问～')

useHead(() => ({
  title: props.error.statusCode === 404 ? '404' : '页面错误',
  link: [{
    rel: 'icon',
    type: 'image/x-icon',
    href: 'https://static.centanet.com/news/2020071434/pc/images/favicon.ico'
  }]
}))
</script>

<template>
  <main class="error-page">
    <section class="error-page__content" role="alert">
      <img
        class="error-page__image"
        src="https://static.centanet.com/news/2020071434/pc/images/error.png"
        alt="页面错误"
      >
      <p class="error-page__message">{{ message }}</p>
    </section>
  </main>
</template>

<style scoped>
.error-page {
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  padding: 24px 16px;
  background: #fff;
}

.error-page__content {
  width: min(550px, 100%);
  text-align: center;
}

.error-page__image {
  display: block;
  width: 100%;
  height: auto;
}

.error-page__message {
  margin: 8px 0 0;
  color: #567792;
  font-size: 24px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .error-page__message {
    font-size: 18px;
  }
}
</style>
