<template>
  <div class="home-container">
    <h1 class="page-title">News Updates</h1>

    <div class="news-grid">
      <!-- News Card 1 -->
      <div class="news-card">
        <img src="@/assets/1.png" alt="School Event" />
        <span class="date-badge">02-01-2026</span>
        <p class="news-text">
          GS BUMBA TSS highlights education as a catalyst for societal
          development through technical and vocational training.
        </p>
      </div>

      <!-- News Card 2 -->
      <div class="news-card">
        <img src="@/assets/2.jpg" alt="Student Achievement" />
        <span class="date-badge">18-1-2026</span>
        <p class="news-text">
          GS BUMBA TSS recognizes outstanding students for their contribution
          in leadership and academic excellence.
        </p>
      </div>

      <!-- News Card 3 -->
      <div class="news-card">
        <img src="@/assets/3.png" alt="Career Guidance" />
        <span class="date-badge">17-1-2026</span>
        <p class="news-text">
          Students are encouraged to develop innovative solutions and seize
          opportunities through career guidance programs.
        </p>
      </div>
            <div class="news-card">
        <img src="@/assets/4.jpg" alt="Student Achievement" />
        <span class="date-badge">18-1-2026</span>
        <p class="news-text">
          GS BUMBA TSS recognizes outstanding students for their contribution
          in leadership and academic excellence.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeComponent",
};
</script>

<style scoped>
/* Page container */
.home-container {
  padding: 40px 60px;
  background: #f9fafb;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}

/* Title */
.page-title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 40px;
  color: #0f172a;
}

/* Grid layout */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

/* Card */
.news-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.news-card:hover {
  transform: translateY(-6px);
}

/* Image */
.news-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

/* Date badge */
.date-badge {
  position: absolute;
  top: 180px;
  left: 15px;
  background: #2563eb;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
}

/* Text */
.news-text {
  padding: 20px;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}
</style>
