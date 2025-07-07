<script setup>
// Router components will be loaded here
</script>

<template>
  <div id="app">
    <header class="bg-primary text-white py-4 mb-4">
      <div class="container">
        <router-link to="/" class="text-decoration-none text-white">
          <h1 class="display-4 fw-bold mb-1">Product Store</h1>
          <p class="lead mb-0">Discover the highest quality products</p>
        </router-link>
      </div>
    </header>
    
    <main class="main">
      <div class="container">
        <router-view />
      </div>
    </main>
    
    <footer class="bg-dark text-white text-center py-4 mt-5">
      <div class="container">
        <p class="mb-0">&copy; 2025 Product Store. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global overrides to maintain scroll behavior for the app */
html {
  scroll-behavior: auto !important;
}

.no-scroll-behavior {
  scroll-behavior: auto !important;
}

.no-scroll-behavior * {
  scroll-behavior: auto !important;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Custom Bootstrap theme colors - maintaining original gradient */
:root {
  --bs-primary-rgb: 102, 126, 234;
  --bs-primary: #667eea;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* Hover effects */
header a:hover {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}
</style>
