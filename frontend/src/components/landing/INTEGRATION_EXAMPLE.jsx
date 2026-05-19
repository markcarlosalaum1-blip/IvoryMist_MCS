/**
 * INTEGRATION EXAMPLE - How to use HeroSection in your App
 * 
 * This file demonstrates the recommended way to integrate
 * the luxury café landing page into your main application.
 */

import React from 'react';
import { HeroSection } from './components/landing';
// or individual imports:
// import HeroSection from './components/landing/HeroSection';
// import './components/landing/index.css';

function App() {
  return (
    <div className="app">
      {/* Luxury Landing Page */}
      <HeroSection />

      {/* Your other pages/components go here */}
      {/* 
        <HomePage />
        <ProductPage />
        <Footer />
      */}
    </div>
  );
}

export default App;

/**
 * USAGE OPTIONS
 * ==============
 * 
 * Option 1: Import entire component (recommended)
 * import { HeroSection } from './components/landing';
 * 
 * Option 2: Individual imports
 * import HeroSection from './components/landing/HeroSection';
 * import './components/landing/index.css';
 * 
 * Option 3: Import and use individual components
 * import { Navbar, FeatureCards, ParticleBackground } from './components/landing';
 * 
 * CUSTOMIZATION
 * ==============
 * 
 * To customize the hero section, edit:
 * - Text: components/landing/HeroSection.jsx
 * - Colors: components/landing/*.css (search for #e0a8ff or #9d4edd)
 * - Images: Update img src in HeroSection.jsx
 * - Features: Edit components/landing/FeatureCards.jsx
 * 
 * PERFORMANCE TIPS
 * ================
 * 
 * 1. Use production image instead of Unsplash URL
 * 2. Add image lazy loading: loading="lazy"
 * 3. Consider code splitting if hero is on separate route
 * 4. Test performance with Lighthouse
 * 5. Optimize images for mobile
 * 
 * RESPONSIVE TESTING
 * ===================
 * 
 * Test these breakpoints:
 * - Desktop: 1920px, 1440px, 1200px
 * - Tablet: 768px, 834px, 1024px
 * - Mobile: 480px, 320px (various orientations)
 * 
 * BROWSER TESTING
 * ================
 * 
 * - Chrome/Edge (latest)
 * - Firefox (latest)
 * - Safari 14+
 * - Mobile Safari (iOS 14+)
 * - Chrome Mobile
 */
