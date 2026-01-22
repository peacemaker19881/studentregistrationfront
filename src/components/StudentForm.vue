<template>
  <div class="form-container">
    <h2>Student Registration</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label>Names</label>
        <input type="text" v-model="student.names" required />
      </div>

      <div>
        <label>Sex</label>
        <select v-model="student.sex" required>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div>
        <label>Phone</label>
        <input type="text" v-model="student.phone" required />
      </div>

      <div>
        <label>Trade</label>
        <input type="text" v-model="student.trade" required />
      </div>

      <button type="submit">Save Student</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "StudentForm",
  data() {
    return {
      student: {
        names: "",
        sex: "",
        phone: "",
        trade: ""
      }
    };
  },
  methods: {
    submitForm() {
      console.log("Student Data:", this.student);
      alert("Student registered successfully");
      
      // Reset form
      this.student = {
        names: "",
        sex: "",
        phone: "",
        trade: ""
      };
    }
  }
};
</script>

<style scoped>
.form-container {
  width: 400px;
  margin: auto;
}
form div {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
}
input, select {
  width: 100%;
  padding: 6px;
}
button {
  padding: 8px 15px;
}
</style>
