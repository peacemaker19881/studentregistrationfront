<template>
  
  
  
  
  
  
  <section class="news">
    <h2>Latest News</h2>

    <div v-if="news.length === 0">
      No news available.
    </div>

    <div v-for="item in news" :key="item.id" class="news-card">
      <h3>{{ item.title }}</h3>
      <p>{{ item.content }}</p>
      <small>{{ item.date }}</small>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const news = ref([])

onMounted(() => {
  news.value = JSON.parse(localStorage.getItem('news')) || []
})
</script>
