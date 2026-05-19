import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap');

        @keyframes navGlowPulse {
          0%, 100% { 
            box-shadow: 
              0 8px 32px rgba(168,85,247,0.2),
              0 0 20px rgba(168,85,247,0.1),
              inset 0 1px 0 rgba(255,255,255,0.08);
          }
          50% { 
            box-shadow: 
              0 8px 32px rgba(168,85,247,0.35),
              0 0 40px rgba(59,130,246,0.15),
              inset 0 1px 0 rgba(255,255,255,0.12);
          }
        }

        @keyframes neoBrandGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(59,130,246,0.2); }
          50% { text-shadow: 0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(59,130,246,0.3); }
        }

        @keyframes neoLinkHover {
          0% { 
            box-shadow: 0 4px 12px rgba(34,211,238,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(34,211,238,0.3);
          }
          50% { 
            box-shadow: 0 8px 24px rgba(34,211,238,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
            border-color: rgba(34,211,238,0.6);
          }
          100% { 
            box-shadow: 0 4px 12px rgba(34,211,238,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
            border-color: rgba(34,211,238,0.3);
          }
        }

        .navbar {
          background: linear-gradient(135deg, #050816 0%, #1e1b4b 25%, #0f172a 50%, #1e1b4b 75%, #050816 100%);
          backdrop-filter: blur(25px);
          border-bottom: 1.5px solid;
          border-image: linear-gradient(90deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2), rgba(217,70,239,0.2)) 1;
          padding: 16px 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Sora', 'Poppins', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          animation: navGlowPulse 4s ease-in-out infinite;
        }

        .nav-brand a {
          font-family: 'Sora', 'Poppins', sans-serif;
          font-size: 28px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.02em;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 0;
        }

        .nav-brand a .ivory-text {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 700;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }

        .nav-brand a .mist-text {
          background: linear-gradient(135deg, #A855F7 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-shadow: 
            0 0 15px rgba(168,85,247,0.4),
            2px 2px 4px rgba(59,130,246,0.3),
            4px 4px 8px rgba(59,130,246,0.2),
            6px 6px 12px rgba(59,130,246,0.15);
          filter: drop-shadow(0 3px 8px rgba(168,85,247,0.3)) drop-shadow(0 6px 12px rgba(59,130,246,0.2));
          transition: all 0.3s ease;
        }

        .nav-brand a:hover .ivory-text {
          color: #22D3EE;
          text-shadow: 0 0 12px rgba(34,211,238,0.3);
        }

        .nav-brand a:hover .mist-text {
          background: linear-gradient(135deg, #D946EF 0%, #1E40AF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 20px rgba(217,70,239,0.5),
            2px 2px 6px rgba(30,64,175,0.4),
            4px 4px 10px rgba(30,64,175,0.3),
            6px 6px 16px rgba(30,64,175,0.2),
            0 0 35px rgba(168,85,247,0.3);
          filter: drop-shadow(0 4px 10px rgba(217,70,239,0.4)) drop-shadow(0 8px 16px rgba(30,64,175,0.3));
        }

        .nav-brand a:hover {
          transform: translateY(-3px) scale(1.05);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-links a {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          padding: 12px 20px;
          border-radius: 12px;
          background: rgba(168,85,247,0.05);
          border: 1.5px solid rgba(168,85,247,0.15);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .nav-links a::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2.5px;
          background: linear-gradient(90deg, #A855F7, #3B82F6, #22D3EE);
          transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 2px;
        }

        .nav-links a:hover {
          color: #22D3EE;
          background: rgba(168,85,247,0.2);
          border-color: rgba(168,85,247,0.6);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(168,85,247,0.3), 0 0 20px rgba(34,211,238,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
          animation: neoLinkHover 0.6s ease-in-out;
        }

        .nav-links a:hover::before {
          width: 100%;
        }

        .cart-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          background: rgba(168,85,247,0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #22D3EE;
          border: 1.5px solid rgba(34,211,238,0.25);
          font-weight: 600;
        }

        .cart-link svg {
          width: 20px;
          height: 20px;
          color: inherit;
          filter: drop-shadow(0 0 8px rgba(34,211,238,0.4));
        }

        .cart-link:hover {
          background: rgba(168,85,247,0.15);
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 12px 32px rgba(34,211,238,0.35), 0 0 20px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
          border-color: rgba(34,211,238,0.6);
          color: #7DFaFF;
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #A855F7 0%, #3B82F6 100%);
          color: #050816;
          min-width: 24px;
          height: 24px;
          padding: 0 6px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid rgba(5,8,22,0.95);
          box-shadow: 0 4px 16px rgba(168,85,247,0.5), 0 0 12px rgba(34,211,238,0.3), inset 0 1px 2px rgba(255,255,255,0.2);
          animation: cartPulse 2s ease-in-out infinite;
        }

        @keyframes cartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); box-shadow: 0 6px 20px rgba(168,85,247,0.6), 0 0 16px rgba(34,211,238,0.4); }
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          padding: 12px 20px;
          border-left: 2px solid rgba(168,85,247,0.4);
          border-radius: 12px;
          background: rgba(168,85,247,0.08);
          transition: all 0.3s ease;
        }

        .user-info svg {
          color: #A855F7;
          filter: drop-shadow(0 0 8px rgba(168,85,247,0.3));
        }

        .user-info:hover {
          background: rgba(168,85,247,0.15);
          box-shadow: 0 6px 20px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .logout-btn {
          background: rgba(217,70,239,0.12);
          border: 1.5px solid rgba(217,70,239,0.3);
          border-radius: 12px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D946EF;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(217,70,239,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .logout-btn:hover {
          background: rgba(217,70,239,0.25);
          border-color: rgba(217,70,239,0.7);
          color: #FF6FFF;
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 12px 28px rgba(217,70,239,0.4), 0 0 20px rgba(217,70,239,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 14px 24px;
            gap: 16px;
          }

          .nav-brand a {
            font-size: 22px;
          }

          .nav-links {
            gap: 12px;
            flex-wrap: wrap;
          }

          .nav-links a {
            font-size: 12px;
            padding: 8px 12px;
          }

          .user-info {
            font-size: 12px;
            padding: 8px 12px;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 12px 16px;
            flex-direction: column;
            gap: 10px;
          }

          .nav-links {
            width: 100%;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .nav-links a {
            font-size: 11px;
            padding: 6px 10px;
          }

          .nav-brand a {
            font-size: 20px;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <span className="ivory-text">Ivory</span><span className="mist-text">Mist</span>
          </Link>
        </div>
        <div className="nav-links">
          {/* Show Menu/Cart only to customers (unauthenticated users or users without admin/staff roles) */}
          {(!user || (user && !['admin', 'staff'].includes(user.role))) && (
            <>
              <Link to="/">Home</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/about">About Us</Link>
              <Link to="/cart" className="cart-link">
                <FaShoppingCart />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </Link>
              <Link to="/track">Track Order</Link>
            </>
          )}
          
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              {user.role === 'staff' && <Link to="/staff">Staff</Link>}
              <span className="user-info"><FaUser /> {user.name}</span>
              <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /></button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

