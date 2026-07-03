import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Providers & Global Components
import SocketProvider from './components/SocketProvider';
import CompareBar from './components/CompareBar';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './pages/admin/AdminLayout';

// Client Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Compare from './pages/Compare';

// Admin Pages
import DashboardOverview from './pages/admin/DashboardOverview';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import CategoryManager from './pages/admin/CategoryManager';
import BannerManager from './pages/admin/BannerManager';
import PromotionManager from './pages/admin/PromotionManager';
import CouponManager from './pages/admin/CouponManager';
import ReviewManager from './pages/admin/ReviewManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import SecurityLogs from './pages/admin/SecurityLogs';
import StockManager from './pages/admin/StockManager';

const ClientLayout = () => (
  <div className="min-h-screen flex flex-col bg-gaming-bg text-gaming-light font-sans selection:bg-gaming-purple selection:text-white">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    {/* Floating compare bar — visible on all pages */}
    <CompareBar />
  </div>
);


function App() {
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        const root = document.documentElement;
        if (data.primaryColor) root.style.setProperty('--color-primary', data.primaryColor);
        if (data.secondaryColor) root.style.setProperty('--color-secondary', data.secondaryColor);
        if (data.bgColor) root.style.setProperty('--color-bg', data.bgColor);
        if (data.textColor) root.style.setProperty('--color-text', data.textColor);
        if (data.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.favicon;
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <Router>
      <SocketProvider>
        <Routes>
          {/* Client Routes */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/compare" element={<Compare />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="promotions" element={<PromotionManager />} />
            <Route path="coupons" element={<CouponManager />} />
            <Route path="reviews" element={<ReviewManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="logs" element={<SecurityLogs />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="stock" element={<StockManager />} />
          </Route>
        </Routes>

        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
          toastStyle={{
            background: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff'
          }}
        />
      </SocketProvider>
    </Router>
  );

}

export default App;
