import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Package, Users, ShoppingCart, Tag, Ticket, Settings, LogOut, Menu, X, Store, ChevronRight, Star, MessageSquare, Shield, Bell, Zap, Image, Percent, BarChart2 } from 'lucide-react';
import axios from 'axios';
import { logout } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Produits', path: '/admin/products', icon: Package },
  { name: 'Stock', path: '/admin/stock', icon: BarChart2 },
  { name: 'Commandes', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Utilisateurs', path: '/admin/users', icon: Users },
  { name: 'Catégories', path: '/admin/categories', icon: Tag },
  { name: 'Bannières', path: '/admin/banners', icon: Image },
  { name: 'Promotions', path: '/admin/promotions', icon: Percent },
  { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { name: 'Avis Clients', path: '/admin/reviews', icon: Star },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Journaux', path: '/admin/logs', icon: Shield },
  { name: 'Paramètres', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/system/notifications', config);
      setNotifications(data.slice(0, 20));
    } catch {}
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user || user.role !== 'admin') return null;

  const isActive = (item) => item.exact ? pathname === item.path : pathname.startsWith(item.path);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue/5 via-gaming-purple/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-gaming-blue via-gaming-purple to-transparent opacity-50" />
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gaming-cyan/10 rounded-xl blur-md group-hover:bg-gaming-cyan/20 transition-colors" />
              <img
                src="/ady-logo.png"
                alt="ADY Store"
                className="relative h-9 w-auto object-contain rounded-xl drop-shadow-[0_0_8px_rgba(0,240,255,0.35)]"
              />
            </div>
            <div>
              <span className="block font-orbitron text-xl font-black tracking-tight text-white text-glow-blue leading-none group-hover:text-gaming-cyan transition-colors">ADY</span>
              <span className="block text-[9px] font-bold tracking-[0.3em] text-gaming-purple leading-none mt-1 uppercase">Admin Panel</span>
            </div>
          </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="text-[9px] font-orbitron font-black text-gray-600 uppercase tracking-[0.3em] px-3 mb-4 flex items-center gap-2">
          <span className="flex-1 h-px bg-white/5" />
          Navigation
          <span className="flex-1 h-px bg-white/5" />
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'text-black font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-gaming-cyan to-gaming-blue rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-black' : 'group-hover:text-gaming-cyan transition-colors'}`} />
              <span className={`text-sm font-medium ${active ? 'font-black' : ''}`}>{item.name}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-black" />}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-white/5 flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple/40 to-gaming-blue/40 flex items-center justify-center font-orbitron font-black text-white text-sm border border-gaming-purple/30 shadow-[0_0_10px_rgba(176,38,255,0.2)]">
            {user.nom?.[0]}{user.prenom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.prenom} {user.nom}</p>
            <p className="text-[10px] text-gaming-cyan truncate">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gaming-bg overflow-hidden text-gaming-light font-sans selection:bg-gaming-blue selection:text-black">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gaming-surface border-r border-white/5 flex-col hidden md:flex flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-gaming-surface border-r border-white/10 flex flex-col z-50 md:hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                <span className="hover:text-white transition-colors cursor-default">Admin</span>
                <ChevronRight className="w-3 h-3" />
              </div>
              <h2 className="font-orbitron text-sm font-black tracking-widest text-white uppercase">
                {navItems.find(n => isActive(n))?.name || 'Admin Portal'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden sm:flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-white/20">
              <Store className="w-3.5 h-3.5" />
              <span className="font-medium">Boutique</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifications(); }}
                className="relative p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/10"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gaming-purple text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(176,38,255,0.8)]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 glass-premium border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h3 className="font-orbitron font-bold text-sm text-white uppercase tracking-widest">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] text-gaming-purple font-bold bg-gaming-purple/10 px-2 py-0.5 rounded-full">{unreadCount} non lue(s)</span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto scrollbar-hide">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-gray-500 text-sm">
                          <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
                          Aucune notification
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n._id}
                            className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-gaming-purple/5' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-gaming-purple mt-1.5 shrink-0 animate-pulse" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white">{n.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <Link
                        to="/admin/messages"
                        onClick={() => setNotifOpen(false)}
                        className="block text-center text-xs text-gaming-cyan hover:text-gaming-blue transition-colors font-bold uppercase tracking-widest"
                      >
                        Voir tous les messages →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple/40 to-gaming-blue/40 flex items-center justify-center font-orbitron font-black text-white text-sm border border-gaming-purple/30 shadow-[0_0_10px_rgba(176,38,255,0.2)]">
              {user.nom?.[0]}{user.prenom?.[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 gaming-grid-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
