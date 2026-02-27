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

      <button class="btn-submit" type="submit">Upload Document</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "UploadDocuments",
  data() {
    return {
      document: {
        title: "",
        course: "",
        file: null
      }
    };
  },
  methods: {
    handleFile(event) {
      this.document.file = event.target.files[0];
    },
    submitForm() {
      console.log("Document data to send:", this.document);
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
