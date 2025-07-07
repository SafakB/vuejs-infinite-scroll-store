<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from './ProductCard.vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)
const hasMore = ref(true)
const currentSkip = ref(0)
const limit = 10

// API'den ürünleri getir
const fetchProducts = async (skip = 0) => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    
    if (!response.ok) {
      throw new Error('Ürünler yüklenemedi')
    }
    
    const data = await response.json()
    
    if (skip === 0) {
      products.value = data.products
    } else {
      products.value.push(...data.products)
    }
    
    currentSkip.value = skip + limit
    hasMore.value = products.value.length < data.total
    
  } catch (err) {
    error.value = err.message
    console.error('Ürün yükleme hatası:', err)
  } finally {
    loading.value = false
  }
}

// Scroll olayını dinle
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Sayfanın %80'ine geldiğinde yeni ürünleri yükle
  if (scrollTop + windowHeight >= documentHeight * 0.8 && hasMore.value && !loading.value) {
    fetchProducts(currentSkip.value)
  }
}

// Yeniden yükle fonksiyonu
const retry = () => {
  error.value = null
  fetchProducts(currentSkip.value)
}

// Component mount olduğunda
onMounted(() => {
  fetchProducts(0)
  window.addEventListener('scroll', handleScroll)
})

// Component unmount olduğunda
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="product-list">
    <!-- Hata durumu -->
    <div v-if="error && products.length === 0" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Bir hata oluştu</h3>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">Tekrar Dene</button>
    </div>
    
    <!-- Ürün listesi -->
    <div v-else>
      <div class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
      
      <!-- Yükleniyor durumu -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Ürünler yükleniyor...</p>
      </div>
      
      <!-- Hata durumu (daha fazla ürün yüklenirken) -->
      <div v-if="error && products.length > 0" class="load-more-error">
        <p>{{ error }}</p>
        <button @click="retry" class="retry-btn">Tekrar Dene</button>
      </div>
      
      <!-- Tüm ürünler yüklendi -->
      <div v-if="!hasMore && products.length > 0" class="end-message">
        <p>Tüm ürünler yüklendi 🎉</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  padding: 1rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #e74c3c;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.error-state p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.load-more-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: center;
}

.load-more-error p {
  color: #856404;
  margin-bottom: 1rem;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

.end-message {
  text-align: center;
  padding: 3rem 0;
  color: #666;
  font-size: 1.1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .error-state {
    padding: 3rem 1rem;
  }
  
  .error-icon {
    font-size: 2.5rem;
  }
  
  .error-state h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
