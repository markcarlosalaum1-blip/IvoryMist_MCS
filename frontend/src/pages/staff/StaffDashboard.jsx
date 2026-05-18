import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import formatCurrencyPHP from '../../utils/currency';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [updatingIds, setUpdatingIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCancelled, setShowCancelled] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      const payload = res.data;
      const orders = Array.isArray(payload) ? payload : (payload && payload.data) ? payload.data : [];
      setOrders(orders);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        toast.error('Unauthorized. Please log in as staff/admin.');
      } else {
        toast.error('Failed to load orders');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    let prevStatus = null;
    try {
      // capture previous status so we can revert if API fails
      prevStatus = (orders.find(o => o.id === orderId) || {}).status;
      // Optimistically update local orders state so UI reflects change immediately
      setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, status: newStatus }) : o));
      // mark updating
      setUpdatingIds(prev => Array.from(new Set([...prev, orderId])));
      // call API and use its returned updated order object to ensure full consistency
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      const updatedOrder = res?.data;
      if (updatedOrder) {
        setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, ...updatedOrder }) : o));
      }
      toast.success(`Order status updated to ${newStatus}`);
      // broadcast update for other tabs (admin view) to pick up immediately
      try {
        localStorage.setItem('order_update', JSON.stringify({ id: orderId, ts: Date.now() }));
      } catch (e) {
        // ignore storage errors (e.g., private mode)
      }
      // refresh in background to ensure latest data
      fetchOrders();
    } catch (err) {
      console.error('updateStatus error', err);
      // revert optimistic update on failure
      const msg = err?.response?.data?.message || err.message || 'Failed to update status';
      // Check if payment verification is required
      if (err?.response?.data?.requires_verification) {
        toast.error('Payment must be verified before preparing order');
      } else {
        toast.error(msg);
      }
      if (prevStatus !== null) {
        setOrders(prev => prev.map(o => o.id === orderId ? ({ ...o, status: prevStatus }) : o));
      }
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== orderId));
    }
  };

  const allowedTransitions = {
    Pending: ['Preparing', 'Cancelled'],
    Preparing: ['Ready for Pickup', 'Served', 'Out for Delivery', 'Cancelled'],
    'Ready for Pickup': ['Completed', 'Cancelled'],
    'Served': ['Completed', 'Cancelled'],
    'Out for Delivery': ['Delivered'],
    Delivered: ['Completed'],
    Completed: [],
    Cancelled: []
  };

  const { user } = useContext(AuthContext);

  const nextActionsFor = (order) => {
    const next = allowedTransitions[order.status] || [];
    const orderType = order.order_type || 'Pickup';
    // Filter out order-type-specific statuses that don't apply
    return next.filter(s => {
      if (s === 'Out for Delivery' || s === 'Delivered') {
        return orderType === 'Delivery';
      }
      if (s === 'Ready for Pickup') {
        return orderType === 'Pickup';
      }
      if (s === 'Served') {
        return orderType === 'Dine-in';
      }
      return true;
    });
  };

  const verifyPayment = async (orderId, action) => {
    try {
      const payment_status = action === 'verify' ? 'Paid' : 'Rejected';
      await API.put(`/orders/${orderId}/payment`, { payment_status });
      toast.success(`Payment ${payment_status}`);
      fetchOrders();
    } catch (err) {
      console.error('verifyPayment error', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to update payment';
      toast.error(msg);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

        * { box-sizing: border-box; }

        .staff-dashboard {
          min-height: calc(100vh - 72px);
          padding: 40px;
          background: linear-gradient(135deg, #f8fafb 0%, #f0f4f8 100%);
          color: #1a202c;
          font-family: 'Inter', sans-serif;
        }

        .dashboard-header {
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-family: 'Sora', sans-serif;
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #0066cc 0%, #00a8cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
        }

        .dashboard-header p {
          color: #718096;
          font-size: 15px;
          margin: 0;
        }

        .filter-section {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .filter-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 600;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-section select {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #2d3748;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-section select:hover {
          border-color: #00a8cc;
        }

        .filter-section select:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .filter-section input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #0066cc;
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-left: 4px solid;
        }

        .stat-card.pending { border-color: #f59e0b; }
        .stat-card.preparing { border-color: #0066cc; }
        .stat-card.ready { border-color: #10b981; }
        .stat-card.completed { border-color: #8b5cf6; }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
        }

        .orders-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          border-top: 4px solid #0066cc;
        }

        .order-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        .order-card.status-pending { border-top-color: #f59e0b; }
        .order-card.status-preparing { border-top-color: #0066cc; }
        .order-card.status-ready\ for\ pickup { border-top-color: #10b981; }
        .order-card.status-served { border-top-color: #00a8cc; }
        .order-card.status-out\ for\ delivery { border-top-color: #3b82f6; }
        .order-card.status-delivered { border-top-color: #06b6d4; }
        .order-card.status-completed { border-top-color: #8b5cf6; }
        .order-card.status-cancelled { border-top-color: #ef4444; }

        .order-header {
          padding: 20px;
          border-bottom: 1px solid #f0f4f8;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .order-number {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .order-status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-status.pending { background: #fef3c7; color: #92400e; }
        .order-status.preparing { background: #dbeafe; color: #1e40af; }
        .order-status.ready { background: #d1fae5; color: #065f46; }
        .order-status.served { background: #cffafe; color: #164e63; }
        .order-status.delivery { background: #dbeafe; color: #0c4a6e; }
        .order-status.delivered { background: #cffafe; color: #164e63; }
        .order-status.completed { background: #e9d5ff; color: #5b21b6; }
        .order-status.cancelled { background: #fee2e2; color: #991b1b; }

        .order-body {
          padding: 20px;
          flex: 1;
        }

        .order-section {
          margin-bottom: 16px;
        }

        .order-section:last-child {
          margin-bottom: 0;
        }

        .order-section-title {
          font-size: 12px;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .order-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .info-item {
          font-size: 13px;
        }

        .info-label {
          color: #718096;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .info-value {
          color: #1a202c;
          font-weight: 600;
        }

        .order-type-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          background: #f0f4f8;
          color: #2d3748;
        }

        .order-items-container {
          margin-bottom: 0;
        }

        .order-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .order-item {
          background: #f8fafb;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          color: #2d3748;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        .order-timestamps {
          background: #f8fafb;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
          color: #718096;
          line-height: 1.6;
        }

        .order-timestamps div {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .order-actions {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #f0f4f8;
          flex-wrap: wrap;
        }

        .btn {
          flex: 1;
          min-width: 100px;
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0066cc, #00a8cc);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
          transform: translateY(-2px);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
        }

        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .btn-warning:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          transform: translateY(-2px);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #2d3748;
          border: 1px solid #cbd5e0;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #cbd5e0;
        }

        .btn-action-menu {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #2d3748;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-action-menu:hover {
          border-color: #0066cc;
          color: #0066cc;
        }

        .no-orders {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .no-orders-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .no-orders h3 {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        @media (max-width: 768px) {
          .staff-dashboard {
            padding: 24px;
          }

          .dashboard-header h1 {
            font-size: 28px;
          }

          .orders-list {
            grid-template-columns: 1fr;
          }

          .filter-section {
            flex-direction: column;
          }

          .filter-group {
            width: 100%;
          }

          .filter-section select {
            width: 100%;
          }

          .order-info {
            grid-template-columns: 1fr;
          }

          .order-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="staff-dashboard">
        <div className="dashboard-header">
          <h1>📋 Order Management</h1>
          <p>Track and manage incoming orders in real-time</p>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="dateFilter">Filter by Date</label>
            <select id="dateFilter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="statusFilter">Filter by Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Served">Served</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginLeft: 'auto' }}>
            <label htmlFor="showCancelled">
              <input 
                id="showCancelled"
                type="checkbox" 
                checked={showCancelled} 
                onChange={(e) => setShowCancelled(e.target.checked)} 
              />
              Show Cancelled
            </label>
          </div>
        </div>

        {orders.filter(order => {
          const orderDate = new Date(order.created_at);
          const now = new Date();
          if (dateFilter === 'today') {
            return orderDate.toDateString() === now.toDateString();
          } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return orderDate >= monthAgo;
          }
          return true;
        })
        .filter(order => statusFilter === 'all' || order.status === statusFilter)
        .filter(order => showCancelled || order.status !== 'Cancelled').length > 0 && (
          <div className="stats-bar">
            {[
              { label: 'Pending', count: orders.filter(o => o.status === 'Pending').length, color: 'pending' },
              { label: 'Preparing', count: orders.filter(o => o.status === 'Preparing').length, color: 'preparing' },
              { label: 'Ready', count: orders.filter(o => o.status === 'Ready for Pickup' || o.status === 'Served').length, color: 'ready' },
              { label: 'Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'completed' },
            ].map(stat => (
              <div key={stat.label} className={`stat-card ${stat.color}`}>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.count}</div>
              </div>
            ))}
          </div>
        )}

        <div className="orders-list">
          {orders
            .filter(order => {
              const orderDate = new Date(order.created_at);
              const now = new Date();
              if (dateFilter === 'today') {
                return orderDate.toDateString() === now.toDateString();
              } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= weekAgo;
              } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                return orderDate >= monthAgo;
              }
              return true;
            })
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .filter(order => showCancelled || order.status !== 'Cancelled')
            .map(order => (
              <div key={order.id} className={`order-card status-${order.status.toLowerCase()}`}>
                <div className="order-header">
                  <div>
                    <h3 className="order-number">{order.order_number}</h3>
                    <span className="order-type-badge">{order.order_type}</span>
                  </div>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-body">
                  <div className="order-section">
                    <div className="order-section-title">👤 Customer Details</div>
                    <div className="order-info">
                      <div className="info-item">
                        <div className="info-label">Name</div>
                        <div className="info-value">{order.customer_name}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Total</div>
                        <div className="info-value">{formatCurrencyPHP(order.total_amount)}</div>
                      </div>
                    </div>
                  </div>

                  {order.order_type === 'Delivery' && (
                    <div className="order-section">
                      <div className="order-section-title">🚚 Delivery Info</div>
                      <div className="order-info">
                        <div className="info-item">
                          <div className="info-label">Contact</div>
                          <div className="info-value">{order.contact_number}</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">Payment</div>
                          <div className="info-value">{order.payment_status || 'N/A'}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                          <div className="info-label">Address</div>
                          <div className="info-value">{order.address}</div>
                        </div>
                        {order.landmark && (
                          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                            <div className="info-label">Landmark</div>
                            <div className="info-value">{order.landmark}</div>
                          </div>
                        )}
                      </div>
                      {order.payment_proof && (
                        <div style={{ marginTop: 12 }}>
                          <a href={order.payment_proof} target="_blank" rel="noreferrer" style={{ color: '#0066cc', fontSize: '13px', fontWeight: 600 }}>
                            📸 View Payment Proof
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {order.order_type === 'Dine-in' && order.table_number && (
                    <div className="order-section">
                      <div className="order-section-title">🪑 Table</div>
                      <div className="info-value" style={{ fontSize: '16px' }}>{order.table_number}</div>
                    </div>
                  )}

                  <div className="order-section order-items-container">
                    <div className="order-section-title">📦 Items</div>
                    <div className="order-items">
                      {order.order_items && order.order_items.map(item => (
                        <div key={item.id} className="order-item">
                          {item.products?.name} <strong>×{item.quantity}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-section">
                    <div className="order-section-title">📅 Timeline</div>
                    <div className="order-timestamps">
                      <div>🕐 Placed: {new Date(order.created_at).toLocaleString()}</div>
                      {order.delivery_started_at && (
                        <div>🚀 Delivery Started: {new Date(order.delivery_started_at).toLocaleString()}</div>
                      )}
                      {order.delivered_at && (
                        <div>✓ Delivered: {new Date(order.delivered_at).toLocaleString()}</div>
                      )}
                      {order.status === 'Completed' && order.updated_at && (
                        <div>✔ Completed: {new Date(order.updated_at).toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  {order.status === 'Cancelled' && order.cancellation_reason && (
                    <div className="order-section">
                      <div className="order-section-title">❌ Cancellation</div>
                      <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
                        {order.cancellation_reason}
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  {order.order_type === 'Delivery' && order.payment_status === 'Pending Verification' && (
                    <>
                      <button 
                        onClick={() => verifyPayment(order.id, 'verify')} 
                        className="btn btn-success"
                      >
                        ✓ Verify Payment
                      </button>
                      <button 
                        onClick={() => verifyPayment(order.id, 'reject')} 
                        className="btn btn-danger"
                      >
                        ✕ Reject Payment
                      </button>
                    </>
                  )}

                  {order.status === 'Pending' && (
                    <button 
                      disabled={updatingIds.includes(order.id)} 
                      onClick={() => updateStatus(order.id, 'Preparing')} 
                      className="btn btn-primary"
                    >
                      👨‍🍳 Start Preparing
                    </button>
                  )}

                  {order.status === 'Preparing' && (
                    order.order_type === 'Delivery' ? (
                      <button 
                        disabled={updatingIds.includes(order.id)} 
                        onClick={() => updateStatus(order.id, 'Out for Delivery')} 
                        className="btn btn-success"
                      >
                        🚚 Out for Delivery
                      </button>
                    ) : order.order_type === 'Dine-in' ? (
                      <button 
                        disabled={updatingIds.includes(order.id)} 
                        onClick={() => updateStatus(order.id, 'Served')} 
                        className="btn btn-success"
                      >
                        🍽 Served
                      </button>
                    ) : (
                      <button 
                        disabled={updatingIds.includes(order.id)} 
                        onClick={() => updateStatus(order.id, 'Ready for Pickup')} 
                        className="btn btn-success"
                      >
                        ✓ Ready for Pickup
                      </button>
                    )
                  )}

                  {order.status === 'Ready for Pickup' && (
                    <button 
                      disabled={updatingIds.includes(order.id)} 
                      onClick={() => updateStatus(order.id, 'Completed')} 
                      className="btn btn-success"
                    >
                      ✔ Complete Order
                    </button>
                  )}

                  {order.status === 'Served' && (
                    <button 
                      disabled={updatingIds.includes(order.id)} 
                      onClick={() => updateStatus(order.id, 'Completed')} 
                      className="btn btn-success"
                    >
                      ✔ Complete Order
                    </button>
                  )}

                  {order.status === 'Out for Delivery' && (
                    <button 
                      disabled={updatingIds.includes(order.id)} 
                      onClick={() => updateStatus(order.id, 'Delivered')} 
                      className="btn btn-success"
                    >
                      📍 Delivered
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <button 
                      disabled={updatingIds.includes(order.id)} 
                      onClick={() => updateStatus(order.id, 'Completed')} 
                      className="btn btn-success"
                    >
                      ✔ Complete Order
                    </button>
                  )}

                  {nextActionsFor(order).length > 0 && !['Pending', 'Preparing', 'Ready for Pickup', 'Served', 'Out for Delivery', 'Delivered'].includes(order.status) && (
                    <select 
                      disabled={updatingIds.includes(order.id)} 
                      onChange={(e) => updateStatus(order.id, e.target.value)} 
                      value=""
                      className="btn-action-menu"
                    >
                      <option value="">⋯ More Actions</option>
                      {nextActionsFor(order).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}

          {orders
            .filter(order => {
              const orderDate = new Date(order.created_at);
              const now = new Date();
              if (dateFilter === 'today') {
                return orderDate.toDateString() === now.toDateString();
              } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= weekAgo;
              } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                return orderDate >= monthAgo;
              }
              return true;
            })
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .filter(order => showCancelled || order.status !== 'Cancelled').length === 0 && (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>No Orders Found</h3>
              <p>There are no orders matching your current filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
