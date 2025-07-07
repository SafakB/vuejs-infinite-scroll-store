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

// Stock status
const stockStatus = computed(() => {
  if (props.product.stock > 20) return { text: 'In Stock', class: 'in-stock' }
  if (props.product.stock > 0) return { text: 'Low Stock', class: 'low-stock' }
  return { text: 'Out of Stock', class: 'out-of-stock' }
})
</script>

<template>
  <div class="product-card" @click="goToProductDetail">
    <div class="product-image-container">
      <img 
        :src="product.thumbnail" 
        :alt="product.title"
        class="product-image"
        loading="lazy"
      />
      <div v-if="product.discountPercentage > 0" class="discount-badge">
        -%{{ Math.round(product.discountPercentage) }}
      </div>
      <div class="stock-badge" :class="stockStatus.class">
        {{ stockStatus.text }}
      </div>
    </div>
    
    <div class="product-content">
      <div class="product-category">{{ product.category }}</div>
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <div class="product-rating">
        <span class="stars">{{ starRating }}</span>
        <span class="rating-text">({{ product.rating.toFixed(1) }})</span>
      </div>
      
      <div class="product-details">
        <div class="brand" v-if="product.brand">
          <strong>Brand:</strong> {{ product.brand }}
        </div>
        <div class="availability">
          <strong>Status:</strong> {{ product.availabilityStatus }}
        </div>
      </div>
      
      <div class="product-footer">
        <div class="price-section">
          <div v-if="product.discountPercentage > 0" class="price-container">
            <span class="original-price">${{ product.price }}</span>
            <span class="discounted-price">${{ discountedPrice }}</span>
          </div>
          <div v-else class="price-container">
            <span class="current-price">${{ product.price }}</span>
          </div>
        </div>
        
        <button 
          class="add-to-cart-btn" 
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
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
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

.product-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  font-size: 1rem;
  letter-spacing: 1px;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.product-details {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.product-details > div {
  margin-bottom: 0.25rem;
  color: #555;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.price-section {
  flex: 1;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.discounted-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e74c3c;
}

.current-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-to-cart-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-to-cart-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 768px) {
  .product-content {
    padding: 1.25rem;
  }
  
  .product-title {
    font-size: 1.1rem;
  }
  
  .product-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  .product-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .add-to-cart-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
