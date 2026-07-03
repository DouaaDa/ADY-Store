import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Gamepad2, Headphones, Keyboard, MonitorPlay, Mouse, Cpu, Zap, Star, ShieldCheck, Truck, Trophy, Quote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const categories = [
  { id: 1, name: 'PC Components', icon: Cpu, count: 42, color: 'from-gaming-blue to-blue-900' },
  { id: 2, name: 'Gaming Laptops', icon: MonitorPlay, count: 18, color: 'from-gaming-purple to-purple-900' },
  { id: 3, name: 'Peripherals', icon: Keyboard, count: 35, color: 'from-gaming-cyan to-teal-900' },
  { id: 4, name: 'Consoles', icon: Gamepad2, count: 12, color: 'from-gaming-pink to-pink-900' },
  { id: 5, name: 'Accessories', icon: Headphones, count: 56, color: 'from-indigo-400 to-indigo-900' },
  { id: 6, name: 'Chairs', icon: Mouse, count: 8, color: 'from-red-500 to-red-900' },
];

const brands = [
  { name: 'ASUS ROG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Republic_Of_Gamers_logo.svg/1200px-Republic_Of_Gamers_logo.svg.png' },
  { name: 'Razer', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/1200px-Razer_snake_logo.svg.png' },
  { name: 'MSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/MSI_logo.svg/1200px-MSI_logo.svg.png' },
  { name: 'Corsair', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Corsair_logo.svg/1200px-Corsair_logo.svg.png' },
  { name: 'Logitech G', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logitech_G_Logo.svg/1200px-Logitech_G_Logo.svg.png' },
];

const stats = [
  { value: '10K+', label: 'Clients Satisfaits', icon: Star },
  { value: '4.9/5', label: 'Note Moyenne', icon: Trophy },
  { value: '24/7', label: 'Support Client', icon: ShieldCheck },
  { value: '48h', label: 'Livraison Rapide', icon: Truck },
];

const reviews = [
  { name: "Amine K.", role: "Pro Gamer", content: "L'équipement est arrivé en parfait état. La RTX 4090 a transformé mon setup. Service exceptionnel.", rating: 5, initial: "AK" },
  { name: "Sarah M.", role: "Streamer", content: "La qualité du matériel est irréprochable. Livraison ultra rapide et le support client est vraiment à l'écoute. Je recommande à 100%.", rating: 5, initial: "SM" },
  { name: "Yacine B.", role: "Enthusiast", content: "Des prix imbattables pour cette qualité. Le design du site reflète parfaitement la qualité des produits vendus.", rating: 5, initial: "YB" }
];

const faqs = [
  { q: "Quels sont les délais de livraison ?", a: "Nous livrons partout en Algérie en 48h ouvrées pour les grandes wilayas, et jusqu'à 72h pour le Sud." },
  { q: "Les produits sont-ils sous garantie ?", a: "Oui, tous nos équipements bénéficient d'une garantie constructeur de 12 à 24 mois selon le produit." },
  { q: "Quels sont les moyens de paiement ?", a: "Vous pouvez payer à la livraison (Cash on Delivery), ou par virement bancaire et carte CIB." },
];

const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          backgroundColor: i % 2 === 0 ? '#00f0ff' : '#b026ff',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          boxShadow: `0 0 ${Math.random() * 15 + 5}px ${i % 2 === 0 ? '#00f0ff' : '#b026ff'}`,
        }}
        animate={{
          y: [0, -Math.random() * 150 - 50],
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0.3],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, isLoading: loading } = useSelector((state) => state.products);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 36, secs: 28 });
  const [activeFaq, setActiveFaq] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({}));
    
    // Fetch global settings for Hero Config
    axios.get('/api/settings').then(res => setSettings(res.data)).catch(err => console.error("Error fetching settings in Home:", err));
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else { hours = 23; if (days > 0) days--; }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const popularProducts = products?.filter(p => p.isPopular).slice(0, 4) || [];
  const promoProducts = products?.filter(p => p.promotionalPrice && p.promotionalPrice < p.price).slice(0, 4) || [];
  const recentProducts = products?.slice(0, 4) || [];
  const trendingProduct = products?.length > 0 ? products[0] : null;

  return (
    <div className="flex flex-col bg-gaming-bg text-white overflow-hidden font-sans">
      
      {/* 1. HERO SECTION (Cinematic, Parallax, Neon) */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden border-b border-white/5">
        {/* Parallax Background */}
        <motion.div style={{ y: y1, opacity: opacityHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,rgba(5,5,5,1)_80%)] z-10 mix-blend-screen" />
          <img src={settings?.heroConfig?.background || "/assets/hero_rgb.png"} 
               alt="Hero Gaming Background" 
               className="w-full h-full object-cover object-center filter saturate-150 contrast-125" />
        </motion.div>

        <ParticleBackground />

        <div className="container mx-auto px-4 lg:px-8 relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <div className="w-full md:w-[60%] lg:w-[55%] text-left mt-10 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }} 
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-gaming-cyan/30 mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-gaming-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-default">
                <span className="w-2.5 h-2.5 rounded-full bg-gaming-cyan animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                <span className="text-xs font-orbitron font-bold tracking-[0.2em] uppercase text-gaming-cyan">Nouvelle Collection Disponible</span>
              </div>
              
              <h1 className="font-orbitron text-6xl md:text-[80px] lg:text-[110px] font-black mb-6 leading-[0.9] tracking-tighter">
                <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] block transform hover:scale-[1.02] transition-transform origin-left">
                  {settings?.heroTitle?.split(' ')[0] || 'DOMINATE'}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan via-gaming-blue to-gaming-purple text-glow-blue block animate-float mt-2">
                  {settings?.heroTitle?.substring(settings.heroTitle.indexOf(' ') + 1) || 'THE GAME'}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl font-medium border-l-4 border-gaming-cyan pl-6 py-2 bg-gradient-to-r from-gaming-cyan/10 to-transparent leading-relaxed backdrop-blur-sm rounded-r-xl">
                {settings?.heroSubtitle || "Explorez l'élite de l'équipement gaming. Des performances brutes, un design futuriste et une précision absolue pour les joueurs qui ne font aucun compromis."}
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/products" className="group relative px-10 py-5 bg-gaming-cyan text-black font-orbitron font-black rounded-xl overflow-hidden box-glow-blue transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] flex items-center gap-3">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                  <span className="relative z-10 text-sm uppercase tracking-[0.2em]">Boutique</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link to="/products?promo=true" className="group relative px-8 py-5 bg-black/40 backdrop-blur-md border border-white/20 text-white font-orbitron font-bold rounded-xl overflow-hidden transform transition-all hover:border-gaming-purple hover:text-gaming-purple flex items-center gap-3">
                  <div className="absolute inset-0 bg-gaming-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 text-sm uppercase tracking-widest">Voir les Offres</span>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full md:w-[40%] lg:w-[45%] relative hidden md:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }} 
              animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
              transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 80 }}
              className="relative z-10 drop-shadow-[0_0_50px_rgba(176,38,255,0.3)] perspective-[1000px] flex justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-gaming-purple to-gaming-pink rounded-[3rem] blur-[80px] opacity-40 animate-pulse" />
              <img src={settings?.heroConfig?.featured || "/assets/product_placeholder.png"} 
                   alt="Premium Gaming Setup" 
                   className="w-[90%] h-auto object-cover rounded-[3rem] border-2 border-white/10 glass-panel relative z-10 transform hover:rotate-y-12 transition-transform duration-700 shadow-2xl" />
                   
              {/* Dynamic Floating Elements */}
              {settings?.heroConfig?.floatingCards?.filter(c => c.enabled).sort((a,b) => a.order - b.order).map((card, i) => {
                const getPositionStyles = (pos) => {
                  switch(pos) {
                    case 'top-right': return "absolute -top-10 -right-4";
                    case 'bottom-left': return "absolute -bottom-10 -left-4";
                    case 'top-left': return "absolute -top-10 -left-4";
                    case 'bottom-right': return "absolute -bottom-10 -right-4";
                    default: return "absolute top-1/2 -right-10";
                  }
                };
                
                const anims = [
                  { y: [-15, 15, -15], duration: 5, delay: 0 },
                  { y: [15, -15, 15], duration: 6, delay: 1 },
                  { x: [-15, 15, -15], duration: 5.5, delay: 0.5 },
                  { x: [15, -15, 15], duration: 6.5, delay: 1.5 },
                ];
                const anim = anims[i % anims.length];

                return (
                  <motion.div 
                    key={i}
                    animate={anim}
                    transition={{ duration: anim.duration, repeat: Infinity, ease: "easeInOut", delay: anim.delay }}
                    className={`${getPositionStyles(card.position)} glass-premium p-4 rounded-2xl z-20 border ${i % 2 === 0 ? 'border-gaming-cyan/30 box-glow-blue' : 'border-gaming-purple/30 box-glow-purple'} backdrop-blur-xl flex items-center gap-3`}
                  >
                    {card.image ? (
                      <img src={card.image} alt={card.title} className="w-10 h-10 object-contain" />
                    ) : (
                      i % 2 === 0 ? <Zap className="w-5 h-5 text-gaming-cyan" /> : <Star className="w-5 h-5 text-gaming-purple" />
                    )}
                    <div>
                      <div className={`font-orbitron font-black ${card.image ? 'text-lg text-white' : (i % 2 === 0 ? 'text-xl text-gaming-cyan' : 'text-lg text-white')}`}>
                        {card.title}
                      </div>
                      <div className={`text-[10px] uppercase tracking-widest mt-1 ${i % 2 === 0 ? 'text-gray-400' : 'text-gaming-purple'}`}>
                        {card.subtitle}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Fallback floating elements if none configured */}
              {(!settings?.heroConfig?.floatingCards || settings.heroConfig.floatingCards.filter(c => c.enabled).length === 0) && (
                <>
                  <motion.div 
                    animate={{ y: [-15, 15, -15] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-4 glass-premium p-4 rounded-2xl z-20 border border-gaming-cyan/30 box-glow-blue backdrop-blur-xl"
                  >
                    <div className="text-gaming-cyan font-orbitron font-black text-xl flex items-center gap-2"><Zap className="w-5 h-5" /> RTX 4090</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Puissance Absolue</div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [15, -15, 15] }} 
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -left-4 glass-premium p-4 rounded-2xl z-20 border border-gaming-purple/30 box-glow-purple backdrop-blur-xl"
                  >
                    <div className="text-white font-orbitron font-black text-lg">Next-Gen</div>
                    <div className="text-[10px] text-gaming-purple uppercase tracking-widest mt-1">Prêt pour 2026</div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Animated Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-4 py-5">
            <div className="flex justify-between items-center divide-x divide-white/10 overflow-x-auto scrollbar-hide">
              {stats.map((stat, i) => (
                <div key={i} className="flex-1 min-w-[200px] flex items-center justify-center gap-5 px-6 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gaming-cyan/20 group-hover:border-gaming-cyan group-hover:box-glow-blue transition-all duration-500">
                    <stat.icon className="w-6 h-6 text-gray-400 group-hover:text-gaming-cyan transition-colors" />
                  </div>
                  <div>
                    <div className="font-orbitron font-black text-2xl text-white group-hover:text-gaming-cyan transition-colors">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="py-20 relative z-20 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-[10px] font-orbitron font-black uppercase tracking-[0.3em] text-gaming-purple mb-2">Navigation</p>
              <h2 className="font-orbitron text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                Explorer par <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple to-gaming-pink text-glow-purple">Catégorie</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link to={`/products?category=${cat.name}`} key={cat.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="flex flex-col items-center gap-5 group cursor-pointer"
                  >
                    <div className="relative w-full aspect-square rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-gaming-cyan/50 group-hover:bg-black/60 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:border-gaming-cyan">
                        <Icon className="w-8 h-8 text-gray-400 group-hover:text-gaming-cyan transition-colors" />
                      </div>
                      
                      <span className="text-xs font-bold text-gray-500 group-hover:text-gaming-cyan transition-colors relative z-10 uppercase tracking-wider">
                        {cat.count} Produits
                      </span>
                    </div>
                    <h3 className="font-orbitron font-black text-sm text-center text-gray-300 group-hover:text-white uppercase tracking-wider">{cat.name}</h3>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCT (Huge Showcase) */}
      {trendingProduct && (
        <section className="py-20 bg-gaming-bg relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gaming-blue/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-premium rounded-[3rem] border border-white/10 overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-cyan/10 to-transparent opacity-30" />
              <div className="lg:w-1/2 p-12 relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gaming-cyan/20 border border-gaming-cyan/50 text-gaming-cyan font-orbitron font-black text-[10px] uppercase tracking-widest mb-6 box-glow-blue">Tendance Actuelle</span>
                <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-6 uppercase leading-tight">
                  L'équipement le plus <span className="text-gaming-cyan">convoité</span>
                </h2>
                <h3 className="text-2xl text-gray-300 font-bold mb-4">{trendingProduct.name}</h3>
                <p className="text-gray-400 mb-8 max-w-md leading-relaxed">{trendingProduct.description?.substring(0, 150)}...</p>
                
                <div className="flex items-center gap-6">
                  <div className="font-orbitron font-black text-3xl text-white">
                    {trendingProduct.price?.toLocaleString()} <span className="text-sm">DZD</span>
                  </div>
                  <Link to={`/product/${trendingProduct._id}`} className="px-8 py-3 bg-white text-black font-orbitron font-bold uppercase tracking-widest rounded-full hover:bg-gaming-cyan transition-colors text-sm">
                    Découvrir
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 p-12 flex justify-center relative z-10">
                <motion.img 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  src={trendingProduct.images?.[0]?.url || "/assets/product_placeholder.png"} 
                  alt={trendingProduct.name} 
                  className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,240,255,0.4)]"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. FLASH DEALS */}
      {promoProducts.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-black border-y border-gaming-pink/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,0,127,0.1),transparent_50%)] z-0 pointer-events-none" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 border-b border-white/5 pb-8">
              <div className="flex items-center gap-6 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gaming-pink/20 border border-gaming-pink/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                  <Zap className="w-8 h-8 text-gaming-pink animate-pulse" />
                </div>
                <div>
                  <h2 className="font-orbitron text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                    Flash <span className="text-gaming-pink text-glow-purple">Deals</span>
                  </h2>
                  <p className="text-gray-400 font-medium mt-2 text-sm">Offres limitées. Saisissez votre chance !</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                {[
                  { label: 'JRS', value: timeLeft.days },
                  { label: 'HRS', value: timeLeft.hours },
                  { label: 'MIN', value: timeLeft.mins },
                  { label: 'SEC', value: timeLeft.secs }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-orbitron text-2xl font-black text-white shadow-inner">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] text-gaming-pink mt-2 font-black tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {promoProducts.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED PRODUCTS & BEST SELLERS */}
      <section className="py-20 bg-gaming-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] font-orbitron font-black uppercase tracking-[0.3em] text-gaming-cyan mb-2">Sélection Premium</p>
              <h2 className="font-orbitron text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                Nouveautés & <span className="text-gaming-cyan text-glow-blue">Tops</span>
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-white font-orbitron font-bold text-xs uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 hover:border-white/30">
              Voir tout <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentProducts.map((product, i) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={product} badge={i % 2 === 0 ? "Nouveau" : "Best Seller"} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUSTED BRANDS */}
      <section className="py-16 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <p className="text-center text-[10px] font-orbitron font-black tracking-[0.4em] text-gray-500 uppercase mb-10">
            Marques Officielles Partenaires
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 hover:opacity-100 transition-opacity duration-700">
            {brands.map((brand, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1, filter: 'brightness(1.5)' }} className="cursor-pointer">
                <img src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-20 bg-gaming-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gaming-purple/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Ce que disent <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan to-gaming-blue">nos joueurs</span>
            </h2>
            <p className="text-gray-400">Rejoignez des milliers de joueurs satisfaits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-premium p-8 rounded-3xl border border-white/5 relative group hover:border-gaming-cyan/30 transition-colors"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 group-hover:text-gaming-cyan/10 transition-colors" />
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 italic leading-relaxed font-medium">"{review.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-gaming-purple to-gaming-blue border border-white/20 flex items-center justify-center font-orbitron font-black text-white text-lg">
                    {review.initial}
                  </div>
                  <div>
                    <div className="font-bold text-white font-orbitron">{review.name}</div>
                    <div className="text-xs text-gaming-cyan uppercase tracking-widest">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              Questions <span className="text-gaming-purple">Fréquentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="glass rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-gaming-purple/30"
              >
                <button 
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-white font-orbitron"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronRight className={`w-5 h-5 text-gaming-purple transition-transform duration-300 ${activeFaq === i ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-gray-400 text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
