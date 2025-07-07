<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Go to product detail
const goToProductDetail = () => {
  router.push(`/product/${props.product.id}`)
}

// Calculate discounted price
const discountedPrice = computed(() => {
  if (props.product.discountPercentage > 0) {
    const discount = props.product.price * (props.product.discountPercentage / 100)
    return (props.product.price - discount).toFixed(2)
  }
  return props.product.price
})

// Star rating
const starRating = computed(() => {
  const rating = Math.round(props.product.rating)
  return Array.from({ length: 5 }, (_, i) => i < rating ? '⭐' : '☆').join('')
})

// Stock status with Bootstrap classes
const stockStatus = computed(() => {
  if (props.product.stock > 20) return { text: 'In Stock', class: 'bg-success' }
  if (props.product.stock > 0) return { text: 'Low Stock', class: 'bg-warning' }
  return { text: 'Out of Stock', class: 'bg-danger' }
})
</script>

<template>
  <div class="card h-100 shadow-sm product-card" @click="goToProductDetail">
    <div class="position-relative">
      <img 
        :src="product.thumbnail" 
        :alt="product.title"
        class="card-img-top product-image"
        loading="lazy"
      />
      <div v-if="product.discountPercentage > 0" class="position-absolute top-0 start-0 m-2">
        <span class="badge bg-danger fs-6">
          -{{ Math.round(product.discountPercentage) }}%
        </span>
      </div>
      <div class="position-absolute top-0 end-0 m-2">
        <span class="badge" :class="stockStatus.class">
          {{ stockStatus.text }}
        </span>
      </div>
    </div>
    
    <div class="card-body d-flex flex-column">
      <small class="text-primary text-uppercase fw-bold mb-1">{{ product.category }}</small>
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-text text-muted small">{{ product.description }}</p>
      
      <div class="mb-2">
        <span class="text-warning me-2">{{ starRating }}</span>
        <small class="text-muted">({{ product.rating.toFixed(1) }})</small>
      </div>
      
      <div class="row g-2 mb-3 small">
        <div class="col-12" v-if="product.brand">
          <strong>Brand:</strong> {{ product.brand }}
        </div>
        <div class="col-12">
          <strong>Status:</strong> {{ product.availabilityStatus }}
        </div>
      </div>
      
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="price-section">
            <div v-if="product.discountPercentage > 0">
              <small class="text-decoration-line-through text-muted">${{ product.price }}</small>
              <div class="h5 text-danger mb-0">${{ discountedPrice }}</div>
            </div>
            <div v-else>
              <div class="h5 text-dark mb-0">${{ product.price }}</div>
            </div>
          </div>
        </div>
        
        <button 
          class="btn btn-primary w-100" 
          :disabled="product.stock === 0"
          @click.stop="$event.preventDefault()"
        >
          <span v-if="product.stock > 0">View Details</span>
          <span v-else>Out of Stock</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: none !important;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.product-image {
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.btn:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

/* Custom button styling to match original design */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .product-image {
    height: 200px;
  }
}
</style>
