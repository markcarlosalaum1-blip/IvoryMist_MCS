import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/landing/Navbar';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Home = lazy(() => import('./pages/customer/Home'));
const Menu = lazy(() => import('./pages/customer/Menu'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const TrackOrder = lazy(() => import('./pages/customer/TrackOrder'));
const About = lazy(() => import('./pages/customer/About'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ProductManagementPage = lazy(() => import('./pages/admin/ProductManagementPage'));
const StaffManagementPage = lazy(() => import('./pages/admin/StaffManagementPage'));
const DeliveryOrders = lazy(() => import('./pages/admin/DeliveryOrders'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
// import Navbar from './components/common/Navbar'; // HeroSection includes Navbar

// Loading fallback component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <div style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</div>
  </div>
);

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const CustomerRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (user && ['admin', 'staff'].includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'staff') return <Navigate to="/staff" />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

              :root { 
                --bg-root: #050816; 
                --bg-panel: #1E1B4B; 
                --neon-purple: #A855F7;
                --neon-blue: #3B82F6;
                --neon-cyan: #22D3EE;
                --neon-pink: #D946EF;
              }

              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              .container {
                max-width: 1200px;
                margin: 24px auto;
                padding: 0 20px;
                box-sizing: border-box;
              }

              body { 
                background: 
                  radial-gradient(ellipse 1200px 800px at 20% 30%, rgba(168,85,247,0.08) 0%, transparent 50%),
                  radial-gradient(ellipse 1400px 900px at 80% 70%, rgba(34,211,238,0.06) 0%, transparent 50%),
                  linear-gradient(135deg, #050816 0%, #0A1026 20%, #1E1B4B 40%, #071B34 60%, #0A1026 80%, #050816 100%);
                color: rgba(255,255,255,0.95); 
                font-family: 'Sora', 'Poppins', sans-serif;
                min-height: 100vh;
                background-attachment: fixed;
              }

              body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                  radial-gradient(circle at 50% 0%, rgba(168,85,247,0.05) 0%, transparent 40%),
                  radial-gradient(circle at 0% 50%, rgba(34,211,238,0.03) 0%, transparent 50%),
                  radial-gradient(circle at 100% 100%, rgba(217,70,239,0.04) 0%, transparent 50%);
                pointer-events: none;
                z-index: 0;
              }

              #root {
                position: relative;
                z-index: 1;
              }

              .btn-primary { 
                padding: 10px 16px; 
                background: linear-gradient(135deg, #A855F7, #3B82F6); 
                border-radius: 10px; 
                border: 1.5px solid rgba(168,85,247,0.4);
                color: #FFFFFF; 
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 6px 20px rgba(168,85,247,0.25);
              }

              .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(168,85,247,0.4), 0 0 25px rgba(34,211,238,0.2);
              }

              .btn-danger { 
                padding: 10px 16px; 
                background: rgba(217,70,239,0.12); 
                border-radius: 10px; 
                border: 1.5px solid rgba(217,70,239,0.3); 
                color: #D946EF;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              }

              .btn-danger:hover {
                background: rgba(217,70,239,0.2);
                border-color: rgba(217,70,239,0.6);
                box-shadow: 0 6px 20px rgba(217,70,239,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
              }
            `}</style>
            {/* Navbar shows on all pages */}
            <Navbar />
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<CustomerRoute><div className="container"><Menu /></div></CustomerRoute>} />
                <Route path="/about" element={<CustomerRoute><div className="container"><About /></div></CustomerRoute>} />
                <Route path="/cart" element={<CustomerRoute><div className="container"><Cart /></div></CustomerRoute>} />
                <Route path="/checkout" element={<CustomerRoute><div className="container"><Checkout /></div></CustomerRoute>} />
                <Route path="/track" element={<CustomerRoute><div className="container"><TrackOrder /></div></CustomerRoute>} />
                <Route path="/track/:orderNumber" element={<CustomerRoute><div className="container"><TrackOrder /></div></CustomerRoute>} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />

                {/* Admin Routes - no container */}
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><ProductManagementPage /></ProtectedRoute>} />
                <Route path="/admin/staff" element={<ProtectedRoute roles={['admin']}><StaffManagementPage /></ProtectedRoute>} />
                <Route path="/admin/deliveries" element={<ProtectedRoute roles={['admin']}><DeliveryOrders /></ProtectedRoute>} />

                {/* Staff Routes - no container */}
                <Route path="/staff/*" element={<ProtectedRoute roles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
              </Routes>
            </Suspense>
            <Toaster position="top-right" />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;