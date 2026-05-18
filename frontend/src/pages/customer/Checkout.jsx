import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import formatCurrencyPHP from '../../utils/currency';

const DELIVERY_FEE = 35; // Fixed delivery fee in PHP

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useContext(CartContext);
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('Pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Customer Name validation
    if (!customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    } else if (customerName.trim().length < 2) {
      newErrors.customerName = 'Full name must be at least 2 characters';
    } else if (customerName.trim().length > 100) {
      newErrors.customerName = 'Full name must not exceed 100 characters';
    }

    // Table Number validation (for Dine-in)
    if (orderType === 'Dine-in') {
      if (!tableNumber.trim()) {
        newErrors.tableNumber = 'Table number is required';
      } else if (tableNumber.trim().length < 1) {
        newErrors.tableNumber = 'Table number is required';
      }
    }

    // Delivery validations
    if (orderType === 'Delivery') {
      // Contact Number validation (exactly 11 digits, numbers only)
      if (!contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!/^\d{11}$/.test(contactNumber.trim())) {
        newErrors.contactNumber = 'Contact number must be exactly 11 digits';
      }

      // Address validation
      if (!address.trim()) {
        newErrors.address = 'Delivery address is required';
      } else if (address.trim().length < 5) {
        newErrors.address = 'Address must be at least 5 characters';
      } else if (address.trim().length > 200) {
        newErrors.address = 'Address must not exceed 200 characters';
      }

      // Landmark validation
      if (!landmark.trim()) {
        newErrors.landmark = 'Landmark/Notes is required';
      } else if (landmark.trim().length < 3) {
        newErrors.landmark = 'Landmark must be at least 3 characters';
      } else if (landmark.trim().length > 100) {
        newErrors.landmark = 'Landmark must not exceed 100 characters';
      }
    }

    // Payment validations
    if (paymentMethod === 'GCash' || paymentMethod === 'Maya' || paymentMethod === 'Card') {
      if (!paymentReference.trim()) {
        newErrors.paymentReference = 'Reference number is required';
      } else if (paymentReference.trim().length < 5) {
        newErrors.paymentReference = 'Reference number must be at least 5 characters';
      }

      if (!paymentProofFile) {
        newErrors.paymentProofFile = 'Payment proof image is required';
      } else if (!paymentProofFile.type.startsWith('image/')) {
        newErrors.paymentProofFile = 'Payment proof must be an image file';
      } else if (paymentProofFile.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.paymentProofFile = 'Payment proof must be less than 5MB';
      }
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Calculate total with delivery fee
  const calculateTotal = () => {
    let total = totalAmount;
    if (orderType === 'Delivery') {
      total += DELIVERY_FEE;
    }
    return total;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (cart.length === 0) return;

      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Use FormData if there's a file or to support multipart fields
      const formData = new FormData();
      formData.append('customer_name', customerName.trim());
      formData.append('items', JSON.stringify(items));
      formData.append('total_amount', calculateTotal());
      formData.append('payment_method', paymentMethod);
      formData.append('order_type', orderType);
      formData.append('delivery_fee', orderType === 'Delivery' ? DELIVERY_FEE : 0);
      if (orderType === 'Dine-in') formData.append('table_number', tableNumber.trim());
      if (orderType === 'Delivery') {
        formData.append('address', address.trim());
        formData.append('landmark', landmark.trim());
        formData.append('contact_number', contactNumber.trim());
        formData.append('notes', notes.trim());
      }
      if (paymentReference) formData.append('payment_reference', paymentReference.trim());
      if (paymentProofFile) formData.append('payment_proof', paymentProofFile);

      const res = await API.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const createdOrder = res.data;
      toast.success('Order placed successfully!');
      clearCart();
      // Navigate to track page with order number
      if (createdOrder && createdOrder.order_number) {
        navigate(`/track/${createdOrder.order_number}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      // Check for stock validation errors
      if (err.response?.data?.out_of_stock?.length > 0) {
        const outOfStock = err.response.data.out_of_stock;
        const names = outOfStock.map(o => o.name || o.product_id).join(', ');
        toast.error(`Out of stock: ${names}`);
      } else if (err.response?.data?.insufficient_stock?.length > 0) {
        const insufficient = err.response.data.insufficient_stock;
        const messages = insufficient.map(i => `${i.name}: ${i.message}`).join(', ');
        toast.error(`Insufficient stock: ${messages}`);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.message) {
        toast.error(`Failed to place order: ${err.message}`);
      } else {
        toast.error('Failed to place order');
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .checkout-container {
          min-height: calc(100vh - 72px);
          padding: 60px 40px;
          background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #2e1065 100%);
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
        }

        .checkout-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .checkout-header {
          margin-bottom: 50px;
          text-align: left;
        }

        .checkout-header h1 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 48px;
          margin: 0 0 12px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .checkout-header p {
          color: rgba(255,255,255,0.65);
          font-size: 16px;
          margin: 0;
          font-weight: 300;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 12px 48px rgba(0, 212, 255, 0.2);
        }

        .card h2 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 24px;
          margin: 0 0 28px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          font-size: 12px;
          color: rgba(0, 212, 255, 0.85);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .form-group label .required {
          color: #ff6b6b;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.92);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: rgba(0, 212, 255, 0.6);
          background: rgba(0, 212, 255, 0.1);
          box-shadow: 0 0 16px rgba(0, 212, 255, 0.25);
        }

        .form-group input.input-error,
        .form-group select.input-error,
        .form-group textarea.input-error {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.08);
        }

        .form-group input.input-error:focus,
        .form-group select.input-error:focus,
        .form-group textarea.input-error:focus {
          border-color: #ff6b6b;
          box-shadow: 0 0 16px rgba(255, 107, 107, 0.25);
        }

        .error-message {
          font-size: 12px;
          color: #ff6b6b;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .form-group select {
          appearance: none;
          background-color: rgba(0, 212, 255, 0.15) !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300d4ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 18px;
          padding-right: 40px;
        }

        .form-group select option {
          background-color: #312e81;
          color: rgba(255, 255, 255, 0.92);
        }

        .form-group textarea {
          min-height: 90px;
          resize: vertical;
          font-size: 13px;
        }

        .nested-fields {
          margin-top: 4px;
          animation: slideDown 0.25s ease-out;
        }

        .nested-fields .form-group {
          margin-bottom: 16px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-summary {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 100px;
          transition: all 0.3s ease;
        }

        .order-summary:hover {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 12px 48px rgba(0, 212, 255, 0.2);
        }

        .order-summary h3 {
          font-family: 'Playfair Display', serif;
          color: #00d4ff;
          font-size: 24px;
          margin: 0 0 28px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-bottom: 20px;
          border-bottom: 1.5px solid rgba(0, 212, 255, 0.2);
          margin-bottom: 20px;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
        }

        .item-name {
          flex: 1;
        }

        .item-price {
          color: #00d4ff;
          font-weight: 600;
          min-width: 80px;
          text-align: right;
        }

        .summary-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .summary-row.subtotal {
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.15);
        }

        .summary-row.total {
          font-size: 18px;
          font-weight: 700;
          color: #00d4ff;
          padding-top: 8px;
          margin-top: 4px;
        }

        .delivery-note {
          font-size: 12px;
          color: rgba(0, 212, 255, 0.6);
          font-style: italic;
          margin-top: 4px;
        }

        .btn-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 32px;
        }

        .btn-primary {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .order-summary {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .checkout-container {
            padding: 40px 24px;
          }

          .checkout-header h1 {
            font-size: 36px;
          }

          .checkout-header p {
            font-size: 14px;
          }

          .checkout-grid {
            gap: 24px;
          }

          .card,
          .order-summary {
            padding: 24px;
          }

          .card h2,
          .order-summary h3 {
            font-size: 20px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 14px;
          }

          .items-list {
            gap: 10px;
          }

          .btn-primary {
            padding: 16px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .checkout-container {
            padding: 32px 16px;
          }

          .checkout-header h1 {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .checkout-header p {
            font-size: 13px;
          }

          .card,
          .order-summary {
            padding: 20px;
            border-radius: 16px;
          }

          .form-group label {
            font-size: 11px;
          }

          .form-group input,
          .form-group select {
            padding: 12px 14px;
            font-size: 13px;
          }

          .item-row {
            font-size: 13px;
          }

          .summary-row {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <p>Complete your order in just a few steps</p>
          </div>

          <div className="checkout-grid">
            <div className="form-container">
              <form onSubmit={handleCheckout}>
                {/* Order Details Card */}
                <div className="card">
                  <h2>Order Details</h2>

                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={() => handleBlur('customerName')}
                      placeholder="Your full name"
                      className={touched.customerName && errors.customerName ? 'input-error' : ''}
                    />
                    {touched.customerName && errors.customerName && (
                      <div className="error-message">❌ {errors.customerName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Order Type <span className="required">*</span></label>
                    <select 
                      value={orderType} 
                      onChange={(e) => setOrderType(e.target.value)}
                      required
                    >
                      <option value="Pickup">Pickup at Store</option>
                      <option value="Dine-in">Dine-in</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>

                  {/* Dine-in Fields */}
                  {orderType === 'Dine-in' && (
                    <div className="nested-fields">
                      <div className="form-group">
                        <label>Table Number <span className="required">*</span></label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          onBlur={() => handleBlur('tableNumber')}
                          placeholder="e.g., Table 5"
                          className={touched.tableNumber && errors.tableNumber ? 'input-error' : ''}
                        />
                        {touched.tableNumber && errors.tableNumber && (
                          <div className="error-message">❌ {errors.tableNumber}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Fields */}
                  {orderType === 'Delivery' && (
                    <div className="nested-fields">
                      <div className="form-group">
                        <label>Contact Number <span className="required">*</span></label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength="11"
                          value={contactNumber}
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setContactNumber(value);
                          }}
                          onBlur={() => handleBlur('contactNumber')}
                          placeholder="Your phone number"
                          className={touched.contactNumber && errors.contactNumber ? 'input-error' : ''}
                        />
                        {touched.contactNumber && errors.contactNumber && (
                          <div className="error-message">❌ {errors.contactNumber}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Delivery Address <span className="required">*</span></label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          onBlur={() => handleBlur('address')}
                          placeholder="Full delivery address"
                          className={touched.address && errors.address ? 'input-error' : ''}
                        />
                        {touched.address && errors.address && (
                          <div className="error-message">❌ {errors.address}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Landmark / Notes <span className="required">*</span></label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          onBlur={() => handleBlur('landmark')}
                          placeholder="Nearby landmark"
                          className={touched.landmark && errors.landmark ? 'input-error' : ''}
                        />
                        {touched.landmark && errors.landmark && (
                          <div className="error-message">❌ {errors.landmark}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Additional Instructions</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          onBlur={() => handleBlur('notes')}
                          placeholder="Any special requests or instructions..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method Card */}
                <div className="card">
                  <h2>Payment Method</h2>

                  <div className="form-group">
                    <label>Payment Type <span className="required">*</span></label>
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="GCash">GCash</option>
                      <option value="Maya">Maya</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>

                  {/* Online Payment Fields */}
                  {(paymentMethod === 'GCash' || paymentMethod === 'Maya' || paymentMethod === 'Card') && (
                    <div className="nested-fields">
                      <div className="form-group">
                        <label>Reference Number <span className="required">*</span></label>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          onBlur={() => handleBlur('paymentReference')}
                          placeholder="Transaction reference"
                          className={touched.paymentReference && errors.paymentReference ? 'input-error' : ''}
                        />
                        {touched.paymentReference && errors.paymentReference && (
                          <div className="error-message">❌ {errors.paymentReference}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Payment Proof <span className="required">*</span></label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentProofFile(e.target.files[0])}
                          onBlur={() => handleBlur('paymentProofFile')}
                          className={touched.paymentProofFile && errors.paymentProofFile ? 'input-error' : ''}
                        />
                        {touched.paymentProofFile && errors.paymentProofFile && (
                          <div className="error-message">❌ {errors.paymentProofFile}</div>
                        )}
                        {paymentProofFile && (
                          <div style={{fontSize: '12px', color: 'rgba(0, 212, 255, 0.6)', marginTop: '4px'}}>
                            ✓ File selected: {paymentProofFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="btn-container">
                  <button type="submit" className="btn-primary">
                    Place Order
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Card */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              {cart.length > 0 ? (
                <>
                  <div className="items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="item-row">
                        <span className="item-name">{item.name} × {item.quantity}</span>
                        <span className="item-price">{formatCurrencyPHP(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-section">
                    <div className="summary-row subtotal">
                      <span>Subtotal</span>
                      <span>{formatCurrencyPHP(totalAmount)}</span>
                    </div>

                    {orderType === 'Delivery' && (
                      <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>{formatCurrencyPHP(DELIVERY_FEE)}</span>
                      </div>
                    )}

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>{formatCurrencyPHP(calculateTotal())}</span>
                    </div>
                  </div>

                  {orderType === 'Delivery' && (
                    <div className="delivery-note">
                      ✓ Includes ₱{DELIVERY_FEE} delivery fee
                    </div>
                  )}
                </>
              ) : (
                <p style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px 0'}}>
                  Your cart is empty
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
