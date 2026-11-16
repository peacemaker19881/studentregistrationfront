<template>
  <main class="dashboard">
    <header>
      <div>
        <p class="eyebrow">ADMINISTRATION</p>
        <h1>Student management</h1>
      </div>
      <button type="button" :disabled="loading" @click="loadStudents">
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </header>

    <nav class="actions" aria-label="Administration tools">
      <router-link to="/admin/news">Post news</router-link>
      <router-link to="/upload">Upload course document</router-link>
      <router-link to="/upload-marks">Upload marks</router-link>
      <router-link to="/comments">Student comments</router-link>
      <button type="button" @click="logout">Sign out</button>
    </nav>

    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-else-if="students.length === 0" class="empty">No student registrations yet.</p>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Registration #</th><th>Name</th><th>Level</th><th>Trade</th><th>Email</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.registration_number }}</td>
            <td>{{ student.fullname }}</td>
            <td>{{ student.level }}</td>
            <td>{{ student.trade }}</td>
            <td>{{ student.email }}</td>
            <td><button class="delete" type="button" @click="deleteStudent(student)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/services/api";

const students = ref([]);
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function loadStudents() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await api.get("/students");
    students.value = data.students;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load student registrations.";
  } finally {
    loading.value = false;
  }
}

async function deleteStudent(student) {
  if (!window.confirm(`Delete the student record for ${student.fullname}?`)) return;
  error.value = "";
  try {
    await api.delete(`/students/${student.id}`);
    students.value = students.value.filter(item => item.id !== student.id);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to delete the student record.";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  router.push("/admin/login");
}

onMounted(loadStudents);
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 36px 20px;
}

header, .actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #087c78;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

h1 { margin: 0; }
.actions { justify-content: flex-start; flex-wrap: wrap; margin: 24px 0; }
.actions a, button {
  padding: 9px 13px;
  border: 0;
  border-radius: 4px;
  background: #087c78;
  color: white;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
button:disabled { opacity: .6; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: 12px 10px; border-bottom: 1px solid #dce4e7; white-space: nowrap; }
.delete { background: #a52c2c; }
.error { color: #a52c2c; }
.empty { padding: 24px 0; color: #60717d; }
</style>
