import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';
import { clearWishlist } from '../../store/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-pink opacity-50" />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gaming-blue/10 rounded-xl blur-md group-hover:bg-gaming-blue/20 transition-colors" />
              <img
                src="/ady-logo.png"
                alt="ADY Store"
                className="relative h-9 w-auto object-contain rounded-xl drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
              />
            </div>
            <span className="font-orbitron text-xl font-black tracking-widest text-white group-hover:text-gaming-cyan transition-colors leading-none">
              ADY <span className="text-gaming-cyan">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            {[
              { name: 'Accueil', path: '/' },
              { name: 'Boutique', path: '/products' },
              { name: 'Nouveautés', path: '/products?featured=true' },
              { name: 'Favoris', path: '/wishlist' }
            ].map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname + location.search === item.path || location.pathname.startsWith(item.path.split('?')[0]) && item.path !== '/';
                
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`relative group px-1 py-2 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors font-orbitron tracking-wide uppercase text-[11px] font-bold`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gaming-cyan transition-all duration-300 ${isActive ? 'w-full shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-full opacity-0 group-focus-within:opacity-20 blur-md transition-opacity duration-500" />
              <input
                type="text"
                placeholder="Rechercher des équipements premium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gaming-blue/50 focus:bg-black/50 transition-all duration-300 placeholder-gray-500 relative z-10"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gaming-cyan transition-colors z-20" />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors group">
              <Heart className="w-5 h-5 text-gray-300 group-hover:text-gaming-pink transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute 0 right-0 top-0 bg-gaming-pink shadow-[0_0_10px_rgba(255,0,127,0.8)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors group">
              <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-gaming-cyan transition-colors" />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 top-0 bg-gaming-blue shadow-[0_0_10px_rgba(0,240,255,0.8)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block w-px h-6 bg-white/10 mx-2" />

            {/* User */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-gaming-purple/50 transition-all duration-300 text-sm group"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-blue flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                    {user.nom?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[100px] truncate text-gray-200 group-hover:text-white">{user.prenom}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-gaming-purple' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                      className="absolute right-0 mt-3 w-64 glass-premium rounded-2xl border border-white/10 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                        <div className="font-bold text-sm text-white mb-1">{user.nom} {user.prenom}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      </div>
                      <div className="p-2 space-y-1">
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gaming-purple hover:bg-gaming-purple/10 rounded-xl transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                          <User className="w-4 h-4" /> Mon profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Se déconnecter
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex relative group overflow-hidden bg-gaming-purple text-white px-6 py-2 rounded-full transition-all duration-300 text-sm font-bold shadow-[0_0_15px_rgba(176,38,255,0.4)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue to-gaming-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <User className="w-4 h-4" /> Connexion
                </span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gaming-blue" 
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </form>

              <div className="flex flex-col space-y-1">
                {[
                  { name: 'Accueil', path: '/' },
                  { name: 'Boutique', path: '/products' },
                  { name: 'Nouveautés', path: '/products?featured=true' },
                  { name: 'Favoris', path: '/wishlist' }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-orbitron"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/10 my-4" />

              {user ? (
                <div className="space-y-1">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gaming-purple/20 flex items-center justify-center text-gaming-purple font-bold border border-gaming-purple/30">
                      {user.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white">{user.prenom} {user.nom}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-gaming-purple font-medium hover:bg-gaming-purple/10 transition-colors">
                      Dashboard Admin
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    Mon profil
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <Link to="/login" className="block w-full bg-gradient-to-r from-gaming-blue to-gaming-purple text-white text-center py-3.5 rounded-xl font-bold shadow-lg mt-4">
                  Connexion / Inscription
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
