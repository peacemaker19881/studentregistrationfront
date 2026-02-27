<template>
  <div class="news-form">
    <h2>📰 Post News</h2>

    <input v-model="title" placeholder="News Title" />
    <textarea v-model="description" placeholder="News Description"></textarea>
    <input type="date" v-model="news_date" />
    <input type="file" @change="handleFile" />

    <button @click="submitNews">Post News</button>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostNews",
  data() {
    return {
      title: "",
      description: "",
      news_date: "",
      image: null,
      success: "",
      error: ""
    };
  },
  methods: {
    handleFile(e) {
      this.image = e.target.files[0];
    },

    async submitNews() {
      if (!this.title || !this.description) {
        this.error = "All fields are required";
        return;
      }

      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("news_date", this.news_date);
      if (this.image) formData.append("image", this.image);

      try {
        await axios.post(
          "http://localhost:4000/api/news",
          formData,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "multipart/form-data"
            }
          }
        );

        this.success = "News posted successfully ✔";
        this.error = "";

        // clear form
        this.title = "";
        this.description = "";
        this.news_date = "";
        this.image = null;
      } catch (err) {
        this.error = "Failed to post news";
      }
    }
  }
};
</script>

<style scoped>
.news-form {
  max-width: 600px;
  margin: auto;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.news-form h2 {
  text-align: center;
  margin-bottom: 20px;
}

.news-form input,
.news-form textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.news-form button {
  width: 100%;
  padding: 12px;
  background: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.success { color: green; margin-top: 10px; }
.error { color: red; margin-top: 10px; }
</style>
