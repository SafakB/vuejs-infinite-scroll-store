<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedImageIndex = ref(0)

// Benzer ürünler için state
const similarProducts = ref([])
const similarLoading = ref(false)
const similarError = ref(null)

// API'den ürün detayını getir
const fetchProductDetail = async (id) => {
  loading.value = true
  error.value = null
  
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`)
    
    if (!response.ok) {
      throw new Error('Product not found')
    }
    
    const data = await response.json()
    product.value = data
    
    // Load similar products after product is loaded
    if (data.title) {
      const firstWord = data.title.split(' ')[0]
      fetchSimilarProducts(firstWord, data.id)
    }
    
  } catch (err) {
    error.value = err.message
    console.error('Product detail loading error:', err)
  } finally {
    loading.value = false
  }
}

// Get similar products
const fetchSimilarProducts = async (searchTerm, currentProductId) => {
  similarLoading.value = true
  similarError.value = null
  
  try {
    // Search by first word of product name
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=12`)
    
    if (!response.ok) {
      throw new Error('Similar products could not be loaded')
    }
    
    const data = await response.json()
    
    // Remove current product and show maximum 8 products
    similarProducts.value = data.products
      .filter(p => p.id !== parseInt(currentProductId))
      .slice(0, 8)
    
    console.log(`Found ${similarProducts.value.length} similar products for "${searchTerm}"`)
    
  } catch (err) {
    similarError.value = err.message
    console.error('Similar products loading error:', err)
  } finally {
    similarLoading.value = false
  }
}

// Calculate discounted price
const discountedPrice = computed(() => {
  if (!product.value || product.value.discountPercentage <= 0) return null
  const discount = product.value.price * (product.value.discountPercentage / 100)
  return (product.value.price - discount).toFixed(2)
})

// Star rating
const starRating = computed(() => {
  if (!product.value) return ''
  const rating = Math.round(product.value.rating)
  return Array.from({ length: 5 }, (_, i) => i < rating ? '⭐' : '☆').join('')
})

// Stock status
const stockStatus = computed(() => {
  if (!product.value) return { text: '', class: '' }
  if (product.value.stock > 20) return { text: 'In Stock', class: 'in-stock' }
  if (product.value.stock > 0) return { text: 'Low Stock', class: 'low-stock' }
  return { text: 'Out of Stock', class: 'out-of-stock' }
})

// Go back to home page
const goBack = () => {
  router.push('/')
}

// Image selection
const selectImage = (index) => {
  selectedImageIndex.value = index
}

// Go to similar product
const goToProduct = (productId) => {
  // Clear current product state
  product.value = null
  similarProducts.value = []
  selectedImageIndex.value = 0
  
  // Navigate to new product
  router.push(`/product/${productId}`)
}

// When component is mounted
onMounted(() => {
  const productId = route.params.id
  if (productId) {
    fetchProductDetail(productId)
    // Scroll to top of page
    window.scrollTo(0, 0)
  }
})

// Load new product when route parameter changes
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchProductDetail(newId)
    // Scroll to top of page
    window.scrollTo(0, 0)
  }
})
</script>

<template>
  <div class="product-detail">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading product information...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>An error occurred</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="fetchProductDetail(route.params.id)" class="retry-btn">Try Again</button>
        <button @click="goBack" class="back-btn">Back to Home</button>
      </div>
    </div>

    <!-- Product detail -->
    <div v-else-if="product" class="product-content">
      <!-- Back button -->
      <div class="header-actions">
        <button @click="goBack" class="back-button">
          ← Back to Home
        </button>
      </div>

      <div class="product-layout">
        <!-- Ürün görselleri -->
        <div class="product-images">
          <div class="main-image">
            <img 
              :src="product.images && product.images.length > 0 ? product.images[selectedImageIndex] : product.thumbnail" 
              :alt="product.title"
              class="main-product-image"
            />
            <div v-if="product.discountPercentage > 0" class="discount-badge">
              -%{{ Math.round(product.discountPercentage) }}
            </div>
          </div>
          
          <!-- Thumbnail images -->
          <div v-if="product.images && product.images.length > 1" class="thumbnail-images">
            <img 
              v-for="(image, index) in product.images" 
              :key="index"
              :src="image" 
              :alt="`${product.title} - ${index + 1}`"
              class="thumbnail-image"
              :class="{ active: selectedImageIndex === index }"
              @click="selectImage(index)"
            />
          </div>
        </div>

        <!-- Product information -->
        <div class="product-info">
          <div class="product-category">{{ product.category }}</div>
          <h1 class="product-title">{{ product.title }}</h1>
          
          <!-- Rating -->
          <div class="product-rating">
            <span class="stars">{{ starRating }}</span>
            <span class="rating-text">({{ product.rating?.toFixed(1) }})</span>
          </div>

          <!-- Price -->
          <div class="price-section">
            <div v-if="discountedPrice" class="price-container">
              <span class="original-price">${{ product.price }}</span>
              <span class="discounted-price">${{ discountedPrice }}</span>
              <span class="discount-text">{{ Math.round(product.discountPercentage) }}% off</span>
            </div>
            <div v-else class="price-container">
              <span class="current-price">${{ product.price }}</span>
            </div>
          </div>

          <!-- Stock status -->
          <div class="stock-info">
            <span class="stock-badge" :class="stockStatus.class">
              {{ stockStatus.text }}
            </span>
            <span class="stock-count" v-if="product.stock > 0">
              {{ product.stock }} in stock
            </span>
          </div>

          <!-- Description -->
          <div class="description">
            <h3>Product Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <!-- Product details -->
          <div class="product-details">
            <h3>Product Information</h3>
            <div class="details-grid">
              <div class="detail-item" v-if="product.brand">
                <strong>Brand:</strong> {{ product.brand }}
              </div>
              <div class="detail-item" v-if="product.sku">
                <strong>SKU:</strong> {{ product.sku }}
              </div>
              <div class="detail-item" v-if="product.weight">
                <strong>Weight:</strong> {{ product.weight }}g
              </div>
              <div class="detail-item" v-if="product.dimensions">
                <strong>Dimensions:</strong> 
                {{ product.dimensions.width }}×{{ product.dimensions.height }}×{{ product.dimensions.depth }} cm
              </div>
              <div class="detail-item" v-if="product.warrantyInformation">
                <strong>Warranty:</strong> {{ product.warrantyInformation }}
              </div>
              <div class="detail-item" v-if="product.shippingInformation">
                <strong>Shipping:</strong> {{ product.shippingInformation }}
              </div>
              <div class="detail-item">
                <strong>Status:</strong> {{ product.availabilityStatus }}
              </div>
              <div class="detail-item" v-if="product.minimumOrderQuantity">
                <strong>Min. Order:</strong> {{ product.minimumOrderQuantity }} pieces
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags && product.tags.length > 0" class="product-tags">
            <h3>Tags</h3>
            <div class="tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons">
            <button class="add-to-cart-btn" :disabled="product.stock === 0">
              <span v-if="product.stock > 0">Add to Cart</span>
              <span v-else>Out of Stock</span>
            </button>
            <button class="wishlist-btn">
              ♥ Add to Favorites
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div v-if="product.reviews && product.reviews.length > 0" class="reviews-section">
        <h3>Customer Reviews</h3>
        <div class="reviews-grid">
          <div v-for="review in product.reviews" :key="review.date" class="review-card">
            <div class="review-header">
              <span class="reviewer-name">{{ review.reviewerName }}</span>
              <span class="review-rating">
                {{ Array.from({ length: review.rating }, () => '⭐').join('') }}
              </span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <span class="review-date">{{ new Date(review.date).toLocaleDateString('en-US') }}</span>
          </div>
        </div>
      </div>

      <!-- Similar Products -->
      <div class="similar-products-section">
        <h3>Similar Products</h3>
        
        <!-- Loading state -->
        <div v-if="similarLoading" class="similar-loading">
          <div class="loading-spinner"></div>
          <p>Loading similar products...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="similarError" class="similar-error">
          <p>{{ similarError }}</p>
          <button @click="fetchSimilarProducts(product.category, product.id)" class="retry-similar-btn">
            Try Again
          </button>
        </div>
        
        <!-- Product list -->
        <div v-else-if="similarProducts.length > 0" class="similar-products-grid">
          <div 
            v-for="similarProduct in similarProducts" 
            :key="similarProduct.id" 
            class="similar-product-card"
            @click="goToProduct(similarProduct.id)"
          >
            <div class="similar-product-image">
              <img 
                :src="similarProduct.thumbnail" 
                :alt="similarProduct.title"
                loading="lazy"
              />
              <div v-if="similarProduct.discountPercentage > 0" class="similar-discount-badge">
                -%{{ Math.round(similarProduct.discountPercentage) }}
              </div>
            </div>
            
            <div class="similar-product-info">
              <div class="similar-product-category">{{ similarProduct.category }}</div>
              <h4 class="similar-product-title">{{ similarProduct.title }}</h4>
              
              <div class="similar-product-rating">
                <span class="similar-stars">
                  {{ Array.from({ length: Math.round(similarProduct.rating) }, () => '⭐').join('') }}
                </span>
                <span class="similar-rating-text">({{ similarProduct.rating?.toFixed(1) }})</span>
              </div>
              
              <div class="similar-product-price">
                <div v-if="similarProduct.discountPercentage > 0" class="similar-price-container">
                  <span class="similar-original-price">${{ similarProduct.price }}</span>
                  <span class="similar-discounted-price">
                    ${{ (similarProduct.price - (similarProduct.price * similarProduct.discountPercentage / 100)).toFixed(2) }}
                  </span>
                </div>
                <div v-else class="similar-price-container">
                  <span class="similar-current-price">${{ similarProduct.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No products found -->
        <div v-else class="no-similar-products">
          <p>No other products found in this category.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
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

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.header-actions {
  margin-bottom: 2rem;
}

.back-button {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #667eea;
  color: white;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.thumbnail-images {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #667eea;
  transform: scale(1.05);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-category {
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars {
  font-size: 1.25rem;
  letter-spacing: 2px;
}

.rating-text {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

.price-section {
  padding: 1.5rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original-price {
  font-size: 1.1rem;
  color: #999;
  text-decoration: line-through;
}

.discounted-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e74c3c;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.discount-text {
  color: #e74c3c;
  font-size: 1rem;
  font-weight: 600;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stock-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.stock-badge.in-stock {
  background-color: #27ae60;
  color: white;
}

.stock-badge.low-stock {
  background-color: #f39c12;
  color: white;
}

.stock-badge.out-of-stock {
  background-color: #e74c3c;
  color: white;
}

.stock-count {
  color: #666;
  font-size: 0.95rem;
}

.description h3,
.product-details h3,
.product-tags h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.description p {
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.detail-item {
  color: #555;
  font-size: 0.95rem;
}

.detail-item strong {
  color: #2c3e50;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f8f9fa;
  color: #667eea;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #e9ecef;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.add-to-cart-btn,
.wishlist-btn {
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-to-cart-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  box-shadow: none;
}

.wishlist-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.wishlist-btn:hover {
  background: #667eea;
  color: white;
}

.retry-btn,
.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.back-btn:hover {
  background: #667eea;
  color: white;
}

.reviews-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid #eee;
}

.reviews-section h3 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.review-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.reviewer-name {
  font-weight: 600;
  color: #2c3e50;
}

.review-rating {
  font-size: 0.9rem;
}

.review-comment {
  color: #555;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-style: italic;
}

.review-date {
  color: #999;
  font-size: 0.85rem;
}

/* Benzer Ürünler Bölümü */
.similar-products-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid #eee;
}

.similar-products-section h3 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.similar-loading,
.similar-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  text-align: center;
}

.similar-loading .loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.similar-error p {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.retry-similar-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-similar-btn:hover {
  background: #5a6fd8;
}

.similar-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.similar-product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.similar-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.similar-product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.similar-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.similar-product-card:hover .similar-product-image img {
  transform: scale(1.05);
}

.similar-discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 2px 6px rgba(231, 76, 60, 0.3);
}

.similar-product-info {
  padding: 1rem;
}

.similar-product-category {
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.similar-product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.similar-product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.similar-stars {
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.similar-rating-text {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.similar-product-price {
  margin-top: auto;
}

.similar-price-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.similar-original-price {
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
}

.similar-discounted-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e74c3c;
}

.similar-current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.no-similar-products {
  text-align: center;
  padding: 3rem 0;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .similar-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .similar-product-image {
    height: 150px;
  }
  
  .similar-products-section h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 1rem;
  }

  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-title {
    font-size: 1.8rem;
  }

  .main-image {
    height: 300px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .discounted-price,
  .current-price {
    font-size: 2rem;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
