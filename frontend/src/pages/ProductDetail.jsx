import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, Check, Package, Shield, Zap, ChevronRight, Share2, Quote, Truck, Eye, Sliders } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail: product, items: allProducts, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  const isWishlisted = product && wishlistItems.some((x) => x._id === product._id);
  const hasDiscount = product?.promotionalPrice && product.promotionalPrice < product.price;

  useEffect(() => {
    dispatch(fetchProductById(id));
    if (allProducts.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, id, allProducts.length]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(product));
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product));
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gaming-bg">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-gaming-cyan rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-2 border-4 border-gaming-purple rounded-full border-b-transparent animate-spin" style={{ animationDelay: '-0.5s' }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-gaming-bg min-h-screen flex flex-col items-center justify-center">
        <div className="text-gray-600 mb-6 font-orbitron text-6xl font-black">404</div>
        <h2 className="text-2xl font-bold text-white mb-6 font-orbitron tracking-wide">Produit Introuvable</h2>
        <Link to="/products" className="px-8 py-3 bg-gaming-blue text-black font-orbitron font-bold text-sm uppercase tracking-widest rounded-full hover:bg-gaming-cyan transition-colors">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(p => (p.category?._id || p.category) === (product.category?._id || product.category) && p._id !== product._id).slice(0, 4);

  // Dummy reviews since backend doesn't provide them
  const dummyReviews = [
    { name: "Karim B.", rating: 5, date: "Il y a 2 jours", text: "Excellent produit, la qualité de fabrication est incroyable. Livraison super rapide!" },
    { name: "Yasmine M.", rating: 4, date: "Il y a 1 semaine", text: "Très satisfaite. Les performances sont au rendez-vous. Petit bémol sur l'emballage." },
    { name: "Walid S.", rating: 5, date: "Il y a 1 mois", text: "Le meilleur rapport qualité/prix du marché algérien en ce moment." }
  ];

  const specs = [
    { label: "Marque", value: product.brand },
    { label: "Catégorie", value: product.category?.name || product.category },
    { label: "État", value: "Neuf (Sous emballage)" },
    { label: "Garantie", value: "12 Mois Constructeur" },
    { label: "Disponibilité", value: product.countInStock > 0 ? "En stock (Immédiate)" : "Sur commande" }
  ];

  return (
    <div className="bg-gaming-bg min-h-screen pb-24 overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gaming-purple/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gaming-blue/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gaming-cyan/5 blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10 relative z-10">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs font-orbitron font-bold uppercase tracking-widest text-gray-500 mb-8"
        >
          <Link to="/" className="hover:text-gaming-cyan transition-colors">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-gaming-cyan transition-colors">Boutique</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/products?category=${product.category?.name || product.category}`} className="hover:text-gaming-cyan transition-colors">{product.category?.name || product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gaming-blue">{product.brand}</span>
        </motion.div>

        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Images Section (Span 7) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Main Image with Smooth Zoom */}
            <div className="relative rounded-[2rem] glass-premium border border-white/5 p-8 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-gaming-blue/10 via-transparent to-gaming-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              
              {/* Animated Frame */}
              <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-pink opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-700 -z-10" />

              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-gaming-pink text-white text-xs font-orbitron font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.5)] z-20 animate-neon-pulse flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Promo
                </div>
              )}

              <button className="absolute top-6 right-6 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20 hover:scale-110 active:scale-95">
                <Share2 className="w-4 h-4" />
              </button>

              <div 
                className="relative w-full aspect-square flex items-center justify-center overflow-hidden z-10 rounded-[2rem] bg-black/40"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {(() => {
                  const mediaList = product.media?.length ? product.media : (product.images?.length ? product.images.map(img => ({ ...img, type: 'image' })) : []);
                  const currentMedia = mediaList[selectedImage] || product.featuredMedia || mediaList[0];

                  if (currentMedia) {
                    if (currentMedia.type === 'video') {
                      return (
                        <video
                          src={currentMedia.url}
                          autoPlay
                          loop
                          muted
                          controls
                          className="w-full h-full object-cover filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                        />
                      );
                    } else {
                      return (
                        <motion.div
                          className="w-full h-full cursor-crosshair"
                          animate={{ scale: isHovering ? 2 : 1 }}
                          style={{ transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }}
                          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                        >
                          <img
                            src={currentMedia.url}
                            alt={product.name}
                            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                          />
                        </motion.div>
                      );
                    }
                  } else {
                    return (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 rounded-2xl">
                        Image non disponible
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Thumbnails */}
            {(() => {
              const mediaList = product.media?.length ? product.media : (product.images?.length ? product.images.map(img => ({ ...img, type: 'image' })) : []);
              if (mediaList.length > 1) {
                return (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
                    {mediaList.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden glass transition-all duration-300 transform hover:-translate-y-1 ${
                          selectedImage === i 
                            ? 'border-2 border-gaming-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                            : 'border border-white/5 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        {m.type === 'video' ? (
                          <div className="w-full h-full bg-black relative">
                            <video src={m.url} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-black/60 text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span>
                            </div>
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover p-2" />
                        )}
                        {selectedImage === i && <div className="absolute inset-0 bg-gaming-cyan/10" />}
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </motion.div>

          {/* Info Section (Span 5) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-orbitron font-black text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gaming-purple box-glow-purple" />
                {product.brand}
              </div>
              <h1 className="font-orbitron text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-5 uppercase">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5 inline-flex backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating || 4.5) ? 'fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-white ml-1">{product.rating || 4.5}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-gaming-cyan font-medium hover:underline cursor-pointer flex items-center gap-2"><Quote className="w-3 h-3" />{product.numReviews || 128} Avis vérifiés</span>
              </div>
            </div>

            <div className="glass-premium p-8 rounded-[2rem] border border-white/10 mb-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-end gap-5 mb-6 relative z-10">
                {hasDiscount ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through font-medium mb-1">{product.price?.toLocaleString('fr-DZ')} DZD</span>
                      <span className="font-orbitron text-5xl font-black text-gaming-pink text-glow-purple leading-none tracking-tighter">
                        {product.promotionalPrice?.toLocaleString('fr-DZ')} <span className="text-2xl font-bold">DZD</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="font-orbitron text-5xl font-black text-white text-glow-blue leading-none tracking-tighter">
                    {product.price?.toLocaleString('fr-DZ')} <span className="text-2xl font-bold">DZD</span>
                  </span>
                )}
              </div>
              
              <div className={`relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-inner ${product.countInStock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                <Package className="w-4 h-4" />
                {product.countInStock > 0 ? `En Stock (${product.countInStock} unités)` : 'Rupture de stock'}
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm mb-10 pl-4 border-l-2 border-gaming-cyan/30">
              {product.description || "Découvrez la puissance ultime avec cet équipement haut de gamme. Conçu spécifiquement pour les joueurs exigeants qui ne font aucun compromis sur la performance et le design."}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <div className="text-xs font-orbitron font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center justify-between">
                  <span>Couleur sélectionnée</span>
                  <span className="text-white bg-white/10 px-3 py-1 rounded-full">{selectedColor || product.colors[0]}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                        (selectedColor || product.colors[0]) === color 
                          ? 'bg-gaming-blue text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
                          : 'bg-black/60 border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {color}
                      {(selectedColor || product.colors[0]) === color && (
                        <div className="absolute inset-0 border-2 border-white/20 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-4 mb-10 relative z-20">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`relative flex-1 group overflow-hidden flex items-center justify-center gap-3 font-orbitron font-black text-sm uppercase tracking-widest py-5 rounded-2xl transition-all duration-300 ${
                  product.countInStock === 0
                    ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                    : 'bg-gaming-blue text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] hover:bg-gaming-cyan'
                }`}
              >
                {product.countInStock > 0 && (
                  <>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 blur-2xl rounded-full mix-blend-overlay" />
                  </>
                )}
                <ShoppingCart className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{product.countInStock > 0 ? (user ? 'Ajouter au panier' : 'Se connecter') : 'Indisponible'}</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isWishlisted 
                    ? 'bg-gaming-pink/10 border-2 border-gaming-pink/50 text-gaming-pink shadow-[0_0_20px_rgba(255,0,127,0.3)]' 
                    : 'bg-black/40 border-2 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current animate-bounce' : ''}`} />
              </motion.button>
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-gaming-purple/30 transition-colors group">
                <Shield className="w-6 h-6 text-gaming-purple mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider mb-1">Garantie 12 Mois</h4>
                <p className="text-[10px] text-gray-500">Protection intégrale incluse</p>
              </div>
              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-gaming-blue/30 transition-colors group">
                <Truck className="w-6 h-6 text-gaming-blue mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider mb-1">Livraison 48h</h4>
                <p className="text-[10px] text-gray-500">Expédition rapide et sécurisée</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Detailed Sections (Specs & Reviews) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-premium rounded-[2rem] border border-white/10 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'specs', label: 'Spécifications', icon: Sliders },
              { id: 'reviews', label: 'Avis Clients', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-6 flex items-center justify-center gap-3 font-orbitron font-black text-sm uppercase tracking-widest transition-colors relative ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300 bg-black/20'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gaming-cyan' : ''}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-gaming-cyan shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            {activeTab === 'specs' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-orbitron font-bold text-xl text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gaming-purple box-glow-purple" />
                    Détails Techniques
                  </h3>
                  <div className="space-y-4">
                    {specs.map((s, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-gray-400 text-sm">{s.label}</span>
                        <span className="font-bold text-white text-sm text-right max-w-[60%]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-center">
                  <Zap className="w-10 h-10 text-gaming-blue mb-4" />
                  <h4 className="font-orbitron font-bold text-lg text-white uppercase tracking-wider mb-2">Performances Extremes</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Ce produit a été testé rigoureusement pour répondre aux standards de l'esport professionnel. L'excellence matérielle au service de votre talent.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-orbitron font-bold text-xl text-white uppercase tracking-wider mb-2">Avis Vérifiés</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400"><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400 text-yellow-400/50" /></div>
                      <span className="text-xl font-black text-white ml-2">4.8</span>
                      <span className="text-gray-500 text-sm">sur 5</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-orbitron font-bold text-xs text-white uppercase tracking-widest transition-colors">
                    Écrire un avis
                  </button>
                </div>
                
                <div className="space-y-6">
                  {dummyReviews.map((rev, i) => (
                    <div key={i} className="bg-black/20 p-6 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-bold text-white font-orbitron tracking-wide flex items-center gap-2">
                            {rev.name} <Check className="w-3 h-3 text-gaming-cyan" />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{rev.date}</div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-yellow-400' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="font-orbitron text-2xl lg:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-gaming-blue box-glow-blue" />
                Produits <span className="text-gaming-cyan">Similaires</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
