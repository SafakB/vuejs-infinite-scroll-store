<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'
import { productStore } from '../stores/productStore.js'
import { productApi } from '../services/api.js'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const currentScrollPos = ref(0)
const scrollRestoreSuccess = ref(true)

// Store'dan reactive veriler
const products = ref(productStore.products)
const hasMore = () => productStore.hasMore
const currentSkip = () => productStore.currentSkip
const limit = productStore.limit

// Template'de kullanım için store'u ref olarak tanımla
const store = productStore

// Store değişikliklerini izle ve local products'ı güncelle
const updateProducts = () => {
  products.value = productStore.products
}

// Scroll pozisyonunu takip et
const updateScrollPosition = () => {
  currentScrollPos.value = window.pageYOffset || document.documentElement.scrollTop
  
  // Scroll restore başarısını kontrol et
  if (store.scrollPosition > 0) {
    const diff = Math.abs(currentScrollPos.value - store.scrollPosition)
    scrollRestoreSuccess.value = diff < 50 // 50px tolerans
  }
}

// Get products from API
const fetchProducts = async (skip = 0, isInitialLoad = false) => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const data = await productApi.getProducts(limit, skip)
    
    console.log('API Response:', data.products.length, 'products received')
    console.log('Store before:', productStore.products.length)
    
    // Add to store
    if (isInitialLoad) {
      productStore.clearCache()
      productStore.addProducts(data.products, data.total)
    } else {
      productStore.addProducts(data.products, data.total)
    }
    
    console.log('Store after:', productStore.products.length)
    
    // Update local products
    updateProducts()
    
  } catch (err) {
    error.value = err.message
    console.error('Product loading error:', err)
  } finally {
    loading.value = false
  }
}

// Listen for scroll events
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Update current scroll position
  updateScrollPosition()
  
  // Load new products when reaching 80% of page
  if (scrollTop + windowHeight >= documentHeight * 0.8 && hasMore() && !loading.value) {
    fetchProducts(currentSkip())
  }
}

// Retry function
const retry = () => {
  error.value = null
  fetchProducts(currentSkip())
}

// Manual refresh (clear cache)
const refreshProducts = () => {
  productStore.clearCache()
  updateProducts()
  fetchProducts(0, true)
}

// When component is mounted
onMounted(async () => {
  // Get initial scroll position
  updateScrollPosition()
  
  // If data exists in cache, use it directly without API request
  if (productStore.hasCache()) {
    console.log('Products loaded from cache:', productStore.products.length)
    updateProducts()
    
    // Temporarily disable scroll behavior
    document.documentElement.classList.add('no-scroll-behavior')
    
    // Restore scroll position immediately (no animation)
    console.log('Restoring scroll position:', productStore.scrollPosition)
    
    // Multiple methods for scroll restore
    window.scrollTo(0, productStore.scrollPosition)
    document.documentElement.scrollTop = productStore.scrollPosition
    document.body.scrollTop = productStore.scrollPosition
    
    // Try again after DOM rendering
    await nextTick()
    productStore.restoreScrollPosition()
    
    // Try one more time (for very long lists)
    setTimeout(() => {
      productStore.restoreScrollPosition()
      updateScrollPosition()
      
      // Re-enable scroll behavior
      document.documentElement.classList.remove('no-scroll-behavior')
    }, 200)
    
  } else {
    // Load from API if no cache
    console.log('Initial loading from API')
    await fetchProducts(0, true)
  }
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

// Save scroll position when component unmounts
onBeforeUnmount(() => {
  productStore.saveScrollPosition()
  console.log('Scroll position saved:', productStore.scrollPosition)
})

// When component unmounts
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="product-list">
    <!-- Debug info (for development) -->
    <div v-if="true" class="alert alert-info d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="mb-1"><strong>Store:</strong> {{ store.products.length }} products | <strong>Local:</strong> {{ products.length }} products</p>
        <p class="mb-0">
          <strong>Saved:</strong> {{ Math.round(store.scrollPosition) }}px | <strong>Current:</strong> {{ Math.round(currentScrollPos) }}px
          <span :class="{ 'text-success': scrollRestoreSuccess, 'text-danger': !scrollRestoreSuccess }" class="ms-2">
            {{ scrollRestoreSuccess ? '✅' : '❌' }}
          </span>
        </p>
      </div>
      <button @click="refreshProducts" class="btn btn-outline-primary btn-sm">🔄 Refresh</button>
    </div>
    
    <!-- Error state -->
    <div v-if="error && store.products.length === 0" class="text-center py-5">
      <div class="display-1">⚠️</div>
      <h3 class="mt-3">An error occurred</h3>
      <p class="text-muted">{{ error }}</p>
      <button @click="retry" class="btn btn-primary">Try Again</button>
    </div>
    
    <!-- Product list -->
    <div v-else>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <ProductCard 
          v-for="product in store.products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading products...</p>
      </div>
      
      <!-- Error state (while loading more products) -->
      <div v-if="error && store.products.length > 0" class="alert alert-danger text-center mt-4">
        <p class="mb-3">{{ error }}</p>
        <button @click="retry" class="btn btn-outline-danger">Try Again</button>
      </div>
      
      <!-- All products loaded -->
      <div v-if="!hasMore() && store.products.length > 0" class="text-center py-5">
        <div class="alert alert-success d-inline-block">
          <p class="mb-0">All products loaded 🎉</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  padding: 1rem 0;
}

/* Custom spinner animation for loading */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hover effects for buttons */
.btn:hover {
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* Custom gradient buttons to match original design */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .row-cols-xl-4 {
    --bs-gutter-x: 1rem;
  }
}

@media (max-width: 576px) {
  .alert {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
