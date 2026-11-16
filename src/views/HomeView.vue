<template>
  <div class="home">
    <h1>Latest School News</h1>

    <div v-if="newsList.length === 0">
      <p>No news available.</p>
    </div>

    <div class="news-grid">
      <div class="news-card" v-for="item in newsList" :key="item.id">
        <img v-if="item.image" :src="`${apiOrigin}${item.image}`" :alt="item.title" />
        <h3>{{ item.title }}</h3>
        <small>{{ item.date }}</small>
        <p>{{ item.description }}</p>
      </div>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api, apiOrigin } from "@/services/api";

const newsList = ref([]);
const error = ref("");

onMounted(async () => {
  try {
    const { data } = await api.get("/news");
    newsList.value = data.news;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load school news.";
  }
});
</script>

<style scoped>
.home {
  padding: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.news-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,.15);
}

.news-card img {
  width: 100%;
  border-radius: 8px;
}
</style>
