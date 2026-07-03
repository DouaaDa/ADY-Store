import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, PackageX } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Tous', 'Souris Gaming', 'Claviers Gaming', 'Casques Gaming', 'Écrans Gaming', 'Manettes', 'Tapis de Souris', 'Chaises Gaming', 'Microphones', 'Composants PC'];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items: products, isLoading, isError, message } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setSearchTerm(keyword);
    dispatch(fetchProducts({ keyword }));
  }, [dispatch, searchParams]);

  const featured = searchParams.get('featured') === 'true';
  const promo = searchParams.get('promo') === 'true';

  const displayedProducts = products?.filter(p => {
    if (featured && !p.isPopular) return false;
    if (promo && (!p.promotionalPrice || p.promotionalPrice >= p.price)) return false;
    return true;
  }) || [];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ keyword: searchTerm, category: selectedCategory === 'Tous' ? '' : selectedCategory }));
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    dispatch(fetchProducts({ keyword: searchTerm, category: cat === 'Tous' ? '' : cat }));
  };

  return (
    <div className="bg-gaming-bg min-h-screen pb-24">
      {/* Premium Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden border-b border-white/5 mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-gaming-blue/10 via-gaming-bg to-gaming-bg z-10" />
        <div className="absolute inset-0 bg-[url('/assets/products_banner.png')] bg-cover bg-center opacity-20 filter saturate-150" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,rgba(5,5,5,1)_70%)] z-10 mix-blend-screen" />
        
        <div className="relative z-20 text-center container mx-auto px-4 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-orbitron font-black uppercase tracking-[0.3em] text-gaming-cyan mb-4 backdrop-blur-md">
              Collection Complète
            </span>
            <h1 className="font-orbitron text-5xl md:text-7xl font-black uppercase tracking-tighter">
              <span className="text-white drop-shadow-lg">GAMING </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan via-gaming-blue to-gaming-purple text-glow-blue">GEAR</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Search & Filters */}
        <div className="glass-premium p-4 md:p-6 rounded-[2rem] border border-white/10 mb-10 shadow-2xl relative z-20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            <form onSubmit={handleSearch} className="relative flex-1 w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-full opacity-0 group-focus-within:opacity-20 blur-md transition-opacity duration-500" />
              <div className="relative flex items-center bg-black/60 border border-white/10 rounded-full focus-within:border-gaming-cyan focus-within:bg-black transition-all">
                <Search className="w-5 h-5 ml-6 text-gray-500 group-focus-within:text-gaming-cyan transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des équipements, marques..."
                  className="w-full bg-transparent py-4 px-4 text-sm focus:outline-none text-white placeholder-gray-600 font-medium"
                />
                <button type="submit" className="mr-2 px-6 py-2.5 bg-white/10 hover:bg-gaming-blue hover:text-black rounded-full font-orbitron font-bold text-xs uppercase tracking-widest transition-colors">
                  Rechercher
                </button>
              </div>
            </form>
            
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`w-full md:w-auto px-8 py-4 rounded-full flex items-center justify-center gap-3 font-orbitron font-bold text-xs uppercase tracking-widest transition-all ${filterOpen ? 'bg-gaming-purple text-white shadow-[0_0_15px_rgba(176,38,255,0.4)]' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtres
            </button>
          </div>

          <AnimatePresence>
            {filterOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-orbitron font-black uppercase tracking-widest text-gray-500 mb-4">Catégories</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryFilter(cat)}
                        className={`px-5 py-2.5 rounded-full text-xs font-orbitron font-bold uppercase tracking-wider transition-all duration-300 ${
                          selectedCategory === cat
                            ? 'bg-gaming-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-gaming-blue scale-105'
                            : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-premium rounded-2xl overflow-hidden border border-white/5 p-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shine_1.5s_infinite]" />
                <div className="h-48 bg-white/5 rounded-xl mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="flex justify-between items-end pt-4">
                    <div className="h-6 bg-white/10 rounded w-1/3" />
                    <div className="h-10 w-10 bg-white/5 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl text-center font-bold">
            <p>Une erreur est survenue lors du chargement des produits.</p>
            <p className="text-sm font-normal mt-2">{message}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-6">
              <div className="text-gray-400 font-orbitron text-xs font-bold uppercase tracking-widest">
                <span className="text-white">{displayedProducts.length}</span> Produit{displayedProducts.length !== 1 ? 's' : ''} trouvé{displayedProducts.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} />
              ))}

              {displayedProducts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-20 flex flex-col items-center justify-center glass-premium rounded-[2rem] border border-white/5"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <PackageX className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="font-orbitron text-2xl font-black text-white mb-2 uppercase tracking-wide">Aucun résultat</h3>
                  <p className="text-gray-500 text-center max-w-md">Nous n'avons trouvé aucun produit correspondant à votre recherche. Essayez de modifier vos filtres.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); dispatch(fetchProducts({})); }}
                    className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-orbitron font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Réinitialiser
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
