<template>
  <div class="about-container">
    <div class="about-card">
      <h1 class="title">About GS BUMBA TSS</h1>

      <p class="description">
        GS BUMBA TSS is a Technical Secondary School committed to providing
        quality education and practical skills that prepare students for
        higher education and the job market. The school focuses on competence-
        based learning aligned with national education standards.
      </p>

      <h2 class="subtitle">Our Trades</h2>
      <ul class="trade-list">
        <li>Computer Systems and Technology</li>
        <li>Software Development</li>
        <li>Accounting</li>
      </ul>

      <h2 class="subtitle">Contact Information</h2>
      <div class="contact-info">
        <p><strong>Location:</strong> Karambi Village ,Bumba Cell ,Mushubati Sector, Rutsiro District ,Rwanda</p>
        <p><strong>Phone:</strong> +250 788 860 155</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUsComponent",
};
</script>

<style scoped>
/* Page background */
.about-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  font-family: Arial, Helvetica, sans-serif;
}

/* Card layout */
.about-card {
  background: #ffffff;
  width: 650px;
  padding: 10px 10px;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Headings */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #0f172a;
}

.subtitle {
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #0f766e;
}

/* Text */
.description {
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  text-align: justify;
}

/* Trade list */
.trade-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trade-list li {
  background: #f0fdfa;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-left: 5px solid #14b8a6;
  border-radius: 6px;
  font-size: 15px;
  color: #134e4a;
}

/* Contact section */
.contact-info p {
  margin: 6px 0;
  font-size: 15px;
  color: #1f2937;
}
</style>
