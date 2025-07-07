import { reactive } from 'vue'

// Global state management for product list
export const productStore = reactive({
    // Ürün listesi cache
    products: [],

    // Current pagination state
    currentSkip: 0,
    limit: 10,
    hasMore: true,
    total: 0,

    // Scroll pozisyonu
    scrollPosition: 0,

    // Loading states
    isInitialLoad: true,

    // Cache'i temizle
    clearCache() {
        this.products = []
        this.currentSkip = 0
        this.hasMore = true
        this.total = 0
        this.scrollPosition = 0
        this.isInitialLoad = true
    },

    // Ürünleri cache'e ekle
    addProducts(newProducts, total) {
        if (this.isInitialLoad) {
            this.products = newProducts
            this.isInitialLoad = false
        } else {
            this.products.push(...newProducts)
        }
        this.total = total
        this.currentSkip = this.products.length
        this.hasMore = this.products.length < total
    },

    // Cache'de veri var mı kontrol et
    hasCache() {
        return this.products.length > 0
    },

    // Scroll pozisyonunu sakla
    saveScrollPosition() {
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop
    },

    // Scroll pozisyonunu restore et
    restoreScrollPosition() {
        if (this.scrollPosition > 0) {
            // CSS smooth scroll'u devre dışı bırak
            const originalBehavior = document.documentElement.style.scrollBehavior
            document.documentElement.style.scrollBehavior = 'auto'

            // Hemen scroll et
            window.scrollTo(0, this.scrollPosition)
            document.documentElement.scrollTop = this.scrollPosition
            document.body.scrollTop = this.scrollPosition

            // requestAnimationFrame ile tekrar dene
            requestAnimationFrame(() => {
                window.scrollTo(0, this.scrollPosition)
                document.documentElement.scrollTop = this.scrollPosition
                document.body.scrollTop = this.scrollPosition

                // Birkaç frame sonra tekrar kontrol et
                requestAnimationFrame(() => {
                    window.scrollTo(0, this.scrollPosition)
                    document.documentElement.scrollTop = this.scrollPosition
                    document.body.scrollTop = this.scrollPosition

                    // Original behavior'ı geri yükle
                    setTimeout(() => {
                        document.documentElement.style.scrollBehavior = originalBehavior
                    }, 50)
                })
            })
        }
    }
})
