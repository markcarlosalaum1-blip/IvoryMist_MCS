import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import formatCurrencyPHP from '../../utils/currency';

const Cart = () => {
  const { cart, removeFromCart, totalAmount } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

          .empty-cart {
            min-height: calc(100vh - 72px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 24px;
            background: 
              radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
              radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
              linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
            color: rgba(255,255,255,0.9);
            padding: 60px 36px;
            font-family: 'DM Sans', sans-serif;
          }

          .empty-state-icon {
            font-size: 64px;
            opacity: 0.5;
          }

          .empty-cart h2 {
            color: #00d4ff;
            font-family: 'Playfair Display', serif;
            font-size: 40px;
            margin: 0 0 8px;
            font-weight: 700;
          }

          .empty-cart p {
            color: rgba(255,255,255,0.7);
            font-size: 16px;
            margin: 0 0 24px;
          }

          .btn-primary {
            padding: 14px 32px;
            background: linear-gradient(135deg, #00d4ff, #10b981);
            color: #ffffff;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 8px 24px rgba(0,212,255,0.35);
            border: none;
            cursor: pointer;
            display: inline-block;
          }

          .btn-primary:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 36px rgba(0,212,255,0.5);
          }

          .btn-primary:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 36px rgba(232,201,122,0.35);
          }

          @media (max-width: 768px) {
            .empty-cart {
              padding: 40px 24px;
            }

            .empty-cart h2 {
              font-size: 32px;
            }
          }
        `}</style>

        <div className="empty-cart">
          <div className="empty-state-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Time to discover some delicious beverages!</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .cart-container {
          min-height: calc(100vh - 72px);
          padding: 60px 36px;
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
        }

        .cart-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 40px;
          background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #2e1065 100%);
          padding: 40px 36px;
          border-radius: 16px;
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.4),
            0 0 60px rgba(79,70,229,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(79,70,229,0.3);
          position: relative;
          overflow: hidden;
        }

        .cart-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 400px 300px at 20% 30%, rgba(139,92,246,0.15), transparent 60%),
            radial-gradient(ellipse 350px 250px at 80% 70%, rgba(99,102,241,0.12), transparent 55%);
          pointer-events: none;
        }

        .cart-content h1 {
          font-family: 'Playfair Display', serif;
          color: #a78bfa;
          font-size: 44px;
          margin: 0 0 8px;
          font-weight: 700;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.3));
        }

        .cart-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 15px;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
          background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(16,185,129,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.25);
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cart-item:hover {
          border-color: rgba(0,212,255,0.4);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1);
          transform: translateX(4px);
        }

        .item-info h3 {
          margin: 0 0 8px;
          font-size: 18px;
          font-family: 'Playfair Display', serif;
          color: rgba(255,255,255,0.95);
          font-weight: 700;
        }

        .item-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin: 0;
          color: rgba(0,212,255,0.8);
          font-size: 14px;
        }

        .item-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .item-total {
          font-size: 16px;
          font-weight: 700;
          color: #00d4ff;
          min-width: 100px;
          text-align: right;
        }

        .btn-delete {
          background: rgba(255,107,107,0.15);
          border: 1px solid rgba(255,107,107,0.3);
          color: #ff6b6b;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-delete:hover {
          background: rgba(255,107,107,0.25);
          transform: scale(1.05);
        }

        .cart-summary-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(16,185,129,0.08) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.3);
          padding: 32px;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .summary-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #00d4ff;
          margin: 0;
          font-weight: 700;
        }

        .summary-total {
          text-align: right;
        }

        .summary-total-value {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #00d4ff;
          font-weight: 700;
          margin: 0;
        }

        .btn-checkout {
          padding: 16px 32px;
          background: linear-gradient(135deg, #00d4ff, #10b981);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 24px rgba(0,212,255,0.35);
          white-space: nowrap;
        }

        .btn-checkout:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 36px rgba(0,212,255,0.5);
        }

        @media (max-width: 768px) {
          .cart-container {
            padding: 40px 24px;
          }

          .cart-content h1 {
            font-size: 32px;
          }

          .cart-item {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .item-actions {
            width: 100%;
            justify-content: space-between;
          }

          .item-total {
            min-width: auto;
            text-align: left;
          }

          .cart-summary-card {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .summary-total {
            text-align: left;
          }

          .btn-checkout {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <h1>Your Cart</h1>
            <p className="cart-subtitle">{cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout</p>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <div className="item-details">
                    <span>{formatCurrencyPHP(item.price)} each</span>
                    <span>•</span>
                    <span>{item.quantity} in cart</span>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="item-total">{formatCurrencyPHP(item.price * item.quantity)}</div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="btn-delete"
                    title="Remove from cart"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <div className="summary-info">
              <h2>Ready to Order?</h2>
            </div>
            <div className="summary-total">
              <p style={{margin: '0 0 8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>Total Amount</p>
              <p className="summary-total-value">{formatCurrencyPHP(totalAmount)}</p>
            </div>
            <Link to="/checkout" className="btn-checkout">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
