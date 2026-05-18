import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import formatCurrencyPHP from '../../utils/currency';

const Menu = () => {
  const { addToCart } = useContext(CartContext);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await API.get('/products');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show error toast if query fails
  if (error) {
    toast.error('Failed to load menu');
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="menu-container">
        <div className="menu-content">
          <h1>Exquisite Selections</h1>
          <div style={{ textAlign: 'center', padding: '80px 40px', color: 'rgba(255,255,255,0.6)' }}>
            <div style={{fontSize: '18px'}}>Loading menu...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .menu-container {
          font-family: 'DM Sans', sans-serif;
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
          min-height: calc(100vh - 72px);
          padding: 60px 36px;
          color: rgba(255,255,255,0.9);
        }

        .menu-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .menu-header {
          margin-bottom: 48px;
          text-align: center;
          background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #2e1065 100%);
          padding: 48px 40px;
          border-radius: 20px;
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.4),
            0 0 60px rgba(79,70,229,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(79,70,229,0.3);
          position: relative;
          overflow: hidden;
        }

        .menu-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 400px 300px at 20% 30%, rgba(139,92,246,0.15), transparent 60%),
            radial-gradient(ellipse 350px 250px at 80% 70%, rgba(99,102,241,0.12), transparent 55%);
          pointer-events: none;
        }

        .menu-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 44px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.3));
        }

        .menu-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 16px;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 28px;
        }

        .product-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(16,185,129,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 18px;
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: pointer;
        }

        .product-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .product-card:hover {
          transform: translateY(-12px) scale(1.03);
          border-color: rgba(0,212,255,0.5);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(0,212,255,0.2);
          background: linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(16,185,129,0.08) 100%);
        }

        .product-card:hover::before {
          opacity: 1;
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 180px;
          background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
        }

        .product-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .product-card:hover img {
          transform: scale(1.08) rotateZ(1deg);
        }

        .product-info {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-card h3 {
          margin: 0;
          font-size: 18px;
          color: rgba(255,255,255,0.95);
          font-weight: 700;
          font-family: 'Playfair Display', serif;
        }

        .product-card p {
          margin: 0;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          flex-grow: 1;
        }

        .product-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: center;
        }

        .stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(16,185,129,0.1) 100%);
          border: 1px solid rgba(0,212,255,0.4);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #00d4ff;
          box-shadow: 
            0 0 12px rgba(0,212,255,0.3),
            inset 0 1px 2px rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          white-space: nowrap;
          margin-bottom: 8px;
        }

        .stock-badge:hover {
          background: linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(16,185,129,0.15) 100%);
          border-color: rgba(0,212,255,0.6);
          box-shadow: 
            0 0 18px rgba(0,212,255,0.5),
            inset 0 1px 2px rgba(255,255,255,0.15);
          transform: scale(1.02);
        }

        .stock-badge.low-stock {
          color: #ff6b6b;
          border-color: rgba(255,107,107,0.4);
          background: linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(255,107,107,0.08) 100%);
          box-shadow: 
            0 0 12px rgba(255,107,107,0.3),
            inset 0 1px 2px rgba(255,255,255,0.1);
        }

        .stock-badge.low-stock:hover {
          border-color: rgba(255,107,107,0.6);
          box-shadow: 
            0 0 18px rgba(255,107,107,0.5),
            inset 0 1px 2px rgba(255,255,255,0.15);
        }

        .stock-badge.out-of-stock {
          color: rgba(255,255,255,0.5);
          border-color: rgba(255,255,255,0.2);
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          box-shadow: 
            0 0 8px rgba(255,255,255,0.15),
            inset 0 1px 2px rgba(0,0,0,0.2);
        }

        .stock-icon {
          display: inline-flex;
          width: 14px;
          height: 14px;
          align-items: center;
          justify-content: center;
          animation: stock-pulse 2s ease-in-out infinite;
        }

        @keyframes stock-pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .price {
          font-weight: 700;
          color: #00d4ff;
          font-size: 16px;
          font-family: 'Playfair Display', serif;
        }

        .btn-add {
          padding: 10px 14px;
          background: linear-gradient(135deg, #00d4ff, #10b981);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(0,212,255,0.3);
        }

        .btn-add:disabled {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          color: rgba(255,255,255,0.4);
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-add:hover:not(:disabled) {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,212,255,0.45);
        }

        @media (max-width: 1024px) {
          .menu-container {
            padding: 48px 28px;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 24px;
          }

          .menu-content h1 {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .menu-container {
            padding: 36px 20px;
          }

          .menu-content h1 {
            font-size: 32px;
            margin-bottom: 8px;
          }

          .menu-subtitle {
            font-size: 14px;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 18px;
          }

          .product-image-wrapper {
            height: 160px;
          }

          .product-info {
            padding: 16px;
            gap: 10px;
          }

          .product-card h3 {
            font-size: 16px;
          }

          .stock-badge {
            padding: 6px 12px;
            font-size: 11px;
            margin-bottom: 8px;
          }

          .btn-add {
            padding: 9px 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .menu-container {
            padding: 28px 16px;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 14px;
          }

          .menu-content h1 {
            font-size: 28px;
          }

          .stock-badge {
            padding: 5px 10px;
            font-size: 10px;
            margin-bottom: 6px;
          }

          .product-footer {
            grid-template-columns: 1fr;
          }

          .btn-add {
            width: 100%;
          }
        }
      `}</style>

      <div className="menu-container">
        <div className="menu-content">
          <div className="menu-header">
            <h1>Exquisite Selections</h1>
            <p className="menu-subtitle">Elegance in every sip, magic in every bite</p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/260x180'} 
                    alt={product.name} 
                    loading="lazy" 
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  {/* Stock Badge */}
                  <div className={`stock-badge ${product.stock <= 5 && product.stock > 0 ? 'low-stock' : product.stock === 0 ? 'out-of-stock' : ''}`}>
                    <span className="stock-icon">📦</span>
                    <span>
                      {product.stock > 0 ? `Available: ${product.stock} pcs` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="product-footer">
                    <span className="price">{formatCurrencyPHP(product.price)}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn-add"
                      disabled={product.status === 'out_of_stock' || product.stock === 0}
                    >
                      {product.status === 'out_of_stock' || product.stock === 0 ? 'Out' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
