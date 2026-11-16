<template>
  <main class="upload-page">
    <header class="page-header">
      <p class="eyebrow">ACADEMIC RECORDS</p>
      <h1>Upload student marks</h1>
      <p>Upload an Excel workbook (.xlsx) to publish student results.</p>
    </header>

    <form class="upload-form" @submit.prevent="uploadMarks">
      <label class="file-field" for="marks-file">
        <span>Excel workbook</span>
        <input
          id="marks-file"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
          @change="selectFile"
        />
      </label>

      <p class="file-hint">Use a workbook with columns for registration number, level, subject, term, score, maximum score, and grade.</p>

      <button class="submit-button" type="submit" :disabled="!file || uploading">
        {{ uploading ? "Uploading..." : "Upload marks" }}
      </button>

      <p v-if="successMessage" class="status success" role="status">{{ successMessage }}</p>
      <p v-if="errorMessage" class="status error" role="alert">{{ errorMessage }}</p>
    </form>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const file = ref(null);
const uploading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const selectFile = event => {
  const selectedFile = event.target.files?.[0] || null;
  file.value = selectedFile?.name.toLowerCase().endsWith(".xlsx") ? selectedFile : null;
  successMessage.value = "";
  errorMessage.value = selectedFile && !file.value ? "Choose an .xlsx Excel workbook." : "";
};

const uploadMarks = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append("file", file.value);
  uploading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await axios.post("http://localhost:4000/api/marks/upload", formData, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    successMessage.value = response.data?.message || "Marks uploaded successfully.";
    file.value = null;
    document.getElementById("marks-file").value = "";
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to upload marks.";
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.upload-page {
  max-width: 760px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 48px 24px 64px;
  color: #172b3a;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #087c78;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 34px;
  font-weight: 600;
}

.page-header p:last-child {
  margin: 10px 0 0;
  color: #60717d;
}

.upload-form {
  display: grid;
  gap: 16px;
  max-width: 620px;
  padding: 22px 0;
  border-top: 1px solid #dce4e7;
  border-bottom: 1px solid #dce4e7;
}

.file-field {
  display: grid;
  gap: 8px;
  color: #435562;
  font-size: 14px;
  font-weight: 600;
}

.file-field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdcbd0;
  border-radius: 4px;
  background: white;
  color: #172b3a;
  font: inherit;
}

.file-hint {
  margin: 0;
  color: #60717d;
  font-size: 13px;
  line-height: 1.5;
}

.submit-button {
  justify-self: start;
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 4px;
  background: #087c78;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-size: 14px;
}

.success {
  color: #17653c;
}

.error {
  color: #a52c2c;
}

@media (max-width: 600px) {
  .upload-page {
    padding: 32px 16px 48px;
  }

  h1 {
    font-size: 29px;
  }
}
</style>