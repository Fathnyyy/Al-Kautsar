# Al-Kautsar Website

Website resmi Al-Kautsar - Lembaga Pendidikan Islam Terpadu dengan navbar animasi modern.

## 📁 Struktur File

```
├── Index.html          # File HTML utama
├── stylesheet.css      # File CSS untuk semua animasi navbar
├── script.js          # File JavaScript untuk interaksi navbar
├── assets/            # Folder untuk gambar dan assets
│   ├── asrama.png     # Logo Al-Kautsar
│   └── Home.jpeg      # Background hero section
└── README.md          # Dokumentasi proyek
```

## 🎨 Fitur Animasi Navbar

### Desktop Navigation
- **Hover Effects**: Link bergerak ke atas dengan efek glow biru
- **Shimmer Effect**: Efek shimmer yang melintas saat hover
- **Gradient Background**: Background gradient yang muncul saat hover
- **Smooth Transitions**: Semua animasi menggunakan easing yang smooth

### Logo Animasi
- **Bounce Effect**: Logo beranimasi bounce saat hover
- **Scale Effect**: Logo membesar dengan smooth transition
- **Glow Effect**: Drop shadow biru yang muncul saat hover

### Navbar Scroll Effects
- **Glass Effect**: Background blur dengan transparansi
- **Dynamic Background**: Background berubah saat scroll
- **Border Animation**: Border biru yang muncul saat scroll

### Mobile Menu Animasi
- **Slide Animation**: Menu slide dari kanan dengan smooth transition
- **Backdrop Blur**: Overlay dengan blur effect
- **Icon Animations**: Icon hamburger berotasi saat hover
- **Link Animations**: Link mobile menu bergeser ke kanan dengan underline

### Interactive Features
- **Active Section Highlighting**: Link navbar berubah warna sesuai section yang sedang dilihat
- **Smooth Scroll**: Scroll otomatis ke section dengan easing
- **Keyboard Support**: ESC untuk menutup mobile menu
- **Touch/Click Outside**: Klik di luar untuk menutup mobile menu

## 🚀 Cara Menjalankan

1. Buka file `Index.html` di browser
2. Pastikan semua file berada di folder yang sama:
   - `Index.html`
   - `stylesheet.css`
   - `script.js`
   - Folder `assets/` dengan gambar

## 📱 Responsive Design

Website ini fully responsive dan bekerja optimal di:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur website
- **CSS3**: Animasi dan styling
- **JavaScript (ES6+)**: Interaksi dan animasi
- **Tailwind CSS**: Framework CSS utility-first
- **CSS Animations**: Keyframes dan transitions

## 🎯 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 Catatan

- Semua animasi menggunakan CSS transforms untuk performa optimal
- JavaScript menggunakan passive event listeners untuk performa scroll yang lebih baik
- Implementasi fallback untuk browser yang tidak mendukung smooth scroll
- Error handling untuk memastikan kompatibilitas
