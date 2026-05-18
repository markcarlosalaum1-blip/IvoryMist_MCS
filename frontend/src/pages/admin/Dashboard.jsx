import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
import StaffManagement from '../../components/admin/StaffManagement';
import formatCurrencyPHP from '../../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0 });
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', image_url: '', imageFile: null, status: 'available', id: null });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes, ordersRes] = await Promise.all([
          API.get('/reports/sales'),
          API.get('/products'),
          API.get('/orders')
        ]);
        // Use sales report for totalSales
        const totalSales = (salesRes.data && salesRes.data.totalSales) ? salesRes.data.totalSales : 0;
        // Use pagination total from /orders for the true all-time order count
        const orderCount = (ordersRes.data && ordersRes.data.pagination) ? ordersRes.data.pagination.total : 0;
        setStats({ totalSales, orderCount });
        setProducts(productsRes.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      return setProductForm({ ...productForm, imageFile: files[0] });
    }
    setProductForm({ ...productForm, [name]: value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = productForm.image_url;

      // If a new image file is provided, upload it first
      if (productForm.imageFile) {
        const formData = new FormData();
        formData.append('image', productForm.imageFile);
        if (editing && productForm.id) formData.append('id', productForm.id);
        const uploadRes = await API.post('/products/upload', formData);
        imageUrl = uploadRes.data.image_url || uploadRes.data.publicUrl || uploadRes.data.image_url;
      }

      // Build payload and only include numeric fields when valid
      const payload = {
        name: productForm.name,
        description: productForm.description || '',
        image_url: imageUrl,
        status: productForm.status,
      };

      const parsedPrice = Number(productForm.price);
      if (!Number.isNaN(parsedPrice) && productForm.price !== '') payload.price = parsedPrice;

      const parsedStock = Number(productForm.stock);
      if (!Number.isNaN(parsedStock) && productForm.stock !== '') payload.stock = parsedStock;

      if (editing) {
        const res = await API.put(`/products/${productForm.id}`, payload);
        setProducts((p) => p.map((it) => (it.id === res.data.id ? res.data : it)));
        toast.success('Product updated');
      } else {
        const res = await API.post('/products', payload);
        setProducts((p) => [res.data, ...p]);
        toast.success('Product created');
      }

      setProductForm({ name: '', description: '', price: '', stock: '', image_url: '', status: 'available', id: null });
      setEditing(false);
    } catch (err) {
      console.error('Save product failed', err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({ name: product.name, description: product.description || '', price: product.price || '', stock: product.stock || 0, image_url: product.image_url || '', status: product.status || 'available', id: product.id });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts((p) => p.filter((it) => it.id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #2e1065 100%);
          display: flex;
          width: 100%;
        }

        .admin-sidebar {
          width: 280px;
          background: rgba(15, 64, 48, 0.8);
          backdrop-filter: blur(10px);
          border-right: 1.5px solid rgba(0, 212, 255, 0.2);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
        }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .admin-sidebar-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #00d4ff;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .admin-sidebar-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 600;
          margin: 20px 0 16px;
          padding-left: 12px;
          border-left: 2px solid rgba(0, 212, 255, 0.3);
        }

        .admin-nav-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-nav-item {
          padding: 16px 18px;
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 0.02em;
        }

        .admin-nav-item:hover {
          background: rgba(0, 212, 255, 0.08);
          border-color: rgba(0, 212, 255, 0.3);
          color: rgba(255,255,255,0.85);
        }

        .admin-nav-item.active {
          background: rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.6);
          color: #00d4ff;
          box-shadow: inset 0 0 16px rgba(0, 212, 255, 0.1);
        }

        .admin-nav-icon {
          font-size: 18px;
        }

        .admin-content {
          flex: 1;
          margin-left: 280px;
          padding: 24px 16px;
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
          width: auto;
          box-sizing: border-box;
          max-width: none;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .admin-section {
          display: none;
        }

        .admin-section.active {
          display: block;
        }

        .admin-dashboard {
          min-height: 100vh;
          background: transparent;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.92);
          width: 100%;
          max-width: 100%;
        }

        .dashboard-header {
          margin-bottom: 28px;
        }

        .dashboard-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #00d4ff;
          letter-spacing: -0.5px;
          margin: 0 0 12px;
        }

        .dashboard-header p {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.02em;
          margin: 0;
          font-weight: 300;
        }

        .dashboard-nav {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 28px;
          gap: 24px;
        }

        .btn-delivery {
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          border: none;
          border-radius: 14px;
          padding: 14px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
        }

        .btn-delivery:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 12px 48px rgba(0, 212, 255, 0.2);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background-color: rgba(0, 212, 255, 0.05);
          border-radius: 50%;
          pointer-events: none;
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0, 212, 255, 0.7);
          margin: 0 0 12px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #00d4ff;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .admin-section-content {
          margin-bottom: 28px;
        }

        .admin-section-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #00d4ff;
          letter-spacing: -0.3px;
          margin: 0 0 12px;
        }

        .admin-section-content p {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          margin: 0 0 32px;
          font-weight: 300;
        }

        .product-form {
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }

        .product-form:hover {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .product-form h3 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #00d4ff;
          margin: 0 0 28px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .form-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0, 212, 255, 0.85);
        }

        .form-input,
        .form-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.92);
          outline: none;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: rgba(0, 212, 255, 0.6);
          background: rgba(0, 212, 255, 0.1);
          box-shadow: 0 0 16px rgba(0, 212, 255, 0.25);
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .form-select {
          appearance: none;
          background-color: rgba(0, 212, 255, 0.08) !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300d4ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 18px;
          padding-right: 40px;
        }

        .form-select option {
          background-color: #312e81;
          color: rgba(255, 255, 255, 0.92);
        }

        .form-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 28px;
        }

        .btn-submit,
        .btn-cancel {
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .btn-submit {
          background: linear-gradient(135deg, #00d4ff 0%, #10b981 100%);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
        }

        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
        }

        .btn-cancel {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.5);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border-radius: 20px;
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          background: rgba(15, 64, 48, 0.6);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .admin-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
        }

        .admin-table thead {
          background: rgba(0, 212, 255, 0.08);
          border-bottom: 1.5px solid rgba(0, 212, 255, 0.2);
        }

        .admin-table th {
          padding: 18px 16px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00d4ff;
          text-align: left;
        }

        .admin-table td {
          padding: 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        }

        .admin-table tbody tr:hover {
          background: rgba(0, 212, 255, 0.05);
        }

        .table-actions {
          display: flex;
          gap: 10px;
        }

        .btn-edit,
        .btn-delete {
          padding: 8px 14px;
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
        }

        .btn-edit {
          color: #00d4ff;
        }

        .btn-edit:hover {
          background: rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.6);
        }

        .btn-delete {
          color: #ff6b6b;
          border-color: rgba(255,107,107,0.3);
        }

        .btn-delete:hover {
          background: rgba(255,107,107,0.15);
          border-color: rgba(255,107,107,0.6);
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: rgba(255,255,255,0.6);
          font-size: 15px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-sidebar {
            width: 240px;
            padding: 32px 16px;
          }

          .admin-content {
            margin-left: 240px;
            padding: 20px 14px;
          }
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: relative;
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1.5px solid rgba(0, 212, 255, 0.2);
            padding: 20px 16px;
            margin-bottom: 24px;
          }

          .admin-content {
            margin-left: 0;
            padding: 16px 12px;
          }

          .admin-dashboard-wrapper {
            flex-direction: column;
          }

          .dashboard-header h1 {
            font-size: 36px;
          }

          .dashboard-nav {
            justify-content: flex-start;
          }

          .admin-section-content h2 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 28px;
          }

          .form-wrapper {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-buttons {
            flex-direction: column;
          }

          .btn-submit,
          .btn-cancel {
            width: 100%;
          }

          .admin-nav-items {
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-nav-item {
            flex: 1;
            min-width: 120px;
            padding: 12px 16px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .admin-content {
            padding: 12px 8px;
          }

          .dashboard-header h1 {
            font-size: 28px;
          }

          .admin-section-content h2 {
            font-size: 20px;
          }

          .stat-card {
            padding: 24px;
          }

          .stat-label {
            font-size: 11px;
          }

          .stat-value {
            font-size: 24px;
          }

          .product-form {
            padding: 24px;
          }

          .admin-table {
            font-size: 12px;
          }

          .admin-table th,
          .admin-table td {
            padding: 12px;
          }

          .admin-sidebar-title {
            font-size: 20px;
          }

          .admin-nav-item {
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
            <button 
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="admin-nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <span className="admin-nav-icon">📦</span>
              Products
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              <span className="admin-nav-icon">👥</span>
              Staff
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          <div className="admin-dashboard">
            {/* Dashboard Section */}
            <section className={`admin-section ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Manage your café operations and inventory</p>
              </div>

              <div className="dashboard-nav">
                <Link to="/admin/deliveries" className="btn-delivery">
                  🚚 Delivery Orders
                </Link>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Total Sales</p>
                    <p className="stat-value">{formatCurrencyPHP(stats.totalSales)}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Total Orders</p>
                    <p className="stat-value">{stats.orderCount}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <p className="stat-label">Total Products</p>
                    <p className="stat-value">{products.length}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Management Section */}
            <section className={`admin-section ${activeTab === 'products' ? 'active' : ''}`}>
              <div className="admin-section-content">
                <h2>Product Management</h2>
                <p>Add, edit, and manage your product inventory</p>

                <form className="product-form" onSubmit={handleProductSubmit}>
                  <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="form-wrapper">
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input 
                        type="text"
                        name="name" 
                        placeholder="Enter name" 
                        value={productForm.name} 
                        onChange={handleProductChange} 
                        className="form-input"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input 
                        type="number"
                        name="price" 
                        placeholder="0.00" 
                        value={productForm.price} 
                        onChange={handleProductChange}
                        step="0.01"
                        className="form-input"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input 
                        type="number"
                        name="stock" 
                        placeholder="0" 
                        value={productForm.stock} 
                        onChange={handleProductChange}
                        className="form-input"
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select 
                        name="status" 
                        value={productForm.status} 
                        onChange={handleProductChange}
                        className="form-select"
                      >
                        <option value="available">Available</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image</label>
                      <input 
                        type="file" 
                        name="imageFile" 
                        accept="image/*" 
                        onChange={handleProductChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <input 
                        type="text"
                        name="description" 
                        placeholder="Enter description" 
                        value={productForm.description} 
                        onChange={handleProductChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-buttons">
                    {editing && (
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => { 
                          setEditing(false); 
                          setProductForm({ name: '', description: '', price: '', stock: '', image_url: '', imageFile: null, status: 'available', id: null }); 
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn-submit">
                      {editing ? '✏️ Update Product' : '➕ Create Product'}
                    </button>
                  </div>
                </form>

                {products.length > 0 ? (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{formatCurrencyPHP(product.price)}</td>
                            <td>{product.stock}</td>
                            <td style={{color: product.status === 'available' ? '#51cf66' : '#ff6b6b'}}>{product.status}</td>
                            <td>
                              <div className="table-actions">
                                <button 
                                  className="btn-edit"
                                  onClick={() => handleEditProduct(product)}
                                  type="button"
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn-delete"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  type="button"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    No products yet. Add one to get started!
                  </div>
                )}
              </div>
            </section>

            {/* Staff Management Section */}
            <section className={`admin-section ${activeTab === 'staff' ? 'active' : ''}`}>
              <StaffManagement />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
