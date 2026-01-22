<template>
  <div class="admin-container">
    <div class="admin-card">
      <h1 class="title">Post News</h1>

      <form @submit.prevent="submitNews">
        <div class="form-group">
          <label>News Title</label>
          <input
            type="text"
            v-model="news.title"
            placeholder="Enter news title"
            required
          />
        </div>

        <div class="form-group">
          <label>News Description</label>
          <textarea
            v-model="news.description"
            placeholder="Enter news description"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>News Date</label>
          <input type="date" v-model="news.date" required />
        </div>

        <div class="form-group">
          <label>News Image</label>
          <input type="file" @change="handleImage" />
        </div>

        <button type="submit" class="btn-submit">
          Post News
        </button>
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
  image: null,
});

const handleImage = (event) => {
  news.image = event.target.files[0];
};

const submitNews = () => {
  console.log("News Posted:", news);
  alert("News posted successfully (frontend only)");
};
</script>

<style scoped>
/* Page container */
.admin-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgb(181, 190, 211), rgb(174, 189, 199));
  font-family: Arial, Helvetica, sans-serif;
}

/* Card */
.admin-card {
  background: #ffffff;
  width: 500px;
  padding: 35px 40px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(196, 184, 184, 0.25);
}

/* Title */
.title {
  text-align: center;
  margin-bottom: 25px;
  color: #0f172a;
}

/* Form */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 14px;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5f5;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2563eb;
}

/* Button */
.btn-submit {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #1d4ed8;
}
</style>
