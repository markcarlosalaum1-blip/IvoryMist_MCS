import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X } from 'react-feather';
import './landing.css';

/* ParticleBackground - canvas particle system */
export const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#e0a8ff' : '#9d4edd';
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        this.opacity = 0.3 + Math.sin(this.pulse) * 0.2 + 0.2;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(224, 168, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

/* FeatureCards component */
export const FeatureCards = () => {
  const features = [
    { id: 1, icon: '✨', title: 'Premium Quality', description: 'Finest ingredients for an exceptional taste.' },
    { id: 2, icon: '☕', title: 'Handcrafted Drinks', description: 'Perfectly brewed to delight you.' },
    { id: 3, icon: '🎂', title: 'Exquisite Desserts', description: 'Beautifully crafted for every occasion.' },
    { id: 4, icon: '💜', title: 'Made with Love', description: 'Passion and care in every creation.' },
  ];

  return (
    <section className="feature-section">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-glow"></div>
              <div className="feature-content">
                <div className="feature-icon">
                  <div className="icon-glow"></div>
                  <span className="icon-emoji">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="card-border-glow"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="features-divider"></div>
    </section>
  );
};

/* Navbar component */
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'MENU', path: '/menu' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'TRACK ORDER', path: '/track' },
    { label: 'LOGIN', path: '/login' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-glow"></div>
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/" className="nav-brand-link">
            <span className="logo-ivory">Ivory</span>
            <span className="logo-mist">Mist</span>
          </Link>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                {link.label}
                {location.pathname === link.path && <span className="link-glow"></span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="icon-button cart-button">
            <ShoppingCart size={20} />
            <span className="cart-badge">3</span>
            <div className="button-glow"></div>
          </button>

          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

/* HeroSection component */
export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-container">
      <ParticleBackground />
      <div className="hero-gradient-bg"></div>
      <div className="hero-glow-orbs"></div>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
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

            <h1 className="hero-headline">
              <span className="headline-white">Indulge in</span>
              <span className="headline-gradient">Pure Elegance</span>
            </h1>

            <p className="hero-description">From decadent desserts to rich, aromatic coffee, every bite is a celebration of flavor and finesse. Welcome to a world of sweetness and luxury.</p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-glow" onClick={() => navigate('/menu')}>
                <span>EXPLORE MENU</span>
                <div className="btn-glow-effect"></div>
              </button>
              <button className="btn btn-secondary btn-glow" onClick={() => navigate('/about')}>
                <span>LEARN MORE</span>
                <div className="btn-glow-effect"></div>
              </button>
            </div>
          </div>

          <div className="hero-right" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <div className="hero-image-container">
              <div className="bokeh bokeh-1"></div>
              <div className="bokeh bokeh-2"></div>
              <div className="bokeh bokeh-3"></div>

              <div className="flower-decoration flower-1"></div>
              <div className="flower-decoration flower-2"></div>

              <div className="image-box">
                <div className="image-content">
                  <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=600&fit=crop" alt="Luxury Chocolate Cake" className="hero-image" />
                </div>

                <div className="image-glow-ring"></div>
                <div className="image-glow-inner"></div>
              </div>

              <div className="floating-card card-1"><span className="card-label">Premium Quality</span></div>
              <div className="floating-card card-2"><span className="card-label">Handcrafted</span></div>
            </div>
          </div>
        </div>
      </section>

      <FeatureCards />

      <div className="scroll-indicator"><div className="scroll-dot"></div></div>
    </div>
  );
};

export default HeroSection;
