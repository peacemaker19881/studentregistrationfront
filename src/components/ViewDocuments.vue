<template>
  <div class="page">
    <h2>Available Course Documents</h2>
    <p v-if="loading" role="status">Loading documents...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else-if="documents.length === 0">No course documents are available yet.</p>
    <ul v-else>
      <li v-for="document in documents" :key="document.id">
        <a :href="`${apiOrigin}${document.url}`" target="_blank" rel="noopener">{{ document.title }}</a>
        — {{ document.course }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api, apiOrigin } from "@/services/api";

const documents = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const { data } = await api.get("/documents");
    documents.value = data.documents;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load course documents.";
  } finally {
    loading.value = false;
  }
});

</script>
