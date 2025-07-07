/**
 * API Service for DummyJSON Product API
 * Centralized API calls with error handling and configuration
 */

const API_BASE_URL = 'https://dummyjson.com'

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response data
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        })

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(`API Request failed for ${endpoint}:`, error)
        throw error
    }
}

/**
 * Product API service
 */
export const productApi = {
    /**
     * Get paginated products list
     * @param {number} limit - Number of products to fetch
     * @param {number} skip - Number of products to skip
     * @returns {Promise<object>} Products data with pagination
     */
    async getProducts(limit = 10, skip = 0) {
        const endpoint = `/products?limit=${limit}&skip=${skip}`
        return await apiRequest(endpoint)
    },

    /**
     * Get single product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise<object>} Product data
     */
    async getProductById(id) {
        if (!id) {
            throw new Error('Product ID is required')
        }

        const endpoint = `/products/${id}`
        try {
            return await apiRequest(endpoint)
        } catch (error) {
            if (error.message.includes('404')) {
                throw new Error('Product not found')
            }
            throw new Error('Failed to load product details')
        }
    },

    /**
     * Search products by query
     * @param {string} query - Search query
     * @param {number} limit - Number of products to fetch
     * @returns {Promise<object>} Search results
     */
    async searchProducts(query, limit = 12) {
        if (!query || query.trim() === '') {
            throw new Error('Search query is required')
        }

        const endpoint = `/products/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`
        try {
            return await apiRequest(endpoint)
        } catch (error) {
            throw new Error('Failed to search products')
        }
    },

    /**
     * Get similar products based on search term
     * @param {string} searchTerm - Search term for similar products
     * @param {number|string} excludeId - Product ID to exclude from results
     * @param {number} limit - Maximum number of similar products
     * @returns {Promise<Array>} Array of similar products
     */
    async getSimilarProducts(searchTerm, excludeId, limit = 8) {
        try {
            const data = await this.searchProducts(searchTerm, 12)

            // Filter out current product and limit results
            const similarProducts = data.products
                .filter(product => product.id !== parseInt(excludeId))
                .slice(0, limit)

            return similarProducts
        } catch (error) {
            throw new Error('Failed to load similar products')
        }
    }
}

/**
 * API Response types for better error handling
 */
export const ApiErrors = {
    NETWORK_ERROR: 'Network connection failed',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Server error occurred',
    INVALID_REQUEST: 'Invalid request parameters'
}

/**
 * API configuration
 */
export const apiConfig = {
    baseUrl: API_BASE_URL,
    defaultLimit: 10,
    maxRetries: 3,
    timeout: 10000
}
