# Vue.js Infinite Scroll Product Store

This project is a modern product store application developed using Vue.js 3 and Vite. It provides a product list with infinite scroll functionality by fetching product data from the DummyJSON API.

## 🚀 Features

- **Infinite Scroll**: Automatically loads new products as the page is scrolled down
- **Bootstrap UI/UX**: Professional responsive design using Bootstrap 5.3.0 components
- **Product Cards**: Detailed information cards with Bootstrap card components
- **Loading States**: Bootstrap spinners and alert components for user feedback
- **Error Handling**: Bootstrap alert components for user-friendly error messages
- **Mobile Responsive**: Bootstrap's responsive grid system for perfect appearance on all devices
- **Product Details**: Detailed product pages with full information
- **Similar Products**: Related product recommendations based on product name
- **Customer Reviews**: Display customer reviews and ratings
- **Scroll Position Cache**: Maintains scroll position when returning from product details

## 🛠 Technologies

- **Vue.js 3** - Modern JavaScript framework
- **Vue Router 4** - Client-side routing
- **Vite** - Fast build tool and development server
- **Bootstrap 5.3.0** - Modern CSS framework and component library
- **Composition API** - Vue 3's modern approach
- **DummyJSON API** - REST API for test product data
- **Responsive Grid System** - Bootstrap's flexbox-based grid layout

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
- Bootstrap responsive grid system
- Desktop: 4 column grid (col-xl-3)
- Tablet: 3 column grid (col-lg-4)
- Small tablets: 2 column grid (col-md-6)
- Mobile: 1 column grid (col-12)
- Bootstrap utility classes for spacing and alignment

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
- Lazy loading images with Bootstrap responsive image classes
- Debounced scroll events
- Efficient re-rendering with Vue 3 reactivity
- Bootstrap CSS optimizations and minimal custom styles
- Global state management for caching
- Scroll position restoration
- Equal height product cards using Bootstrap flexbox utilities

## 🎨 Design System

### Bootstrap 5.3.0 Integration
- **Component Library**: Cards, buttons, badges, alerts, spinners
- **Grid System**: Responsive flexbox-based 12-column grid
- **Utility Classes**: Spacing, typography, colors, and positioning
- **Custom Theme**: Maintained original gradient design with Bootstrap variables

### Colors
- Primary: `#667eea` (Gradient blue) - Custom Bootstrap primary color
- Secondary: `#764ba2` (Gradient purple) - Custom gradient endpoint
- Success: Bootstrap success color for stock status
- Warning: Bootstrap warning color for low stock
- Danger: Bootstrap danger color for out of stock and discounts

### Typography
- Bootstrap's default font stack
- Responsive typography classes (.display-*, .lead, .h*)
- Consistent spacing with Bootstrap utilities

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
