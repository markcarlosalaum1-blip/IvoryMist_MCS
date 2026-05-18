import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 
              inset 0 0 20px rgba(168,85,247,0.15),
              0 0 30px rgba(168,85,247,0.2),
              0 0 60px rgba(34,211,238,0.1);
          }
          50% { 
            box-shadow: 
              inset 0 0 30px rgba(168,85,247,0.25),
              0 0 50px rgba(168,85,247,0.35),
              0 0 80px rgba(34,211,238,0.15);
          }
        }

        @keyframes neonGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(168,85,247,0.4), 0 0 20px rgba(34,211,238,0.2); }
          50% { text-shadow: 0 0 20px rgba(168,85,247,0.6), 0 0 35px rgba(34,211,238,0.3); }
        }

        @keyframes sidebarHover {
          0% { 
            background: rgba(168,85,247,0.06);
            border-color: rgba(168,85,247,0.2);
            box-shadow: inset 0 0 12px rgba(168,85,247,0.05);
          }
          50% { 
            background: rgba(168,85,247,0.12);
            border-color: rgba(168,85,247,0.5);
            box-shadow: inset 0 0 20px rgba(168,85,247,0.1), 0 0 20px rgba(168,85,247,0.2);
          }
          100% { 
            background: rgba(168,85,247,0.06);
            border-color: rgba(168,85,247,0.2);
            box-shadow: inset 0 0 12px rgba(168,85,247,0.05);
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .admin-dashboard-wrapper {
          height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
          background: 
            radial-gradient(ellipse 1200px 800px at 15% 25%, rgba(168,85,247,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 1400px 900px at 85% 75%, rgba(34,211,238,0.06) 0%, transparent 50%),
            linear-gradient(135deg, #050816 0%, #0A1026 20%, #1E1B4B 40%, #071B34 60%, #0A1026 80%, #050816 100%);
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .admin-dashboard-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 50% 0%, rgba(168,85,247,0.05) 0%, transparent 40%),
            radial-gradient(circle at 0% 50%, rgba(34,211,238,0.03) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(217,70,239,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .admin-sidebar {
          width: 280px;
          background: 
            rgba(15, 12, 40, 0.65);
          backdrop-filter: blur(30px);
          border-right: 2px solid;
          border-image: linear-gradient(180deg, rgba(168,85,247,0.4), rgba(34,211,238,0.25), rgba(217,70,239,0.2)) 1;
          padding: 40px 24px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 28px;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
          flex-shrink: 0;
          box-shadow: inset -1px 0 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4);
          animation: glowPulse 4s ease-in-out infinite;
        }

        .admin-sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .admin-sidebar::-webkit-scrollbar-track {
          background: rgba(168,85,247,0.05);
          border-radius: 10px;
        }

        .admin-sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(168,85,247,0.4), rgba(34,211,238,0.4));
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(168,85,247,0.3);
        }

        .admin-sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(168,85,247,0.6), rgba(34,211,238,0.6));
          box-shadow: 0 0 15px rgba(168,85,247,0.5);
        }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .admin-sidebar-title {
          font-family: 'Sora', 'Poppins', sans-serif;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          display: flex;
          gap: 2px;
          align-items: baseline;
        }

        .admin-sidebar-title .ivory-text {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 700;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
        }

        .admin-sidebar-title .mist-text {
          background: linear-gradient(135deg, #A855F7 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 
            0 0 20px rgba(168,85,247,0.5),
            2px 2px 4px rgba(59,130,246,0.4),
            4px 4px 8px rgba(59,130,246,0.3),
            6px 6px 12px rgba(59,130,246,0.2);
          filter: drop-shadow(0 3px 8px rgba(168,85,247,0.3)) drop-shadow(0 6px 12px rgba(59,130,246,0.2));
        }

        .admin-sidebar:hover .admin-sidebar-title .ivory-text {
          color: #22D3EE;
          text-shadow: 0 0 15px rgba(34,211,238,0.4);
        }

        .admin-sidebar:hover .admin-sidebar-title .mist-text {
          background: linear-gradient(135deg, #D946EF 0%, #1E40AF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 25px rgba(217,70,239,0.6),
            2px 2px 6px rgba(30,64,175,0.5),
            4px 4px 10px rgba(30,64,175,0.4),
            6px 6px 16px rgba(30,64,175,0.3);
          filter: drop-shadow(0 4px 10px rgba(217,70,239,0.4)) drop-shadow(0 8px 16px rgba(30,64,175,0.3));
        }

        .admin-sidebar-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 20px 0 16px;
          padding-left: 12px;
          border-left: 2.5px solid;
          border-image: linear-gradient(180deg, rgba(168,85,247,0.6), rgba(34,211,238,0.4)) 1;
        }

        .admin-nav-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-nav-link {
          padding: 16px 18px;
          background: rgba(168,85,247,0.04);
          border: 1.5px solid rgba(168,85,247,0.15);
          border-radius: 14px;
          font-family: 'Sora', 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 0.02em;
          text-decoration: none;
          box-shadow: inset 0 0 10px rgba(168,85,247,0.03);
        }

        .admin-nav-link:hover {
          background: rgba(168,85,247,0.1);
          border-color: rgba(168,85,247,0.35);
          color: rgba(255,255,255,0.9);
          box-shadow: 
            inset 0 0 16px rgba(168,85,247,0.08),
            0 0 20px rgba(168,85,247,0.2);
          transform: translateX(6px);
        }

        .admin-nav-link.active {
          background: 
            linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(34,211,238,0.1) 100%);
          border-color: rgba(168,85,247,0.6);
          color: #22D3EE;
          box-shadow: 
            inset 0 0 20px rgba(168,85,247,0.15),
            0 0 25px rgba(168,85,247,0.25),
            0 0 40px rgba(34,211,238,0.15);
          filter: drop-shadow(0 0 10px rgba(34,211,238,0.2));
        }

        .admin-nav-icon {
          font-size: 18px;
          filter: drop-shadow(0 0 8px rgba(168,85,247,0.2));
        }

        .admin-content {
          flex: 1;
          padding: 32px 36px;
          color: rgba(255,255,255,0.95);
          font-family: 'Sora', 'Poppins', sans-serif;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: 
            radial-gradient(circle at 50% 0%, rgba(168,85,247,0.03) 0%, transparent 30%),
            radial-gradient(circle at 100% 100%, rgba(34,211,238,0.02) 0%, transparent 40%);
        }

        .admin-content::-webkit-scrollbar {
          width: 10px;
        }

        .admin-content::-webkit-scrollbar-track {
          background: rgba(168,85,247,0.02);
          border-radius: 10px;
        }

        .admin-content::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(168,85,247,0.3), rgba(34,211,238,0.3));
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(168,85,247,0.2);
        }

        .admin-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(168,85,247,0.5), rgba(34,211,238,0.5));
          box-shadow: 0 0 15px rgba(168,85,247,0.4);
        }

        @media (max-width: 1400px) {
          .admin-content {
            padding: 28px 32px;
          }
        }

        @media (max-width: 1024px) {
          .admin-sidebar {
            width: 240px;
            padding: 32px 16px;
          }

          .admin-content {
            padding: 24px 20px;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard-wrapper {
            flex-direction: column;
            height: 100vh;
          }

          .admin-sidebar {
            position: relative;
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 2px solid;
            border-image: linear-gradient(90deg, rgba(168,85,247,0.4), rgba(34,211,238,0.25)) 1;
            padding: 20px 16px;
            flex-shrink: 0;
            overflow-y: visible;
          }

          .admin-content {
            flex: 1;
            padding: 20px 16px;
            height: auto;
            overflow-y: auto;
            width: 100%;
          }

          .admin-nav-items {
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-nav-link {
            flex: 1;
            min-width: 120px;
            padding: 12px 16px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .admin-content {
            padding: 12px;
          }

          .admin-sidebar-title {
            font-size: 22px;
          }

          .admin-nav-link {
            padding: 12px 14px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="admin-dashboard-wrapper">
        {/* Sidebar Navigation */}
        <div className="admin-sidebar">
          <div>
            <h2 className="admin-sidebar-title">
              <span className="ivory-text">Ivory</span><span className="mist-text">Mist</span>
            </h2>
            <div className="admin-sidebar-subtitle">Admin Panel</div>
          </div>

          <div className="admin-nav-items">
            <Link 
              to="/admin/dashboard" 
              className={`admin-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">📊</span>
              Dashboard
            </Link>
            <Link 
              to="/admin/products" 
              className={`admin-nav-link ${isActive('/admin/products') ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">📦</span>
              Products
            </Link>
            <Link 
              to="/admin/staff" 
              className={`admin-nav-link ${isActive('/admin/staff') ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">👥</span>
              Staff
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
