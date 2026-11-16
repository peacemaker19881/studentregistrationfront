<template>
  <div class="registration-container">
    
    <form class="registration-card" @submit.prevent="submitForm">
      <h2>Upload Course Documents</h2>
      <input v-model="document.title" placeholder="Document Title" required /> <br><br>
      <div class="form-group">
        <select v-model="document.course" required>
        <option disabled value="">Select Course</option>
        <option>Software Development</option>
        <option>Computer System and Technology</option>
        <option>Accounting</option>
      </select><br><br>
      </div>
      

      <input type="file" @change="handleFile" required /><br><br>

      <button class="btn-submit" type="submit" :disabled="uploading">{{ uploading ? "Uploading..." : "Upload Document" }}</button>
      <p v-if="message" role="status">{{ message }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { api } from "@/services/api";

export default {
  name: "UploadDocuments",
  data() {
    return {
      document: {
        title: "",
        course: "",
        file: null
      },
      uploading: false,
      message: "",
      error: ""
    };
  },
  methods: {
    handleFile(event) {
      this.document.file = event.target.files[0];
    },
    async submitForm() {
      if (!this.document.file) return;
      this.uploading = true;
      this.message = "";
      this.error = "";
      const formData = new FormData();
      formData.append("title", this.document.title);
      formData.append("course", this.document.course);
      formData.append("file", this.document.file);
      try {
        const { data } = await api.post("/documents", formData);
        this.message = data.message;
        this.document = { title: "", course: "", file: null };
      } catch (error) {
        this.error = error.response?.data?.message || "Document upload failed.";
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
<style scoped>
.registration-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f4c75, #3282b8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.registration-card {
  background: white;
  width: 420px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,.25);
}

.title {
  text-align: center;
  margin-bottom: 25px;
  color: #0f4c75;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

input:focus, select:focus {
  outline: none;
  border-color: #3282b8;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #0f4c75;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-submit:hover {
  background: #1b6ca8;
}
</style>
