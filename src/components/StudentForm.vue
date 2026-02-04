<template>
  <div class="registration-container">
    <form class="registration-card" @submit.prevent="submitForm">
      <h2 class="title">Student Registration</h2>

      <div class="form-group">
        <label>Full Names</label>
        <input type="text" v-model="form.names" required />
      </div>

      <div class="form-group">
        <label>Sex</label>
        <select v-model="form.sex" required>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div class="form-group">
        <label>Date of Birth</label>
        <input type="date" v-model="form.dob" required />
      </div>

      <div class="form-group">
        <label>Address</label>
        <input type="text" v-model="form.address" required />
      </div>

      <div class="form-group">
        <label>Parent Phone</label>
        <input type="tel" v-model="form.parentphone" placeholder="07XXXXXXXX" required />
      </div>

      <div class="form-group">
        <label>Trade</label>
        <select v-model="form.trade" required>
          <option value="">Select Trade</option>
          <option>Software Development</option>
          <option>Computer Systems and Technology</option>
          <option>Accounting</option>
        </select>
      </div>

      <div class="form-group">
        <label>Level</label>
        <select v-model="form.level" required>
          <option value="">Select Level</option>
          <option>L3</option>
          <option>L4</option>
          <option>L5</option>
          <option>Y1ACC</option>
          <option>Y2ACC</option>
          <option>Y3ACC</option>
        </select>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="form.email" required />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="form.password" required />
      </div>

      <button class="btn-submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  names: "",
  sex: "",
  dob: "",
  address: "",
  parentphone: "",
  trade: "",
  level: "",
  email: "",
  password: ""
});

const submitForm = () => {
  console.log("Student Data:", form);
  alert("Registration submitted successfully!");
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
