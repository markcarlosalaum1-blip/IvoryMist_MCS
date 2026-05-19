# IvoryMist Luxury Café Landing Page - Hero Section

A premium, cinematic landing page hero section for the IvoryMist luxury café platform with glassmorphism design, neon purple glow effects, animated particles, and responsive layout.

## 📦 Components Included

### 1. **HeroSection** (`HeroSection.jsx`)

Main hero component featuring:

- Split layout (left text, right image)
- Gradient backgrounds with glow orbs
- Animated particles and decorative elements
- Premium typography with luxury serif fonts
- CTA buttons with hover effects
- Floating cards and bokeh effects
- Parallax scroll effects

### 2. **Navbar** (`Navbar.jsx`)

Glassmorphic navigation bar with:

- "IvoryMist" logo with glowing gradient
- Active nav link highlighting
- Shopping cart icon with badge
- Mobile responsive hamburger menu
- Neon purple glow effects
- Smooth transitions and hover animations

### 3. **FeatureCards** (`FeatureCards.jsx`)

Four premium feature cards displaying:

- ✨ Premium Quality
- ☕ Handcrafted Drinks
- 🎂 Exquisite Desserts
- 💜 Made with Love

With glowing circular icons, hover animations, and glassmorphism styling.

### 4. **ParticleBackground** (`ParticleBackground.jsx`)

Canvas-based particle system featuring:

- 50 animated glowing particles
- Dynamic connections between nearby particles
- Smooth pulsing opacity effects
- Gradient colored particles (lavender & purple)
- Responsive to window resizing

## 🎨 Design Features

### Color Palette

- **Primary Gradient**: `#e0a8ff` (Lavender) → `#9d4edd` (Purple)
- **Dark Background**: `#0a0a1a` (Midnight Black)
- **Secondary Dark**: `#1a0033` (Deep Purple)
- **Text**: `#ffffff` (White), `#d0d0d0` (Light Gray)
- **Accent**: `#e0a8ff` (Glowing Lavender)

### Typography

- **Headlines**: Playfair Display (Serif) - elegant and luxurious
- **UI Text**: Poppins - clean and modern
- **Body**: Inter - readable and professional

### Effects

- Glassmorphism (blur + transparency)
- Neon glow borders and shadows
- Smooth parallax scrolling
- Particle animations
- Gradient text and backgrounds
- Bokeh lighting effects
- Floating elements

## 🚀 Installation

### 1. Install Dependencies

The project uses only React core + react-feather for icons:

```bash
npm install react-feather
```

### 2. Add Google Fonts (Optional)

Add to your HTML `<head>`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Or import in your main CSS file:

```css
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap");
```

## 📂 File Structure

```
src/components/landing/
├── HeroSection.jsx          # Main hero component
├── HeroSection.css          # Hero styling & animations
├── Navbar.jsx               # Navigation component
├── Navbar.css               # Navbar styling
├── FeatureCards.jsx         # Feature cards component
├── FeatureCards.css         # Feature cards styling
├── ParticleBackground.jsx   # Particle canvas component
├── ParticleBackground.css   # Particle styling
├── index.css                # Global styles & utilities
└── README.md                # This file
```

## 💻 Usage

### Basic Implementation

```jsx
import HeroSection from "./components/landing/HeroSection";
import "./components/landing/index.css";

function App() {
  return (
    <div className="app">
      <HeroSection />
      {/* Rest of your app */}
    </div>
  );
}

export default App;
```

### Individual Components

```jsx
import Navbar from "./components/landing/Navbar";
import FeatureCards from "./components/landing/FeatureCards";
import ParticleBackground from "./components/landing/ParticleBackground";

// Use individually as needed
```

## 🎯 Customization

### Change Brand Colors

Edit the color values in `HeroSection.css` and `Navbar.css`:

```css
/* Primary Gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
box-shadow: 0 0 20px rgba(YOUR_R, YOUR_G, YOUR_B, 0.4);
```

### Modify Text Content

Edit the text in each component:

```jsx
// HeroSection.jsx
<h1 className="hero-headline">
  <span className="headline-white">Your Heading Here</span>
  <span className="headline-gradient">Your Subheading</span>
</h1>
```

### Adjust Animation Speed

Modify animation values in CSS:

```css
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -50px);
  } /* Adjust values */
}

animation: float 8s ease-in-out infinite; /* Change duration */
```

### Particle Count

Modify in `ParticleBackground.jsx`:

```jsx
const particleCount = 50; // Increase for more particles
```

## 📱 Responsive Behavior

The design is fully responsive across all devices:

- **Desktop (1200px+)**: Full split layout, all features visible
- **Tablet (768px - 1199px)**: Adjusted spacing, 2-column features
- **Mobile (< 768px)**: Single column layout, optimized touch targets
- **Small Mobile (< 480px)**: Minimal padding, stacked elements

## 🔧 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+)
- IE 11: ❌ Not supported

## ⚡ Performance Optimization

### CSS Variables (Optional)

Replace hardcoded colors with CSS variables:

```css
:root {
  --primary-color: #e0a8ff;
  --secondary-color: #9d4edd;
  --bg-dark: #0a0a1a;
}
```

### Lazy Loading Images

The hero image uses a Unsplash URL. For production, use lazy loading:

```jsx
<img
  src="your-image.jpg"
  alt="Luxury Cake"
  loading="lazy"
  className="hero-image"
/>
```

## 🎬 Animation Performance Tips

1. **GPU Acceleration**: Animations use `transform` and `opacity` for smooth 60fps
2. **Will-change**: Used sparingly for expensive animations
3. **RequestAnimationFrame**: Particle canvas uses optimized animation loop
4. **Reduced Motion**: Consider adding prefers-reduced-motion media query

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## 🐛 Troubleshooting

### Particles not showing

- Check if canvas is properly sized
- Verify z-index hierarchy (canvas should be below content)
- Ensure browser supports canvas 2D context

### Glow effects not visible

- Check if backdrop-filter is supported (add fallback)
- Verify glassmorphism CSS is applied
- Check browser DevTools for CSS errors

### Text not aligning properly

- Verify font imports are loaded
- Check max-width constraints on containers
- Ensure proper line-height values

### Mobile layout breaking

- Test in actual mobile devices (not just browser resize)
- Check touch target sizes (min 44px recommended)
- Verify overflow is handled correctly

## 📊 Component Props

Currently, components don't accept props. To make them dynamic, extend them:

```jsx
function HeroSection({ title, subtitle, imageUrl, features }) {
  return (
    // Use props in JSX
  );
}
```

## 🔐 Accessibility

The design includes:

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels on buttons
- Color contrast compliance
- Keyboard navigation support
- Focus indicators

## 📝 License

This component design is part of the IvoryMist platform.

## 🎉 Next Steps

1. **Integrate**: Add `<HeroSection />` to your main App
2. **Customize**: Update colors, text, and images for your brand
3. **Test**: Verify on multiple devices and browsers
4. **Optimize**: Add images, lazy loading, and performance tweaks
5. **Deploy**: Push to production with optimized assets

---

**Created for IvoryMist Luxury Café Platform**  
Premium, modern landing page design with cinematic aesthetics.
