<script setup>
// Router components will be loaded here
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="header-link">
          <h1 class="title">Product Store</h1>
          <p class="subtitle">Discover the highest quality products</p>
        </router-link>
      </div>
    </header>
    
    <main class="main">
      <div class="container">
        <router-view />
      </div>
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 Product Store. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.3s ease;
}

.header-link:hover {
  transform: translateY(-2px);
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.main {
  min-height: 70vh;
  padding: 2rem 0;
}

.footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 2rem 0;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>
