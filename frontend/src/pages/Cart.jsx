import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromCart, updateQty, clearCart } from '../store/cartSlice';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, PackageCheck, Zap, Shield, Truck, ChevronRight, User } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.promotionalPrice || item.price) * item.qty, 0);
  const shippingCost = subtotal > 0 ? 500 : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center container mx-auto px-4 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gaming-blue/5 rounded-full blur-[150px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 glass-premium p-16 rounded-[3rem] border border-white/5 shadow-2xl max-w-2xl w-full"
        >
          <div className="relative inline-block mb-10">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gaming-blue/20 to-gaming-purple/20 border border-white/10 flex items-center justify-center mx-auto box-glow-blue relative z-10 backdrop-blur-md">
              <ShoppingCart className="w-20 h-20 text-gaming-cyan opacity-80" />
            </div>
            <div className="absolute inset-0 bg-gaming-blue/20 rounded-full blur-2xl animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-orbitron font-black uppercase text-white mb-4 tracking-tighter drop-shadow-lg">Panier Vide</h2>
          <p className="text-gray-400 mb-12 text-lg max-w-md mx-auto leading-relaxed">Découvrez nos équipements premium et ajoutez vos favoris au panier pour passer au niveau supérieur.</p>
          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center gap-3 bg-gaming-blue text-black font-orbitron font-black py-5 px-12 rounded-full overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-shadow duration-300 uppercase tracking-widest text-sm"
          >
            <div className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            <span className="relative z-10">Explorer la boutique</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-bg pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gaming-purple/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gaming-blue/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs font-orbitron font-bold tracking-[0.4em] text-gaming-cyan uppercase mb-2">Votre Sélection</p>
            <h1 className="text-5xl lg:text-6xl font-orbitron font-black uppercase tracking-tighter">
              <span className="text-white drop-shadow-lg">MON </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan via-gaming-blue to-gaming-purple text-glow-blue">PANIER</span>
            </h1>
            <p className="text-gray-400 mt-4 text-sm font-medium">{cartItems.reduce((a, i) => a + i.qty, 0)} article(s) dans votre panier</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(clearCart())}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 transition-all text-xs font-orbitron font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md"
          >
            <Trash2 className="w-4 h-4" /> Vider le panier
          </motion.button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Cart Items (Span 8) */}
          <div className="xl:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-premium rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center border border-white/5 hover:border-gaming-blue/30 transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-black/60"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item._id}`}
                    className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/5 group-hover:border-gaming-cyan/30 transition-colors flex items-center justify-center relative"
                  >
                    <div className="absolute inset-0 bg-gaming-blue/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    {item.images?.[0]?.url ? (
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10 filter drop-shadow-lg"
                      />
                    ) : (
                      <ShoppingCart className="w-10 h-10 text-gray-700 relative z-10" />
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow min-w-0 text-center sm:text-left w-full">
                    <div className="text-[10px] font-orbitron font-black tracking-[0.2em] text-gaming-cyan uppercase mb-2 inline-block px-3 py-1 rounded-full bg-gaming-cyan/10 border border-gaming-cyan/20">
                      {item.brand}
                    </div>
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-orbitron font-bold text-white hover:text-gaming-cyan transition-colors line-clamp-2 text-base md:text-lg mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-end justify-center sm:justify-start gap-3">
                      <div className="font-orbitron font-black text-gaming-pink text-xl drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
                        {(item.promotionalPrice || item.price).toLocaleString('fr-DZ')} <span className="text-xs font-bold">DZD</span>
                      </div>
                      {item.promotionalPrice && item.promotionalPrice < item.price && (
                        <div className="text-xs text-gray-500 line-through font-medium mb-1">{item.price.toLocaleString('fr-DZ')} DZD</div>
                      )}
                    </div>
                  </div>

                  {/* Controls container */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-full border border-white/10">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => item.qty > 1
                          ? dispatch(updateQty({ id: item._id, qty: item.qty - 1 }))
                          : dispatch(removeFromCart(item._id))
                        }
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </motion.button>
                      <div className="w-10 flex items-center justify-center font-orbitron font-bold text-gaming-cyan text-sm">
                        {item.qty}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(updateQty({ id: item._id, qty: item.qty + 1 }))}
                        disabled={item.qty >= item.countInStock}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gaming-blue/20 hover:text-gaming-cyan transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Line Total */}
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Ligne</p>
                        <p className="font-orbitron font-bold text-white text-sm">
                          {((item.promotionalPrice || item.price) * item.qty).toLocaleString('fr-DZ')} DZD
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-3 text-xs font-orbitron font-bold uppercase tracking-widest text-gray-400 hover:text-gaming-cyan transition-colors mt-8 group bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-gaming-cyan/30"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Continuer les achats
            </Link>
          </div>

          {/* Order Summary (Span 4) */}
          <div className="xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-premium rounded-[2rem] p-8 sticky top-28 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/80"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 relative">
                <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-gaming-cyan to-transparent" />
                <div className="w-12 h-12 rounded-xl bg-gaming-blue/10 border border-gaming-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <Zap className="w-6 h-6 text-gaming-cyan" />
                </div>
                <h2 className="text-xl font-orbitron font-black uppercase tracking-wider text-white">Résumé</h2>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Sous-total ({cartItems.reduce((a, i) => a + i.qty, 0)} articles)</span>
                  <span className="text-white font-orbitron font-bold">{subtotal.toLocaleString('fr-DZ')} DZD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Frais de livraison</span>
                  <span className="text-white font-orbitron font-bold">{shippingCost.toLocaleString('fr-DZ')} DZD</span>
                </div>
                <div className="border-t border-white/10 pt-6 mt-6 flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="font-orbitron font-bold uppercase tracking-widest text-sm text-gray-300">Total TTC</span>
                    <span className="font-orbitron font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan to-gaming-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                      {total.toLocaleString('fr-DZ')} <span className="text-base text-gaming-cyan">DZD</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* COD Badge */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-2xl p-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gaming-blue/20 flex items-center justify-center flex-shrink-0">
                  <PackageCheck className="w-5 h-5 text-gaming-cyan" />
                </div>
                <div>
                  <p className="text-xs font-orbitron font-bold text-white uppercase tracking-wider mb-1">Paiement à la livraison</p>
                  <p className="text-[10px] text-gray-400">Payez en espèces à la réception</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-between gap-2 mb-8 bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider text-center w-1/2 border-r border-white/10">
                  <Shield className="w-4 h-4 text-gaming-purple mb-1" /> Sécurisé
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider text-center w-1/2">
                  <Truck className="w-4 h-4 text-gaming-blue mb-1" /> Rapide
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                className="w-full group relative bg-gaming-blue text-black font-orbitron font-black py-5 rounded-xl overflow-hidden transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
              >
                <div className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                <span className="relative z-10 flex items-center gap-2">
                  {user ? (
                    <><ShoppingCart className="w-5 h-5" /> Valider la commande <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <><User className="w-5 h-5" /> Se connecter pour valider <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
