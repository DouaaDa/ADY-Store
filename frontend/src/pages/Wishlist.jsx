import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, HeartCrack } from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 relative overflow-hidden bg-gaming-bg">
        <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center relative z-10 glass-premium p-12 rounded-3xl border border-white/5 max-w-lg w-full"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-black/50 border border-red-500/30 rounded-full flex items-center justify-center">
              <HeartCrack className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white font-orbitron uppercase tracking-widest mb-3">Arsenal Vide</h2>
          <p className="text-gray-400 text-sm mb-8">Vous n'avez pas encore sélectionné d'équipement pour vos prochaines missions.</p>
          <Link to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/80 hover:to-gaming-blue/80 text-white font-orbitron font-black text-xs uppercase tracking-widest py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_30px_rgba(176,38,255,0.5)] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à la Base
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gaming-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500/20" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white font-orbitron uppercase tracking-widest">
                Favoris
              </h1>
              <p className="text-sm text-gray-400 mt-1">Équipements sauvegardés pour vos futures batailles</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
            <span className="text-xs font-orbitron font-bold text-gaming-cyan tracking-widest uppercase">
              {items.length} Article{items.length > 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-premium rounded-2xl overflow-hidden group flex flex-col border border-white/10 hover:border-gaming-purple/50 transition-colors"
              >
                <Link to={`/product/${product._id}`} className="relative h-56 overflow-hidden block bg-black">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">Sans image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Remove from wishlist button overlay */}
                  <button
                    onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product)); }}
                    className="absolute top-3 right-3 p-2.5 bg-black/50 hover:bg-red-500/90 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 hover:border-red-500 z-10 shadow-lg"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {!product.isAvailable && (
                    <div className="absolute top-3 left-3 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm backdrop-blur-md">
                      Rupture
                    </div>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/40">
                  <div className="text-gaming-purple text-[10px] font-bold uppercase tracking-widest mb-1.5">{product.brand}</div>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-sm text-white mb-3 group-hover:text-gaming-cyan transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-center gap-1.5 mb-4 mt-auto">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-white">{product.rating || "5.0"}</span>
                    <span className="text-[10px] text-gray-500">({product.numReviews || 0} avis)</span>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    {product.promotionalPrice ? (
                      <div>
                        <span className="text-[10px] text-gray-500 line-through decoration-red-500 block">{product.price?.toLocaleString('fr-DZ')} DA</span>
                        <span className="text-lg font-orbitron font-black text-gaming-purple">{product.promotionalPrice?.toLocaleString('fr-DZ')} <span className="text-[10px]">DA</span></span>
                      </div>
                    ) : (
                      <span className="text-lg font-orbitron font-black text-white">{product.price?.toLocaleString('fr-DZ')} <span className="text-[10px] text-gaming-cyan">DA</span></span>
                    )}
                  </div>

                  <button
                    onClick={() => user ? dispatch(addToCart(product)) : null}
                    disabled={!product.isAvailable}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-gaming-blue text-white text-xs font-orbitron font-bold uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-gaming-blue group/btn"
                  >
                    <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
                    {product.isAvailable ? 'Ajouter au Panier' : 'Indisponible'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
