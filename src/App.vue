<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="navbar">
      <!-- Left: Logo + School Name -->
      <div class="nav-left">
        <img src="@/assets/bumba.png" alt="GS BUMBA TSS Logo" class="logo" />
        <span class="school-name">GS BUMBA TSS</span>
      </div>
      <!-- Right: Navigation Links -->
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/Admin">Admin</router-link></li>
        <li><router-link to="/student">Student</router-link></li>
        <li><router-link to="/about">About Us</router-link></li>
      </ul>
    </nav>
    <router-view />
    <FooterComponent/>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import FooterComponent from "./components/FooterComponent.vue";

const handleScroll = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Navbar container */
.navbar {
  background: #005f87;
  color: white;
  padding: 12px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Animation */
  animation: slideDown 0.8s ease-out;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

/* Shadow when scrolling (optional but professional) */
.navbar.scrolled {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* Slide down animation */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Left section */
.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo animation */
.logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.logo:hover {
  transform: scale(1.1);
}

/* School name */
.school-name {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* Navigation links */
.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

/* Hover underline animation */
.nav-links li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2px;
  background: #38bdf8;
  transition: width 0.3s ease;
}

.nav-links li a:hover::after {
  width: 100%;
}

/* Active link */
.nav-links li a.router-link-active {
  color: #38bdf8;
}

</style>