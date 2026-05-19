import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { ShoppingCart, Menu, X } from 'react-feather';

const Navbar = () => {
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
      {/* Glassmorphism Background Glow */}
      <div className="navbar-glow"></div>

      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-ivory">Ivory</span>
          <span className="logo-mist">Mist</span>
        </div>

        {/* Desktop Navigation */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
                {location.pathname === link.path && <span className="link-glow"></span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Shopping Cart */}
          <button className="icon-button cart-button">
            <ShoppingCart size={20} />
            <span className="cart-badge">3</span>
            <div className="button-glow"></div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
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

export default Navbar;
