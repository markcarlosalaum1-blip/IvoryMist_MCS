import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import ParticleBackground from './ParticleBackground';
import FeatureCards from './FeatureCards';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-container">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Background */}
      <div className="hero-gradient-bg"></div>
      <div className="hero-glow-orbs"></div>

      {/* Main Hero Content */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Left Side - Text Content */}
          <div className="hero-left" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            {/* Decorative Icon and Lines */}
            <div className="hero-icon-divider">
              <div className="glowing-line left"></div>
              <div className="dessert-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="url(#glow-gradient)" strokeWidth="2"/>
                  <path d="M12 20L16 10L20 20Z" stroke="url(#glow-gradient)" strokeWidth="1.5" fill="none"/>
                  <defs>
                    <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e0a8ff"/>
                      <stop offset="100%" stopColor="#9d4edd"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="glowing-line right"></div>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              <span className="headline-white">Indulge in</span>
              <span className="headline-gradient">Pure Elegance</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              From decadent desserts to rich, aromatic coffee, every bite is a celebration of flavor and finesse. Welcome to a world of sweetness and luxury.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-glow"
                onClick={() => navigate('/menu')}
              >
                <span>EXPLORE MENU</span>
                <div className="btn-glow-effect"></div>
              </button>
              <button 
                className="btn btn-secondary btn-glow"
                onClick={() => navigate('/about')}
              >
                <span>LEARN MORE</span>
                <div className="btn-glow-effect"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Image Content */}
          <div className="hero-right" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <div className="hero-image-container">
              {/* Decorative Light Bokeh */}
              <div className="bokeh bokeh-1"></div>
              <div className="bokeh bokeh-2"></div>
              <div className="bokeh bokeh-3"></div>

              {/* Flowers Decoration */}
              <div className="flower-decoration flower-1"></div>
              <div className="flower-decoration flower-2"></div>

              {/* Image Box */}
              <div className="image-box">
                <div className="image-content">
                  <img 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=600&fit=crop" 
                    alt="Luxury Chocolate Cake"
                    className="hero-image"
                  />
                </div>

                {/* Glow Ring Around Image */}
                <div className="image-glow-ring"></div>
                <div className="image-glow-inner"></div>
              </div>

              {/* Floating Elements */}
              <div className="floating-card card-1">
                <span className="card-label">Premium Quality</span>
              </div>
              <div className="floating-card card-2">
                <span className="card-label">Handcrafted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
      </div>
    </div>
  );
};

export default HeroSection;
