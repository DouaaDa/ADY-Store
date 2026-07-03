import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GitCompare, X, Minimize2, Maximize2, ShoppingCart, Trash2 } from 'lucide-react';
import { removeFromCompare, clearCompare } from '../store/compareSlice';
import { addToCart } from '../store/cartSlice';

const CompareBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.compare);
  const { user } = useSelector((state) => state.auth);
  const [minimized, setMinimized] = useState(false);

  // Auto-show bar when items added
  useEffect(() => {
    if (items.length > 0) setMinimized(false);
  }, [items.length]);

  if (items.length === 0) return null;

  const handleCompare = () => {
    navigate('/compare');
  };

  const handleAddToCart = (product) => {
    if (!user) { navigate('/login'); return; }
    dispatch(addToCart(product));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[600px] md:max-w-4xl"
      >
        <div className="glass-premium border-t md:border border-gaming-cyan/30 md:rounded-2xl shadow-[0_-4px_40px_rgba(0,240,255,0.15)] overflow-hidden">
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 cursor-pointer select-none bg-gaming-cyan/5"
            onClick={() => setMinimized((m) => !m)}
          >
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-gaming-cyan" />
              <span className="font-orbitron font-black text-xs text-white uppercase tracking-wider">
                Comparer ({items.length}/4)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); dispatch(clearCompare()); }}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                title="Vider la comparaison"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Products row */}
          <AnimatePresence>
            {!minimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3 overflow-x-auto scrollbar-hide">
                  {/* Products */}
                  {items.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative flex-shrink-0 w-20 group"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                        <img
                          src={product.images?.[0]?.url || '/assets/product_placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                        />
                        <button
                          onClick={() => dispatch(removeFromCompare(product._id))}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 text-center leading-tight line-clamp-2">
                        {product.name}
                      </p>
                    </motion.div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: 4 - items.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center"
                    >
                      <GitCompare className="w-5 h-5 text-white/20" />
                    </div>
                  ))}

                  {/* Compare button */}
                  <div className="flex-shrink-0 ml-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCompare}
                      disabled={items.length < 2}
                      className={`px-5 py-3 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider transition-all ${
                        items.length >= 2
                          ? 'bg-gradient-to-r from-gaming-cyan to-gaming-blue text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]'
                          : 'bg-white/5 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {items.length < 2 ? 'Ajouter 1 de plus' : 'Comparer →'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareBar;
