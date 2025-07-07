<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '../services/api.js'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedImageIndex = ref(0)

// Similar products state
const similarProducts = ref([])
const similarLoading = ref(false)
const similarError = ref(null)

// Get API product detail
const fetchProductDetail = async (id) => {
  loading.value = true
  error.value = null
  
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  try {
    const data = await productApi.getProductById(id)
    product.value = data
    
    // Load similar products after product is loaded
    if (data.title) {
      const firstWord = data.title.split(' ')[0]
      await fetchSimilarProducts(firstWord, data.id)
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
    const products = await productApi.getSimilarProducts(searchTerm, currentProductId, 8)
    similarProducts.value = products
    
    console.log(`Found ${products.length} similar products for "${searchTerm}"`)
    
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
  <div class="container py-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Loading product information...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-5">
      <div class="display-1">⚠️</div>
      <h3 class="mt-3 text-danger">An error occurred</h3>
      <p class="text-muted">{{ error }}</p>
      <div class="d-flex gap-3 justify-content-center mt-4">
        <button @click="fetchProductDetail(route.params.id)" class="btn btn-primary">Try Again</button>
        <button @click="goBack" class="btn btn-outline-primary">Back to Home</button>
      </div>
    </div>

    <!-- Product detail -->
    <div v-else-if="product">
      <!-- Back button -->
      <div class="mb-4">
        <button @click="goBack" class="btn btn-outline-primary">
          ← Back to Home
        </button>
      </div>

      <div class="row g-5 mb-5">
        <!-- Product images -->
        <div class="col-lg-6">
          <div class="position-relative mb-3">
            <img 
              :src="product.images && product.images.length > 0 ? product.images[selectedImageIndex] : product.thumbnail" 
              :alt="product.title"
              class="img-fluid rounded main-product-image"
            />
            <div v-if="product.discountPercentage > 0" class="position-absolute top-0 start-0 m-3">
              <span class="badge bg-danger fs-5">
                -{{ Math.round(product.discountPercentage) }}%
              </span>
            </div>
          </div>
          
          <!-- Thumbnail images -->
          <div v-if="product.images && product.images.length > 1" class="d-flex gap-2 flex-wrap">
            <img 
              v-for="(image, index) in product.images" 
              :key="index"
              :src="image" 
              :alt="`${product.title} - ${index + 1}`"
              class="thumbnail-image rounded"
              :class="{ 'border-primary': selectedImageIndex === index }"
              @click="selectImage(index)"
            />
          </div>
        </div>

        <!-- Product information -->
        <div class="col-lg-6">
          <span class="badge bg-primary text-uppercase mb-2">{{ product.category }}</span>
          <h1 class="display-5 fw-bold mb-3">{{ product.title }}</h1>
          
          <!-- Rating -->
          <div class="d-flex align-items-center mb-3">
            <span class="text-warning me-2 fs-5">{{ starRating }}</span>
            <span class="text-muted">({{ product.rating?.toFixed(1) }})</span>
          </div>

          <!-- Price -->
          <div class="border-top border-bottom py-3 mb-4">
            <div v-if="discountedPrice">
              <small class="text-decoration-line-through text-muted">${{ product.price }}</small>
              <div class="h2 text-danger mb-1">${{ discountedPrice }}</div>
              <small class="text-danger fw-bold">{{ Math.round(product.discountPercentage) }}% off</small>
            </div>
            <div v-else>
              <div class="h2 text-dark mb-0">${{ product.price }}</div>
            </div>
          </div>

          <!-- Stock status -->
          <div class="d-flex align-items-center gap-3 mb-4">
            <span class="badge" :class="stockStatus.class">
              {{ stockStatus.text }}
            </span>
            <span class="text-muted" v-if="product.stock > 0">
              {{ product.stock }} in stock
            </span>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h4 class="fw-bold mb-3">Product Description</h4>
            <p class="text-muted">{{ product.description }}</p>
          </div>

          <!-- Product details -->
          <div class="mb-4">
            <h4 class="fw-bold mb-3">Product Information</h4>
            <div class="row g-3">
              <div class="col-md-6" v-if="product.brand">
                <strong>Brand:</strong> {{ product.brand }}
              </div>
              <div class="col-md-6" v-if="product.sku">
                <strong>SKU:</strong> {{ product.sku }}
              </div>
              <div class="col-md-6" v-if="product.weight">
                <strong>Weight:</strong> {{ product.weight }}g
              </div>
              <div class="col-md-6" v-if="product.dimensions">
                <strong>Dimensions:</strong> 
                {{ product.dimensions.width }}×{{ product.dimensions.height }}×{{ product.dimensions.depth }} cm
              </div>
              <div class="col-md-6" v-if="product.warrantyInformation">
                <strong>Warranty:</strong> {{ product.warrantyInformation }}
              </div>
              <div class="col-md-6" v-if="product.shippingInformation">
                <strong>Shipping:</strong> {{ product.shippingInformation }}
              </div>
              <div class="col-md-6">
                <strong>Status:</strong> {{ product.availabilityStatus }}
              </div>
              <div class="col-md-6" v-if="product.minimumOrderQuantity">
                <strong>Min. Order:</strong> {{ product.minimumOrderQuantity }} pieces
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags && product.tags.length > 0" class="mb-4">
            <h4 class="fw-bold mb-3">Tags</h4>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag" class="badge bg-light text-dark">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary btn-lg flex-fill" :disabled="product.stock === 0">
              <span v-if="product.stock > 0">Add to Cart</span>
              <span v-else>Out of Stock</span>
            </button>
            <button class="btn btn-outline-danger btn-lg">
              ♥ Add to Favorites
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div v-if="product.reviews && product.reviews.length > 0" class="mt-5">
        <h3 class="fw-bold mb-4">Customer Reviews</h3>
        <div class="row g-4">
          <div v-for="review in product.reviews" :key="review.date" class="col-md-6 col-lg-4">
            <div class="card h-100 border-start border-primary border-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="card-title mb-0">{{ review.reviewerName }}</h6>
                  <span class="text-warning">
                    {{ Array.from({ length: review.rating }, () => '⭐').join('') }}
                  </span>
                </div>
                <p class="card-text fst-italic">{{ review.comment }}</p>
                <small class="text-muted">{{ new Date(review.date).toLocaleDateString('en-US') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Products -->
      <div class="mt-5">
        <h3 class="fw-bold mb-4">Similar Products</h3>
        
        <!-- Loading state -->
        <div v-if="similarLoading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading similar products...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="similarError" class="text-center py-5">
          <div class="alert alert-danger" role="alert">
            {{ similarError }}
          </div>
          <button @click="fetchSimilarProducts(product.category, product.id)" class="btn btn-outline-primary">
            Try Again
          </button>
        </div>
        
        <!-- Product list -->
        <div v-else-if="similarProducts.length > 0" class="row g-3">
          <div 
            v-for="similarProduct in similarProducts" 
            :key="similarProduct.id" 
            class="col-6 col-md-4 col-lg-3"
          >
            <div 
              class="card h-100 border-0 shadow-sm similar-product-card"
              @click="goToProduct(similarProduct.id)"
              style="cursor: pointer; transition: all 0.3s ease;"
            >
              <div class="position-relative">
                <img 
                  :src="similarProduct.thumbnail" 
                  :alt="similarProduct.title"
                  class="card-img-top"
                  style="height: 180px; object-fit: cover;"
                  loading="lazy"
                />
                <div v-if="similarProduct.discountPercentage > 0" class="position-absolute top-0 start-0 m-2">
                  <span class="badge bg-danger">
                    -{{ Math.round(similarProduct.discountPercentage) }}%
                  </span>
                </div>
              </div>
              
              <div class="card-body d-flex flex-column">
                <div class="mb-1">
                  <small class="text-primary text-uppercase fw-bold">{{ similarProduct.category }}</small>
                </div>
                <h6 class="card-title text-truncate mb-2" :title="similarProduct.title">
                  {{ similarProduct.title }}
                </h6>
                
                <div class="d-flex align-items-center mb-2">
                  <span class="text-warning me-1" style="font-size: 0.8rem;">
                    {{ Array.from({ length: Math.round(similarProduct.rating) }, () => '⭐').join('') }}
                  </span>
                  <small class="text-muted">({{ similarProduct.rating?.toFixed(1) }})</small>
                </div>
                
                <div class="mt-auto">
                  <div v-if="similarProduct.discountPercentage > 0">
                    <small class="text-decoration-line-through text-muted">${{ similarProduct.price }}</small>
                    <div class="h6 text-danger mb-0">
                      ${{ (similarProduct.price - (similarProduct.price * similarProduct.discountPercentage / 100)).toFixed(2) }}
                    </div>
                  </div>
                  <div v-else>
                    <div class="h6 text-dark mb-0">${{ similarProduct.price }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No products found -->
        <div v-else class="text-center py-5">
          <div class="text-muted">
            <i class="bi bi-box" style="font-size: 3rem;"></i>
            <p class="mt-3">No other products found in this category.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main product image styling */
.main-product-image {
  height: 500px;
  object-fit: cover;
}

/* Thumbnail images */
.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail-image:hover {
  border-color: var(--bs-primary);
  transform: scale(1.05);
}

/* Stock status badges */
.badge.in-stock {
  background-color: var(--bs-success) !important;
}

.badge.low-stock {
  background-color: var(--bs-warning) !important;
}

.badge.out-of-stock {
  background-color: var(--bs-danger) !important;
}

/* Similar product card hover effect */
.similar-product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-product-image {
    height: 300px;
  }
  
  .thumbnail-image {
    width: 60px;
    height: 60px;
  }
}
</style>
