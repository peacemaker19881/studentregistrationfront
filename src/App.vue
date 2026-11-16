<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <!-- Left: Logo + School Name -->
      <div class="nav-left">
        <img :src="logo" alt="GS BUMBA TSS Logo" class="logo" />
        <span class="school-name">GS BUMBA TSS</span>
      </div>

      <!-- Toggle (visible on small screens) -->
      <button
        class="navbar__toggle"
        @click="toggle"
        :aria-expanded="open.toString()"
        aria-controls="primary-navigation"
        aria-label="Toggle navigation"
      >
        <span class="sr-only">Toggle navigation</span>
        <svg class="hamburger" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Right: Navigation Links -->
      <ul
        id="primary-navigation"
        class="nav-links"
        :class="{ 'is-open': open }"
        @keydown.esc.prevent="close"
      >
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/Admin">Post News</router-link></li>
        <li><router-link to="/comments">Comments</router-link></li>
        <li><router-link to="/student">Register Student</router-link></li>
        <li><router-link to="/upload">Upload</router-link></li>
        <li><router-link to="/Documents">Documents</router-link></li>
        <li><router-link to="/marks">View Marks</router-link></li>
        <li><router-link to="/upload-marks">Upload Marks</router-link></li>
        <li><router-link to="/about">About Us</router-link></li>
      </ul>
    </nav>

    <!-- Backdrop for mobile menu (click to close) -->
    <div v-if="open" class="backdrop" @click="close" aria-hidden="true"></div>

    <router-view />
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import FooterComponent from "./components/FooterComponent.vue";
import logo from "@/assets/bumba.png";

const open = ref(false);
const breakpoint = 768; // px - match desktop breakpoint

const toggle = () => { open.value = !open.value };
const close = () => { open.value = false };

const handleResize = () => {
  // Ensure mobile menu closes automatically when switching to desktop width
  if (window.innerWidth >= breakpoint && open.value) close();
};

const handleKey = (e) => {
  if (e.key === "Escape") close();
};

onMounted(() => {
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("keydown", handleKey);
});

// Close menu on route change
const route = useRoute();
watch(() => route.fullPath, () => {
  close();
});
</script>

<style scoped>
/* Mobile-first base */
.navbar {
  background: #005f87;
  color: white;
  padding: env(safe-area-inset-top, 12px) env(safe-area-inset-right, 16px) 12px env(safe-area-inset-left, 16px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideDown 0.5s ease-out;
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

/* Logo */
.logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  transition: transform 0.25s ease;
}
.logo:hover { transform: scale(1.05); }

/* School name */
.school-name {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* Toggle button (visible on small screens) */
.navbar__toggle {
  background: transparent;
  border: none;
  color: inherit;
  padding: 10px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
}
.navbar__toggle:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }

/* Visually hidden text for screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* Navigation links (mobile: hidden by default, slide down when open) */
.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  background: #06384d;
  display: flex;
  flex-direction: column;
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 180ms ease, opacity 180ms ease;
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(2,6,23,0.4);
}

/* When open on mobile */
.nav-links.is-open {
  transform: scaleY(1);
  opacity: 1;
  pointer-events: auto;
}

/* Link styles */
.nav-links li a {
  display: block;
  padding: 14px 18px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s ease;
  font-size: 1rem;
}
.nav-links li a:active,
.nav-links li a:focus,
.nav-links li a:hover {
  background: rgba(255,255,255,0.04);
  color: #e6f7ff;
}

/* Hover underline animation */
.nav-links li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 6px;
  width: 0%;
  height: 2px;
  background: #38bdf8;
  transition: width 0.3s ease;
}
.nav-links li a:hover::after {
  width: 100%;
}

/* Active link */
.router-link-active {
  color: #38bdf8;
}

/* Backdrop behind mobile menu */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 900;
}

/* Desktop styles (>= breakpoint) */
@media (min-width: 768px) {
  .navbar {
    padding: 12px 24px;
  }
  .navbar__toggle {
    display: none;
  }
  .nav-links {
    position: static;
    transform: none !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    flex-direction: row;
    gap: 28px;
    background: transparent;
    box-shadow: none;
    align-items: center;
  }
  .nav-links li a {
    padding: 8px 0;
    position: relative;
  }
  .backdrop { display: none; }
}
</style>