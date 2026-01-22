<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        © {{ currentYear }} — Copyright by
        <span class="owner">IT Jean de la Paix</span>
      </p>
      <div class="social-links">
        <a href="https://www.youtube.com" target="_blank" class="youtube">YouTube</a>
        <a href="https://x.com" target="_blank" class="x">X</a>
        <a href="https://www.facebook.com" target="_blank" class="facebook">Facebook</a>
        <a href="https://www.instagram.com" target="_blank" class="instagram">Instagram</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>
<style scoped>
.footer {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: #ffffff;
  padding: 8px 8px;
  margin-top: 10px;
}
.footer-content {
  max-width: 1000px;
  margin: auto;
  text-align: center;
}
.copyright {
  font-size: 14px;
  margin-bottom: 12px;
}

.owner {
  font-weight: bold;
  color: #ffd700;
}

/* Social links container */
.social-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* Base social link style */
.social-links a {
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  transition: all 0.3s ease;
}

/* Individual platform colors */
.youtube {
  background-color: #ff0000;
}

.x {
  background-color: #000000;
}

.facebook {
  background-color: #1877f2;
}

.instagram {
  background: linear-gradient(
    45deg,
    #f09433,
    #e6683c,
    #dc2743,
    #cc2366,
    #bc1888
  );
}

/* Hover effect */
.social-links a:hover {
  transform: translateY(-3px);
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 600px) {
  .social-links {
    gap: 10px;
  }

  .social-links a {
    padding: 7px 14px;
    font-size: 13px;
  }
}
</style>
