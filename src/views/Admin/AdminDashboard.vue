<template>
  <div class="admin-container">
    <div class="admin-card">
      <h1 class="title">Post News</h1>

      <form @submit.prevent="submitNews">
        <div class="form-group">
          <label>News Title</label>
          <input type="text" v-model="news.title" required />
        </div>

        <div class="form-group">
          <label>News Description</label>
          <textarea v-model="news.description" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label>News Date</label>
          <input type="date" v-model="news.date" required />
        </div>

        <div class="form-group">
          <label>News Image</label>
          <input type="file" @change="handleImage" />
        </div>

        <button class="btn-submit">Post News</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const news = reactive({
  title: "",
  description: "",
  date: "",
  image: ""
});

const handleImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    news.image = reader.result;
  };
  reader.readAsDataURL(file);
};

const submitNews = () => {
  const existingNews = JSON.parse(localStorage.getItem("news")) || [];

  existingNews.unshift({ ...news });

  localStorage.setItem("news", JSON.stringify(existingNews));

  alert("News posted successfully");

  news.title = "";
  news.description = "";
  news.date = "";
  news.image = "";
};
</script>

<style scoped>
.admin-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.admin-card {
  width: 400px;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input, textarea {
  width: 100%;
  padding: 8px;
}

.btn-submit {
  width: 100%;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>
