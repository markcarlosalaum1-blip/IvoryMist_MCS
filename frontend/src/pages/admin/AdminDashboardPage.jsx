import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import formatCurrencyPHP from '../../utils/currency';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, productCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes, ordersRes] = await Promise.all([
          API.get('/reports/sales'),
          API.get('/products'),
          API.get('/orders')
        ]);
        const totalSales = (salesRes.data && salesRes.data.totalSales) ? salesRes.data.totalSales : 0;
        const orderCount = (ordersRes.data && ordersRes.data.pagination) ? ordersRes.data.pagination.total : 0;
        const productCount = (productsRes.data) ? productsRes.data.length : 0;
        setStats({ totalSales, orderCount, productCount });
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes cardGlow {
          0%, 100% { 
            box-shadow: 
              inset 0 0 20px rgba(168,85,247,0.1),
              0 0 30px rgba(168,85,247,0.15),
              0 0 60px rgba(34,211,238,0.08);
          }
          50% { 
            box-shadow: 
              inset 0 0 30px rgba(168,85,247,0.18),
              0 0 50px rgba(168,85,247,0.25),
              0 0 80px rgba(34,211,238,0.12);
          }
        }

        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 15px rgba(168,85,247,0.3), 0 0 30px rgba(34,211,238,0.15); }
          50% { text-shadow: 0 0 25px rgba(168,85,247,0.5), 0 0 45px rgba(34,211,238,0.25); }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes statValuePulse {
          0%, 100% { color: #A855F7; text-shadow: 0 0 15px rgba(168,85,247,0.4); }
          50% { color: #22D3EE; text-shadow: 0 0 25px rgba(34,211,238,0.4); }
        }

        @keyframes buttonGlowHover {
          0% { 
            box-shadow: 0 8px 28px rgba(168,85,247,0.25), 0 0 30px rgba(34,211,238,0.15);
          }
          50% { 
            box-shadow: 0 12px 40px rgba(168,85,247,0.4), 0 0 50px rgba(34,211,238,0.25);
          }
          100% { 
            box-shadow: 0 8px 28px rgba(168,85,247,0.25), 0 0 30px rgba(34,211,238,0.15);
          }
        }

        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          gap: 0;
        }

        .dashboard-header {
          margin-bottom: 32px;
          margin-top: 0;
          padding-top: 0;
          flex-shrink: 0;
        }

        .dashboard-header h1 {
          font-family: 'Sora', 'Poppins', sans-serif;
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0 0 10px 0;
          padding: 0;
          line-height: 1.1;
          background: linear-gradient(135deg, #A855F7 0%, #3B82F6 50%, #22D3EE 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(168,85,247,0.2));
        }

        .dashboard-header p {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.03em;
          margin: 0;
          padding: 0;
          font-weight: 400;
          line-height: 1.5;
        }

        .dashboard-nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 32px;
          gap: 24px;
          flex-shrink: 0;
        }

        .btn-delivery {
          background: linear-gradient(135deg, #A855F7 0%, #3B82F6 50%, #22D3EE 100%);
          border: 1.5px solid rgba(168,85,247,0.6);
          border-radius: 14px;
          padding: 13px 26px;
          font-family: 'Sora', 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #050816;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 
            0 8px 28px rgba(168,85,247,0.25),
            0 0 30px rgba(34,211,238,0.15);
          position: relative;
          overflow: hidden;
        }

        .btn-delivery::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-delivery:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(168,85,247,0.4),
            0 0 50px rgba(34,211,238,0.25);
          animation: buttonGlowHover 0.6s ease-in-out;
        }

        .btn-delivery:hover::before {
          left: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          flex-shrink: 0;
          flex: 1;
        }

        .stat-card {
          background: 
            rgba(30, 27, 75, 0.4);
          backdrop-filter: blur(20px);
          border: 2px solid;
          border-radius: 20px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 160px;
          animation: cardGlow 4s ease-in-out infinite;
        }

        /* Neon color variants */
        .stat-card:nth-child(1) {
          border-color: rgba(168,85,247,0.5);
          background: 
            linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 20px rgba(168,85,247,0.08),
            0 0 30px rgba(168,85,247,0.15),
            0 0 60px rgba(168,85,247,0.08);
        }

        .stat-card:nth-child(1):hover {
          border-color: rgba(168,85,247,0.8);
          background: 
            linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 30px rgba(168,85,247,0.15),
            0 0 50px rgba(168,85,247,0.3),
            0 0 80px rgba(168,85,247,0.15);
          transform: translateY(-8px);
        }

        .stat-card:nth-child(2) {
          border-color: rgba(34,211,238,0.5);
          background: 
            linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 20px rgba(34,211,238,0.08),
            0 0 30px rgba(34,211,238,0.15),
            0 0 60px rgba(34,211,238,0.08);
        }

        .stat-card:nth-child(2):hover {
          border-color: rgba(34,211,238,0.8);
          background: 
            linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 30px rgba(34,211,238,0.15),
            0 0 50px rgba(34,211,238,0.3),
            0 0 80px rgba(34,211,238,0.15);
          transform: translateY(-8px);
        }

        .stat-card:nth-child(3) {
          border-color: rgba(217,70,239,0.5);
          background: 
            linear-gradient(135deg, rgba(217,70,239,0.08) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 20px rgba(217,70,239,0.08),
            0 0 30px rgba(217,70,239,0.15),
            0 0 60px rgba(217,70,239,0.08);
        }

        .stat-card:nth-child(3):hover {
          border-color: rgba(217,70,239,0.8);
          background: 
            linear-gradient(135deg, rgba(217,70,239,0.15) 0%, rgba(30,27,75,0.4) 100%),
            rgba(30, 27, 75, 0.4);
          box-shadow: 
            inset 0 0 30px rgba(217,70,239,0.15),
            0 0 50px rgba(217,70,239,0.3),
            0 0 80px rgba(217,70,239,0.15);
          transform: translateY(-8px);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -40%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(30px);
        }

        .stat-card:nth-child(2)::before {
          background: radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 60%);
        }

        .stat-card:nth-child(3)::before {
          background: radial-gradient(circle, rgba(217,70,239,0.15) 0%, transparent 60%);
        }

        .stat-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .stat-icon {
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(168,85,247,0.12);
          border: 2px solid rgba(168,85,247,0.3);
          border-radius: 50%;
          margin-bottom: 8px;
          animation: iconFloat 3s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(168,85,247,0.3));
        }

        .stat-card:nth-child(1) .stat-icon {
          background: rgba(168,85,247,0.15);
          border-color: rgba(168,85,247,0.6);
          color: #A855F7;
          filter: drop-shadow(0 0 15px rgba(168,85,247,0.4));
        }

        .stat-card:nth-child(2) .stat-icon {
          background: rgba(34,211,238,0.15);
          border-color: rgba(34,211,238,0.6);
          color: #22D3EE;
          filter: drop-shadow(0 0 15px rgba(34,211,238,0.4));
          animation-delay: 0.2s;
        }

        .stat-card:nth-child(3) .stat-icon {
          background: rgba(217,70,239,0.15);
          border-color: rgba(217,70,239,0.6);
          color: #D946EF;
          filter: drop-shadow(0 0 15px rgba(217,70,239,0.4));
          animation-delay: 0.4s;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin: 0;
          transition: all 0.3s ease;
        }

        .stat-card:nth-child(1) .stat-label {
          color: rgba(168,85,247,0.85);
        }

        .stat-card:nth-child(2) .stat-label {
          color: rgba(34,211,238,0.85);
        }

        .stat-card:nth-child(3) .stat-label {
          color: rgba(217,70,239,0.85);
        }

        .stat-card:hover .stat-label {
          color: rgba(255,255,255,0.95);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          animation: statValuePulse 4s ease-in-out infinite;
        }

        .stat-card:nth-child(1) .stat-value {
          color: #A855F7;
          text-shadow: 0 0 20px rgba(168,85,247,0.5);
        }

        .stat-card:nth-child(2) .stat-value {
          color: #22D3EE;
          text-shadow: 0 0 20px rgba(34,211,238,0.5);
        }

        .stat-card:nth-child(3) .stat-value {
          color: #D946EF;
          text-shadow: 0 0 20px rgba(217,70,239,0.5);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 32px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-nav {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header h1 {
            font-size: 26px;
          }

          .stat-card {
            padding: 20px;
            min-height: 140px;
          }

          .stat-icon {
            width: 56px;
            height: 48px;
            font-size: 22px;
          }

          .stat-value {
            font-size: 22px;
          }

          .btn-delivery {
            padding: 10px 18px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Real-time insights into your café operations</p>
        </div>

        <div className="dashboard-nav">
          <Link to="/admin/deliveries" className="btn-delivery">
            🚚 Delivery Orders
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">💰</div>
              <p className="stat-label">Total Sales</p>
              <p className="stat-value">{formatCurrencyPHP(stats.totalSales)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">📦</div>
              <p className="stat-label">Total Orders</p>
              <p className="stat-value">{stats.orderCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon">📊</div>
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{stats.productCount}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
