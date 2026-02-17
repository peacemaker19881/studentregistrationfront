<template>
  <div class="page">
    <h2>Upload Course Documents</h2>

    <form @submit.prevent="submitForm">
      <input v-model="document.title" placeholder="Document Title" required /> <br><br>

      <select v-model="document.course" required>
        <option disabled value="">Select Course</option>
        <option>Software Development</option>
        <option>Computer System and Technology</option>
        <option>Accounting</option>
      </select><br><br>

      <input type="file" @change="handleFile" required /><br><br>

      <button type="submit">Upload Document</button>
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
