import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, Package, Tag, Zap } from 'lucide-react';
import axios from 'axios';

const MAX_HISTORY = 8;
const DEBOUNCE_MS = 300;

const getHistory = () => {
  try { return JSON.parse(localStorage.getItem('ady_search_history') || '[]'); }
  catch { return []; }
};
const saveHistory = (term) => {
  try {
    const history = getHistory().filter((h) => h !== term);
    history.unshift(term);
    localStorage.setItem('ady_search_history', JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {}
};
const clearHistory = () => {
  try { localStorage.removeItem('ady_search_history'); } catch {}
};

const POPULAR = ['RTX 4090', 'Gaming Chair', 'Mechanical Keyboard', 'Razer Mouse', 'PlayStation 5', 'ROG Laptop'];

const LiveSearch = ({ query, onClose, inputRef }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState({ products: [], brands: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(getHistory());
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const fetchResults = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setResults({ products: [], brands: [], categories: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products/search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } catch {
      setResults({ products: [], brands: [], categories: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(query), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchResults]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        inputRef?.current && !inputRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, inputRef]);

  const handleNavigate = (url, term) => {
    if (term) saveHistory(term);
    setHistory(getHistory());
    onClose?.();
    navigate(url);
  };

  const isEmpty = !query || query.trim().length < 2;
  const hasResults = results.products.length > 0 || results.brands.length > 0 || results.categories.length > 0;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ transformOrigin: 'top' }}
      className="absolute top-full left-0 right-0 mt-2 glass-premium border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[80vh] overflow-y-auto scrollbar-hide"
    >
      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 bg-gaming-cyan rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">Recherche en cours...</span>
        </div>
      )}

      {/* Empty state — show history + popular */}
      {isEmpty && !loading && (
        <>
          {history.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recherches récentes
                </p>
                <button
                  onClick={() => { clearHistory(); setHistory([]); }}
                  className="text-[10px] text-gray-500 hover:text-red-400 transition-colors"
                >
                  Effacer
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleNavigate(`/products?keyword=${encodeURIComponent(h)}`, h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-300 hover:text-white transition-all"
                  >
                    <Clock className="w-3 h-3 text-gray-500" />
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 border-t border-white/5">
            <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3 h-3" /> Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => handleNavigate(`/products?keyword=${encodeURIComponent(p)}`, p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gaming-cyan/5 hover:bg-gaming-cyan/10 border border-gaming-cyan/20 rounded-full text-xs text-gaming-cyan hover:text-white transition-all"
                >
                  <Zap className="w-3 h-3" />
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search Results */}
      {!isEmpty && !loading && (
        <>
          {/* Categories */}
          {results.categories.length > 0 && (
            <div className="p-3 border-b border-white/5">
              <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-widest px-1 mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Catégories
              </p>
              {results.categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleNavigate(`/products?category=${cat._id}`, query)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-sm">{cat.icon || '📁'}</span>
                  <span className="text-sm text-gray-200">{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Brands */}
          {results.brands.length > 0 && (
            <div className="p-3 border-b border-white/5">
              <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-widest px-1 mb-2">
                Marques
              </p>
              <div className="flex flex-wrap gap-2 px-1">
                {results.brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleNavigate(`/products?brand=${encodeURIComponent(brand)}`, query)}
                    className="px-3 py-1.5 bg-gaming-purple/10 border border-gaming-purple/20 rounded-full text-xs text-gaming-purple hover:bg-gaming-purple/20 transition-all"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 ? (
            <div className="p-3">
              <p className="text-[10px] font-orbitron font-black text-gray-500 uppercase tracking-widest px-1 mb-2 flex items-center gap-1.5">
                <Package className="w-3 h-3" /> Produits ({results.products.length})
              </p>
              {results.products.map((product) => {
                const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
                return (
                  <button
                    key={product._id}
                    onClick={() => handleNavigate(`/product/${product._id}`, product.name)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                      <img
                        src={product.images?.[0]?.url || '/assets/product_placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-200 group-hover:text-white truncate transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gaming-cyan font-bold uppercase">{product.brand}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {hasDiscount ? (
                        <>
                          <p className="text-sm font-orbitron font-black text-gaming-pink">
                            {product.promotionalPrice.toLocaleString('fr-DZ')} DZD
                          </p>
                          <p className="text-[10px] text-gray-500 line-through">
                            {product.price.toLocaleString('fr-DZ')}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-orbitron font-black text-white">
                          {product.price?.toLocaleString('fr-DZ')} DZD
                        </p>
                      )}
                      {product.countInStock === 0 && (
                        <p className="text-[10px] text-red-400 font-bold">Rupture</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            !loading && query.trim().length >= 2 && !hasResults && (
              <div className="py-10 px-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <p className="text-sm text-gray-400">Aucun résultat pour <span className="text-white font-bold">"{query}"</span></p>
                <button
                  onClick={() => handleNavigate(`/products?keyword=${encodeURIComponent(query)}`, query)}
                  className="mt-3 text-xs text-gaming-cyan hover:text-gaming-blue transition-colors"
                >
                  Voir tous les résultats →
                </button>
              </div>
            )
          )}

          {/* View all link */}
          {hasResults && (
            <div className="p-3 border-t border-white/5">
              <button
                onClick={() => handleNavigate(`/products?keyword=${encodeURIComponent(query)}`, query)}
                className="w-full text-center text-xs text-gaming-cyan hover:text-gaming-blue font-bold uppercase tracking-widest transition-colors py-1"
              >
                Voir tous les résultats pour "{query}" →
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default LiveSearch;
