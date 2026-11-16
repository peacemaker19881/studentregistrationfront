<template>
  <main class="marks-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">ACADEMIC RECORDS</p>
        <h1>Student marks</h1>
        <p class="page-description">Review student results by level, subject, and term.</p>
      </div>
      <button class="refresh-button" type="button" :disabled="loading" @click="fetchMarks">
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </header>

    <section class="filters" aria-label="Filter student marks">
      <label class="search-field">
        <span>Search</span>
        <input v-model="search" type="search" placeholder="Student by RegistrationNumber" />
      </label>
      <label>
        <span>Level</span>
        <select v-model="selectedLevel">
          <option value="">All levels</option>
          <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
        </select>
      </label>
      <label>
        <span>Term</span>
        <select v-model="selectedTerm">
          <option value="">All terms</option>
          <option v-for="term in terms" :key="term" :value="term">{{ term }}</option>
        </select>
      </label>
    </section>

    <p v-if="errorMessage" class="status-message error-message" role="alert">
      {{ errorMessage }}
    </p>
    <p v-else-if="loading" class="status-message" role="status">Loading marks...</p>
    <p v-else-if="filteredMarks.length === 0" class="status-message">
      {{ marks.length ? "No marks match these filters." : "No student marks are available yet." }}
    </p>

    <section v-else class="results" aria-label="Student marks results">
      <p class="result-count">{{ filteredMarks.length }} result{{ filteredMarks.length === 1 ? "" : "s" }}</p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Student</th>
              <th scope="col">Level</th>
              <th scope="col">Subject</th>
              <th scope="col">Term</th>
              <th scope="col">Mark</th>
              <th scope="col">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mark, index) in filteredMarks" :key="mark.mark_id ?? mark.id ?? index">
              <td class="student-name">{{ mark.fullname }}</td>
              <td>{{ mark.level }}</td>
              <td>{{ mark.subject }}</td>
              <td>{{ mark.term }}</td>
              <td>
                {{ mark.score }}<span v-if="mark.max_score != null"> / {{ mark.max_score }}</span>
              </td>
              <td>{{ mark.grade || "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/services/api";

const marks = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const search = ref("");
const selectedLevel = ref("");
const selectedTerm = ref("");

const levels = computed(() => [...new Set(marks.value.map(mark => mark.level).filter(Boolean))].sort());
const terms = computed(() => [...new Set(marks.value.map(mark => mark.term).filter(Boolean))].sort());

const filteredMarks = computed(() => {
  const query = search.value.trim().toLowerCase();

  return marks.value.filter(mark => {
    const matchesSearch = !query ||
      `${mark.registration_number} ${mark.fullname} ${mark.subject}`.toLowerCase().includes(query);
    const matchesLevel = !selectedLevel.value || mark.level === selectedLevel.value;
    const matchesTerm = !selectedTerm.value || mark.term === selectedTerm.value;

    return matchesSearch && matchesLevel && matchesTerm;
  });
});

const fetchMarks = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/marks/my");
    const records = Array.isArray(response.data) ? response.data : response.data?.marks;

    if (!Array.isArray(records)) {
      throw new Error("The marks API must return an array of mark records.");
    }

    marks.value = records;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || "Failed to load student marks.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMarks);
</script>

<style scoped>
.marks-page {
  max-width: 1120px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 40px 24px 64px;
  color: #172b3a;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
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

.page-description {
  margin: 8px 0 0;
  color: #60717d;
}

.refresh-button {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  background: #087c78;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.refresh-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.filters {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) repeat(2, minmax(150px, 210px));
  gap: 16px;
  padding: 18px 0;
  border-top: 1px solid #dce4e7;
  border-bottom: 1px solid #dce4e7;
}

.filters label {
  display: grid;
  gap: 7px;
  color: #435562;
  font-size: 13px;
  font-weight: 600;
}

.filters input,
.filters select {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #bdcbd0;
  border-radius: 4px;
  background: white;
  color: #172b3a;
  font: inherit;
}

.status-message {
  padding: 30px 0;
  color: #60717d;
}

.error-message {
  color: #a52c2c;
}

.result-count {
  margin: 20px 0 10px;
  color: #60717d;
  font-size: 13px;
}

.table-scroll {
  overflow-x: auto;
  border-top: 1px solid #bdcbd0;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid #e1e8ea;
  white-space: nowrap;
}

th {
  color: #526671;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

td {
  color: #344957;
  font-size: 14px;
}

.student-name {
  color: #172b3a;
  font-weight: 600;
}

@media (max-width: 640px) {
  .marks-page {
    padding: 28px 16px 48px;
  }

  .page-header {
    align-items: flex-start;
  }

  h1 {
    font-size: 29px;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}
</style>