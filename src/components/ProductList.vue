<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'
import { productStore } from '../stores/productStore.js'

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

// API'den ürünleri getir
const fetchProducts = async (skip = 0, isInitialLoad = false) => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    
    if (!response.ok) {
      throw new Error('Ürünler yüklenemedi')
    }
    
    const data = await response.json()
    
    console.log('API Response:', data.products.length, 'ürün alındı')
    console.log('Store öncesi:', productStore.products.length)
    
    // Store'a ekle
    if (isInitialLoad) {
      productStore.clearCache()
      productStore.addProducts(data.products, data.total)
    } else {
      productStore.addProducts(data.products, data.total)
    }
    
    console.log('Store sonrası:', productStore.products.length)
    
    // Local products'ı güncelle
    updateProducts()
    
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
  
  // Current scroll position'ı güncelle
  updateScrollPosition()
  
  // Sayfanın %80'ine geldiğinde yeni ürünleri yükle
  if (scrollTop + windowHeight >= documentHeight * 0.8 && hasMore() && !loading.value) {
    fetchProducts(currentSkip())
  }
}

// Yeniden yükle fonksiyonu
const retry = () => {
  error.value = null
  fetchProducts(currentSkip())
}

// Manual refresh (cache'i temizle)
const refreshProducts = () => {
  productStore.clearCache()
  updateProducts()
  fetchProducts(0, true)
}

// Component mount olduğunda
onMounted(async () => {
  // Initial scroll position'ı al
  updateScrollPosition()
  
  // Eğer cache'de veri varsa, API'ye istek atmadan direkt kullan
  if (productStore.hasCache()) {
    console.log('Cache\'den ürünler yüklendi:', productStore.products.length)
    updateProducts()
    
    // Scroll behavior'ı geçici olarak kapat
    document.documentElement.classList.add('no-scroll-behavior')
    
    // Hemen scroll pozisyonunu restore et (animasyon yok)
    console.log('Scroll restore ediliyor:', productStore.scrollPosition)
    
    // Birden fazla yöntemle scroll restore
    window.scrollTo(0, productStore.scrollPosition)
    document.documentElement.scrollTop = productStore.scrollPosition
    document.body.scrollTop = productStore.scrollPosition
    
    // DOM render edildikten sonra tekrar dene
    await nextTick()
    productStore.restoreScrollPosition()
    
    // Son olarak bir daha dene (çok uzun listeler için)
    setTimeout(() => {
      productStore.restoreScrollPosition()
      updateScrollPosition()
      
      // Scroll behavior'ı geri aç
      document.documentElement.classList.remove('no-scroll-behavior')
    }, 200)
    
  } else {
    // Cache yoksa API'den yükle
    console.log('API\'den ilk yükleme yapılıyor')
    await fetchProducts(0, true)
  }
  
  // Scroll listener'ı ekle
  window.addEventListener('scroll', handleScroll)
})

// Component unmount olduğunda scroll pozisyonunu kaydet
onBeforeUnmount(() => {
  productStore.saveScrollPosition()
  console.log('Scroll pozisyonu kaydedildi:', productStore.scrollPosition)
})

// Component unmount olduğunda
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="product-list">
    <!-- Debug info (development için) -->
    <div v-if="true" class="debug-info">
      <div>
        <p>Store: {{ store.products.length }} ürün | Local: {{ products.length }} ürün</p>
        <p>
          Kaydedilen: {{ Math.round(store.scrollPosition) }}px | Mevcut: {{ Math.round(currentScrollPos) }}px
          <span :class="{ 'success': scrollRestoreSuccess, 'error': !scrollRestoreSuccess }" class="restore-status">
            {{ scrollRestoreSuccess ? '✅' : '❌' }}
          </span>
        </p>
      </div>
      <button @click="refreshProducts" class="refresh-btn">🔄 Yenile</button>
    </div>
    
    <!-- Hata durumu -->
    <div v-if="error && store.products.length === 0" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Bir hata oluştu</h3>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">Tekrar Dene</button>
    </div>
    
    <!-- Ürün listesi -->
    <div v-else>
      <div class="products-grid">
        <ProductCard 
          v-for="product in store.products" 
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
      <div v-if="error && store.products.length > 0" class="load-more-error">
        <p>{{ error }}</p>
        <button @click="retry" class="retry-btn">Tekrar Dene</button>
      </div>
      
      <!-- Tüm ürünler yüklendi -->
      <div v-if="!hasMore() && store.products.length > 0" class="end-message">
        <p>Tüm ürünler yüklendi 🎉</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  padding: 1rem 0;
}

.debug-info {
  background: #f8f9fa;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-info div p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.debug-info div p:first-child {
  font-weight: 600;
}

.restore-status {
  margin-left: 0.5rem;
  font-weight: bold;
}

.restore-status.success {
  color: #27ae60;
}

.restore-status.error {
  color: #e74c3c;
}

.refresh-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #5a6268;
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
