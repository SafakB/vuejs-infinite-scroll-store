# Vue.js Infinite Scroll Product Store

Bu proje, Vue.js 3 ve Vite kullanılarak geliştirilmiş modern bir ürün mağazası uygulamasıdır. DummyJSON API'sinden ürün verilerini çekerek sonsuz kaydırma (infinite scroll) özelliği ile ürün listesi sunar.

## 🚀 Özellikler

- **Sonsuz Kaydırma**: Sayfa aşağı kaydırıldıkça otomatik olarak yeni ürünler yüklenir
- **Modern UI/UX**: Responsive tasarım ve modern görsel tasarım
- **Ürün Kartları**: Her ürün için detaylı bilgi kartları
- **Yükleme Durumları**: Veri yüklenirken kullanıcı dostu loading göstergeleri
- **Hata Yönetimi**: API hatalarında kullanıcı dostu hata mesajları
- **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm

## 🛠 Teknolojiler

- **Vue.js 3** - Modern JavaScript framework'ü
- **Vite** - Hızlı build aracı ve development server
- **Composition API** - Vue 3'ün modern yaklaşımı
- **DummyJSON API** - Test ürün verileri için REST API
- **Modern CSS** - Flexbox, Grid ve CSS3 animasyonları

## 📦 Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone [repository-url]
   cd scrolller
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Development server'ı başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcınızda açın:**
   ```
   http://localhost:5173
   ```

## 🏗 Build

Production için build almak için:

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulacaktır.

## 📱 Özellik Detayları

### Infinite Scroll
- Sayfa %80'ine geldiğinde otomatik yeni ürünler yüklenir
- Her seferinde 10 ürün yüklenir
- Smooth scroll deneyimi

### Ürün Kartları
- Ürün görseli, başlık, açıklama
- Fiyat bilgisi (indirimli fiyat dahil)
- Yıldız derecelendirmesi
- Stok durumu
- Marka bilgisi
- Sepete ekle butonu

### Responsive Tasarım
- Desktop: 3-4 sütunlu grid
- Tablet: 2 sütunlu grid
- Mobile: 1 sütunlu grid

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── components/
│   ├── ProductList.vue    # Ana ürün listesi komponenti
│   └── ProductCard.vue    # Ürün kartı komponenti
├── App.vue               # Ana uygulama komponenti
├── main.js               # Uygulama giriş noktası
└── style.css             # Global stiller
```

### API Entegrasyonu
Uygulama DummyJSON API'sini kullanır:
- Base URL: `https://dummyjson.com/products`
- Parametreler: `limit` (sayfa başına ürün sayısı), `skip` (atlanacak ürün sayısı)

### Performans Optimizasyonları
- Lazy loading görseller
- Debounced scroll events
- Efficient re-rendering
- Modern CSS optimizasyonları

## 🎨 Tasarım Sistemi

### Renkler
- Primary: `#667eea` (Gradient mavi)
- Secondary: `#764ba2` (Gradient mor)
- Success: `#27ae60` (Yeşil)
- Warning: `#f39c12` (Turuncu)
- Danger: `#e74c3c` (Kırmızı)

### Tipografi
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Responsive font sizes
- Optimal line heights

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Herhangi bir sorunuz varsa, lütfen issue açın veya iletişime geçin.
