# Vue.js Infinite Scroll Product Store

This project is a modern product store application developed using Vue.js 3 and Vite. It provides a product list with infinite scroll functionality by fetching product data from the DummyJSON API.

## 🚀 Features

- **Infinite Scroll**: Automatically loads new products as the page is scrolled down
- **Modern UI/UX**: Responsive design and modern visual interface
- **Product Cards**: Detailed information cards for each product
- **Loading States**: User-friendly loading indicators while data is being loaded
- **Error Handling**: User-friendly error messages for API failures
- **Mobile Responsive**: Perfect appearance on all devices
- **Product Details**: Detailed product pages with full information
- **Similar Products**: Related product recommendations based on product name
- **Customer Reviews**: Display customer reviews and ratings
- **Scroll Position Cache**: Maintains scroll position when returning from product details

## 🛠 Technologies

- **Vue.js 3** - Modern JavaScript framework
- **Vue Router 4** - Client-side routing
- **Vite** - Fast build tool and development server
- **Composition API** - Vue 3's modern approach
- **DummyJSON API** - REST API for test product data
- **Modern CSS** - Flexbox, Grid and CSS3 animations

## 📦 Installation

1. **Clone the project:**
   ```bash
   git clone [repository-url]
   cd scrolller
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173
   ```

## 🏗 Build

To build for production:

```bash
npm run build
```

Build files will be created in the `dist/` folder.

## 📱 Feature Details

### Infinite Scroll
- Automatically loads new products when reaching 80% of page
- Loads 10 products at a time
- Smooth scroll experience
- Maintains scroll position when navigating back

### Product Cards
- Product image, title, description
- Price information (including discounted price)
- Star rating
- Stock status
- Brand information
- Add to cart button

### Product Details
- Full product information and specifications
- Image gallery with thumbnail navigation
- Customer reviews and ratings
- Similar product recommendations
- Responsive layout

### Responsive Design
- Desktop: 3-4 column grid
- Tablet: 2 column grid
- Mobile: 1 column grid

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── ProductList.vue    # Main product list component
│   └── ProductCard.vue    # Product card component
├── views/
│   ├── Home.vue          # Home page view
│   └── ProductDetail.vue # Product detail page
├── stores/
│   └── productStore.js   # Global state management
├── router/
│   └── index.js          # Route definitions
├── App.vue               # Main application component
├── main.js               # Application entry point
└── style.css             # Global styles
```

### API Integration
The application uses DummyJSON API:
- Base URL: `https://dummyjson.com/products`
- Parameters: `limit` (products per page), `skip` (products to skip)
- Search endpoint: `https://dummyjson.com/products/search`

### Performance Optimizations
- Lazy loading images
- Debounced scroll events
- Efficient re-rendering
- Modern CSS optimizations
- Global state management for caching
- Scroll position restoration

## 🎨 Design System

### Colors
- Primary: `#667eea` (Gradient blue)
- Secondary: `#764ba2` (Gradient purple)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Responsive font sizes
- Optimal line heights

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions, please open an issue or contact us.
