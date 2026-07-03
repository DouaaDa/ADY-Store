import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';

const ProductCard = ({ product, badge }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((x) => x._id === product._id);

  // 3D Hover Effect setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(product));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product));
  };

  const renderStars = () => {
    const rating = product.rating || (Math.random() * 2 + 3).toFixed(1);
    const numReviews = product.numReviews || Math.floor(Math.random() * 200);
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="flex text-yellow-400">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-600'}`} />
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-bold">({numReviews})</span>
      </div>
    );
  };

  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col h-full rounded-2xl cursor-pointer perspective-[1000px] z-10"
    >
      {/* Animated RGB Border Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-pink opacity-0 group-hover:opacity-100 blur-[8px] transition-opacity duration-500" />
      
      {/* Actual Card Content */}
      <div className="relative flex flex-col h-full glass-premium rounded-2xl overflow-hidden border border-white/5 transition-colors duration-300 group-hover:border-transparent bg-black/80 z-20">
        
        {/* Dynamic Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2" style={{ transform: "translateZ(30px)" }}>
            {badge && (
              <span className="bg-gaming-cyan/20 backdrop-blur-md border border-gaming-cyan/50 text-gaming-cyan text-[10px] font-orbitron font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                {badge}
              </span>
            )}
            {product.media?.some(m => m.type === 'video') && (
              <span className="bg-white/20 backdrop-blur-md border border-white/50 text-white text-[10px] font-orbitron font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1 w-fit">
                ▶ Vidéo
              </span>
            )}
            {hasDiscount && (
              <span className="bg-gaming-pink text-white text-[10px] font-orbitron font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,0,127,0.6)] animate-neon-pulse flex items-center gap-1 w-fit">
                <Zap className="w-3 h-3" />
                -{Math.round((1 - product.promotionalPrice / product.price) * 100)}%
              </span>
            )}
          </div>
          
          {/* Wishlist Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 pointer-events-auto shadow-lg border ${
              isWishlisted 
                ? 'bg-gaming-pink/20 border-gaming-pink/50 text-gaming-pink shadow-[0_0_15px_rgba(255,0,127,0.4)]' 
                : 'bg-black/60 border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/10'
            }`}
            style={{ transform: "translateZ(30px)" }}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-gaming-pink' : ''}`} />
          </motion.button>
        </div>

        {/* Image Container */}
        <Link to={`/product/${product._id}`} className="relative h-64 overflow-hidden block bg-gradient-to-b from-white/5 to-transparent flex-shrink-0 flex items-center justify-center p-6">
          <motion.img 
            src={product.featuredMedia?.url || product.media?.[0]?.url || product.images?.[0]?.url || '/assets/product_placeholder.png'} 
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
            style={{ transform: "translateZ(50px)" }}
            whileHover={{ scale: 1.15, rotate: -2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
          
          {/* Overlay Quick Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-3.5 bg-white/10 border border-white/20 hover:bg-gaming-blue hover:border-gaming-blue hover:text-black rounded-full text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`p-3.5 rounded-full border transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                product.countInStock === 0 
                  ? 'bg-red-500/20 border-red-500/50 text-red-500 cursor-not-allowed' 
                  : 'bg-gaming-purple/20 border-gaming-purple hover:bg-gaming-purple text-white hover:shadow-[0_0_20px_rgba(176,38,255,0.6)]'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow relative bg-gradient-to-t from-black via-black/80 to-transparent">
          
          {/* Brand & Stock */}
          <div className="flex justify-between items-center mb-2" style={{ transform: "translateZ(20px)" }}>
            <span className="text-[10px] text-gaming-cyan font-black uppercase tracking-widest">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${product.countInStock > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-bold ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.countInStock > 0 ? 'EN STOCK' : 'RUPTURE'}
              </span>
            </div>
          </div>
          
          {/* Title */}
          <Link to={`/product/${product._id}`} style={{ transform: "translateZ(40px)" }}>
            <h3 className="font-orbitron font-bold text-base leading-snug mb-2 line-clamp-2 text-gray-100 group-hover:text-gaming-cyan transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {renderStars()}
          
          {/* Pricing & CTA */}
          <div className="mt-auto pt-4 border-t border-white/10 flex items-end justify-between" style={{ transform: "translateZ(30px)" }}>
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-xs text-gray-500 line-through font-medium mb-0.5">
                    {product.price.toLocaleString('fr-DZ')} DZD
                  </span>
                  <span className="font-orbitron text-xl font-black text-gaming-pink text-glow-purple">
                    {product.promotionalPrice.toLocaleString('fr-DZ')} <span className="text-sm font-bold">DZD</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-transparent mb-0.5">Spacer</span>
                  <span className="font-orbitron text-xl font-black text-white group-hover:text-gaming-blue transition-colors group-hover:text-glow-blue">
                    {product.price ? product.price.toLocaleString('fr-DZ') : 0} <span className="text-sm font-bold">DZD</span>
                  </span>
                </>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`relative overflow-hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                product.countInStock === 0 
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                  : 'bg-white/10 border border-white/20 text-white hover:bg-gaming-blue hover:border-gaming-blue hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]'
              }`}
            >
              {product.countInStock > 0 && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />}
              <ShoppingCart className="w-4 h-4 relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
