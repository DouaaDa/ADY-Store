import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ChevronRight, Shield, Truck, Headphones, CreditCard } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gaming-bg border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Ambient glow spheres */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gaming-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gaming-blue/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Cyber grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      {/* Trust Bar */}
      <div className="relative border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, title: 'Livraison Rapide', desc: 'Partout en Algérie' },
              { icon: Shield, title: 'Paiement Sécurisé', desc: '100% garanti' },
              { icon: Headphones, title: 'Support 24/7', desc: "À votre écoute" },
              { icon: CreditCard, title: 'Retour Facile', desc: 'Sous 30 jours' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }} 
                className="flex flex-col items-center gap-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gaming-cyan/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 group-hover:border-gaming-cyan group-hover:bg-gaming-cyan/10 transition-all duration-300">
                    <Icon className="w-6 h-6 text-gray-400 group-hover:text-gaming-cyan transition-colors" />
                  </div>
                </div>
                <div>
                  <p className="font-orbitron font-bold text-sm text-white tracking-wide">{title}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column (Span 4) */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="relative group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gaming-blue/10 rounded-2xl blur-md group-hover:bg-gaming-blue/20 transition-colors" />
                <img
                  src="/ady-logo.png"
                  alt="ADY Store"
                  className="relative h-12 w-auto object-contain rounded-2xl drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                />
              </div>
              <div>
                <span className="block font-orbitron text-3xl font-black tracking-wider text-white text-glow-blue">ADY</span>
                <span className="block text-xs font-bold tracking-[0.4em] text-gaming-cyan">STORE</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 pr-4">
              La destination ultime pour l'équipement gaming premium. Dominez chaque bataille avec du matériel de classe mondiale, sélectionné pour les vrais passionnés.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { Icon: FaFacebook, color: 'hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10' }, 
                { Icon: FaInstagram, color: 'hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/10' }, 
                { Icon: FaTwitter, color: 'hover:text-sky-500 hover:border-sky-500 hover:bg-sky-500/10' }, 
                { Icon: FaYoutube, color: 'hover:text-red-500 hover:border-red-500 hover:bg-red-500/10' }
              ].map(({ Icon, color }, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Shop Links (Span 2) */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-orbitron font-bold uppercase tracking-widest text-white mb-6 text-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gaming-blue box-glow-blue" />
              Boutique
            </h4>
            <ul className="space-y-4">
              {['Tous les produits', 'Composants PC', 'PC Portables', 'Périphériques', 'Consoles', 'Accessoires'].map(item => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-gaming-cyan transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 text-gaming-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links (Span 2) */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-orbitron font-bold uppercase tracking-widest text-white mb-6 text-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gaming-purple box-glow-purple" />
              Support
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Contact', path: '/contact' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Livraison', path: '/shipping' },
                { label: 'Retours', path: '/returns' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="text-sm text-gray-400 hover:text-gaming-purple transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 text-gaming-purple opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-3">
              <a href="mailto:support@adystore.dz" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-gaming-blue" /></div>
                support@adystore.dz
              </a>
              <a href="tel:+213555123456" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Phone className="w-3.5 h-3.5 text-gaming-purple" /></div>
                +213 555 123 456
              </a>
            </div>
          </div>

          {/* Newsletter Column (Span 3) */}
          <div className="md:col-span-12 lg:col-span-3">
            <h4 className="font-orbitron font-bold uppercase tracking-widest text-white mb-6 text-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gaming-pink shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Recevez des offres exclusives, des nouveautés et des actualités gaming directement dans votre boîte de réception.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              <div className="relative flex bg-black/60 border border-white/10 rounded-xl overflow-hidden focus-within:border-gaming-cyan transition-colors">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-transparent px-4 py-3.5 w-full text-sm focus:outline-none text-white placeholder-gray-600"
                />
                <button type="submit" className="bg-gaming-blue text-black px-6 font-black hover:bg-gaming-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300">
                  →
                </button>
              </div>
            </form>
            <p className="text-[10px] text-gray-600 mt-3 font-medium tracking-wide">Pas de spam. Désabonnement à tout moment.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5 bg-black/80">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} ADY Store. Tous droits réservés.</p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Conditions d'utilisation</Link>
            
            {/* Payment icons */}
            <div className="flex gap-2">
              {['VISA', 'PayPal', 'CIB'].map(method => (
                <div key={method} className="h-6 px-2 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-400">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
