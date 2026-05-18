import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import formatCurrencyPHP from '../../utils/currency';

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderLogs, setOrderLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = async (num) => {
    const orderNum = num || orderNumber;
    setLoading(true);
    try {
      if (!orderNum) {
        setOrder(null);
        setLoading(false);
        return;
      }
      const res = await API.get(`/orders/track/${orderNum}`);
      setOrder(res.data);
      // Also fetch order logs
      try {
        const logsRes = await API.get(`/orders/track/${orderNum}/logs`);
        setOrderLogs(logsRes.data || []);
      } catch (logErr) {
        console.log('No logs available');
        setOrderLogs([]);
      }
    } catch (err) {
      toast.error('Order not found');
      setOrder(null);
      setOrderLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) fetchOrder();
    const iv = setInterval(() => { if (orderNumber) fetchOrder(); }, 15000);
    return () => clearInterval(iv);
  }, [orderNumber]);

  const handleCancelSubmit = async () => {
    if (!order) return;
    if (!cancelReason || cancelReason.trim().length < 3) return toast.error('Please provide a reason (min 3 chars)');
    try {
      setCancelLoading(true);
      await API.put(`/orders/${order.id}/cancel`, { reason: cancelReason });
      toast.success('Order cancelled');
      setShowCancel(false);
      setCancelReason('');
      fetchOrder(order.order_number);
    } catch (err) {
      toast.error('Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const [input, setInput] = useState(orderNumber || '');
  const handleLookup = (e) => {
    e.preventDefault();
    if (!input) return toast.error('Enter order number');
    // navigate to param route so bookmarkable
    navigate(`/track/${input}`);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%), radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%), linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%)',
        color: 'rgba(255,255,255,0.7)'
      }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .track-order {
          min-height: calc(100vh - 72px);
          padding: 60px 36px;
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(168,85,247,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 900px 700px at 80% 70%, rgba(59,130,246,0.15) 0%, transparent 55%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2e1065 70%, #3b2667 100%);
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
        }

        .track-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .track-header {
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

        .track-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 400px 300px at 20% 30%, rgba(139,92,246,0.15), transparent 60%),
            radial-gradient(ellipse 350px 250px at 80% 70%, rgba(99,102,241,0.12), transparent 55%);
          pointer-events: none;
        }

        .track-content h1 {
          font-family: 'Playfair Display', serif;
          color: #a78bfa;
          font-size: 44px;
          margin: 0 0 8px;
          font-weight: 700;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.3));
        }

        .track-subtitle {
          color: rgba(255,255,255,0.7);
          font-size: 15px;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .search-form {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .search-form input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(0,212,255,0.25);
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(16,185,129,0.05));
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.3s;
        }

        .search-form input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .search-form input:focus {
          outline: none;
          border-color: rgba(0,212,255,0.5);
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(16,185,129,0.08));
          box-shadow: 0 0 12px rgba(0,212,255,0.25);
        }

        .btn-search {
          padding: 12px 24px;
          background: linear-gradient(135deg, #00d4ff, #10b981);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(0,212,255,0.3);
        }

        .btn-search:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(0,212,255,0.45);
        }

        .order-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(16,185,129,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.25);
          padding: 32px;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(0,212,255,0.1);
          margin-bottom: 24px;
        }

        .order-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(0,212,255,0.15);
        }

        .order-number {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #00d4ff;
          margin: 0 0 8px;
        }

        .order-status {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0, 212, 255, 0.2);
          border: 1px solid rgba(0, 212, 255, 0.4);
          color: #00d4ff;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-rejected {
          background: rgba(255, 107, 107, 0.15);
          border-color: rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .info-item label {
          font-size: 12px;
          color: rgba(0,212,255,0.85);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }

        .info-item value {
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          display: block;
        }

        .alert-banner {
          background: rgba(255, 107, 107, 0.15);
          border: 1px solid rgba(255, 107, 107, 0.3);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.9);
        }

        .alert-banner strong {
          color: #ff6b6b;
          display: block;
          margin-bottom: 4px;
        }

        .alert-banner p {
          margin: 0;
          font-size: 14px;
        }

        .order-items {
          background: rgba(0,212,255,0.03);
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .order-items h3 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 16px;
          margin: 0 0 16px;
          font-weight: 700;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          border-bottom: 1px solid rgba(0,212,255,0.1);
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .timeline {
          background: rgba(0,212,255,0.03);
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .timeline h3 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 16px;
          margin: 0 0 16px;
          font-weight: 700;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          margin-bottom: 14px;
          position: relative;
          padding-left: 0;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00d4ff;
          margin-top: 4px;
          flex-shrink: 0;
          border: 2px solid rgba(0,212,255,0.3);
        }

        .timeline-item.cancelled .timeline-dot {
          background: #ff6b6b;
          border-color: rgba(255, 107, 107, 0.3);
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-action {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        .timeline-time {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-cancel {
          padding: 12px 20px;
          background: rgba(255, 107, 107, 0.15);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          background: rgba(255, 107, 107, 0.25);
          transform: scale(1.02);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(16,185,129,0.08) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,212,255,0.3);
          color: rgba(255,255,255,0.92);
          padding: 32px;
          border-radius: 18px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }

        .modal-card h3 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 20px;
          margin: 0 0 8px;
          font-weight: 700;
        }

        .modal-card p {
          margin: 0 0 16px;
          color: rgba(255,255,255,0.8);
        }

        .modal-card textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,212,255,0.2);
          background: rgba(0,212,255,0.05);
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          resize: vertical;
          margin-bottom: 16px;
        }

        .modal-card textarea::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .modal-card textarea:focus {
          outline: none;
          border-color: rgba(0,212,255,0.5);
          background: rgba(0,212,255,0.08);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }

        .modal-btn-close {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .modal-btn-close:hover {
          background: rgba(0,212,255,0.15);
          border-color: rgba(0,212,255,0.3);
        }

        .modal-btn-submit {
          background: rgba(255, 107, 107, 0.25);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.4);
        }

        .modal-btn-submit:hover:not(:disabled) {
          background: rgba(255, 107, 107, 0.35);
        }

        .modal-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .track-order {
            padding: 40px 24px;
          }

          .track-content h1 {
            font-size: 32px;
          }

          .order-header {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .order-info-grid {
            grid-template-columns: 1fr;
          }

          .search-form {
            flex-direction: column;
          }

          .modal-card {
            width: 95%;
            padding: 24px;
          }
        }
      `}</style>

      <div className="track-order">
        <div className="track-content">
          <div className="track-header">
            <h1>Track Order</h1>
            <p className="track-subtitle">Monitor your order status in real-time</p>
          </div>

          {!orderNumber && (
            <form onSubmit={handleLookup} className="search-form">
              <input
                type="text"
                placeholder="Enter your order number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn-search">Lookup</button>
            </form>
          )}

          {!order && orderNumber && (
            <div className="order-card">
              <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>
                No order found for <strong>{orderNumber}</strong>
              </p>
            </div>
          )}

          {order && (
            <>
              <div className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-number">#{order.order_number}</p>
                    <span className={`order-status ${order.status === 'Cancelled' || order.payment_status === 'Rejected' ? 'status-rejected' : ''}`}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <p style={{margin: '0 0 8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>Order Total</p>
                    <p style={{margin: '0', fontSize: '20px', fontWeight: '700', color: '#00d4ff'}}>
                      {formatCurrencyPHP(order.total_amount || 0)}
                    </p>
                  </div>
                </div>

                {order.payment_status === 'Rejected' && (
                  <div className="alert-banner">
                    <strong>⚠️ Payment Rejected</strong>
                    <p>Your payment was not accepted. Please cancel this order and place a new one with correct payment details.</p>
                  </div>
                )}

                <div className="order-info-grid">
                  <div className="info-item">
                    <label>Customer</label>
                    <div>{order.customer_name}</div>
                  </div>
                  <div className="info-item">
                    <label>Payment Method</label>
                    <div>{order.payment_method} — <span style={{fontSize: '12px'}}>{order.payment_status || 'N/A'}</span></div>
                  </div>
                  <div className="info-item">
                    <label>Order Type</label>
                    <div>{order.order_type}</div>
                  </div>
                  {order.order_type === 'Dine-in' && (
                    <div className="info-item">
                      <label>Table Number</label>
                      <div>{order.table_number}</div>
                    </div>
                  )}
                  {order.order_type === 'Delivery' && (
                    <>
                      <div className="info-item">
                        <label>Contact Number</label>
                        <div>{order.contact_number}</div>
                      </div>
                      <div className="info-item">
                        <label>Delivery Address</label>
                        <div>{order.address}</div>
                      </div>
                      <div className="info-item">
                        <label>Landmark</label>
                        <div>{order.landmark}</div>
                      </div>
                    </>
                  )}
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="order-items">
                    <h3>Order Items</h3>
                    {order.order_items.map(it => (
                      <div key={it.id} className="item-row">
                        <span>{it.products?.name} × {it.quantity}</span>
                        <span>{formatCurrencyPHP(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(orderLogs.length > 0 || order.status !== 'Pending') && (
                  <div className="timeline">
                    <h3>Order Timeline</h3>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-action">Order Placed</div>
                        <div className="timeline-time">{new Date(order.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    {orderLogs.map((log, idx) => (
                      <div key={idx} className={`timeline-item ${log.new_status === 'Cancelled' ? 'cancelled' : ''}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div className="timeline-action">
                            {log.new_status === 'Cancelled' ? 'Order Cancelled' : `${log.old_status} → ${log.new_status}`}
                          </div>
                          <div className="timeline-time">{log.changed_at ? new Date(log.changed_at).toLocaleString() : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(['Pending', 'Preparing'].includes(order.status) || order.payment_status === 'Rejected') && (
                  <div className="action-buttons">
                    <button className="btn-cancel" onClick={() => setShowCancel(true)}>
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {showCancel && (
            <div className="modal-overlay" onClick={() => setShowCancel(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>Cancel Order #{order?.order_number}</h3>
                <p>We'd like to know why you're cancelling. Please provide a reason:</p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you'd like to cancel this order..."
                />
                <div className="modal-actions">
                  <button className="modal-btn modal-btn-close" onClick={() => setShowCancel(false)}>
                    Keep Order
                  </button>
                  <button
                    className="modal-btn modal-btn-submit"
                    onClick={handleCancelSubmit}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
