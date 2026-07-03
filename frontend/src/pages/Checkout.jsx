import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';
import { MapPin, Phone, Mail, User, Ticket, CreditCard, ShoppingBag, ShieldCheck, CheckCircle, Truck, Package, Zap, ChevronRight, Tag, X } from 'lucide-react';

/* ──────────────────────────────────────────────────
   Reusable styled form input
────────────────────────────────────────────────── */
const FormInput = ({ label, icon: Icon, required, ...inputProps }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label} {required && <span className="text-gaming-pink">*</span>}</label>
    <div className="relative">
      {Icon && <Icon className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />}
      <input
        required={required}
        {...inputProps}
        className={`w-full bg-black/40 border border-white/10 rounded-xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-white focus:outline-none focus:border-gaming-blue/50 placeholder-gray-700 transition-colors hover:border-white/20`}
      />
    </div>
  </div>
);

/* ──────────────────────────────────────────────────
   Step indicator
────────────────────────────────────────────────── */
const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ShoppingBag },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-12">
    {steps.map((step, i) => {
      const Icon = step.icon;
      const isActive = step.id === currentStep;
      const isDone = step.id < currentStep;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                isDone ? 'bg-gaming-blue border-gaming-blue text-black' :
                isActive ? 'bg-gaming-blue/10 border-gaming-blue text-gaming-cyan box-glow-blue' :
                'bg-white/5 border-white/10 text-gray-600'
              }`}
            >
              {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </motion.div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-gaming-cyan' : isDone ? 'text-gray-400' : 'text-gray-700'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-4 mb-5 transition-all duration-500 ${step.id < currentStep ? 'bg-gaming-blue' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ──────────────────────────────────────────────────
   Main Checkout Component
────────────────────────────────────────────────── */
import SearchableSelect from '../components/SearchableSelect';
import WILAYAS_DATA from '../data/wilayas';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.promotionalPrice || item.price) * item.qty, 0);

  const [wilayasList] = useState(WILAYAS_DATA); // Use static comprehensive data
  const [selectedWilayaObj, setSelectedWilayaObj] = useState(() => {
    // Pre-select user's saved wilaya on mount
    if (typeof window !== 'undefined') {
      return null; // will be set in useEffect
    }
    return null;
  });
  const [deliveryMethod, setDeliveryMethod] = useState('Home'); // 'Home' or 'Office'
  
  const [address, setAddress] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    wilaya: user?.wilaya || '',
    commune: user?.commune || '',
    adresse: user?.adresse || '',
    email: user?.email || '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const [uiStep, setUiStep] = useState(1);

  // Pre-select wilaya from user profile if it exists
  React.useEffect(() => {
    if (user?.wilaya) {
      const matched = WILAYAS_DATA.find(w => w.name.toLowerCase() === user.wilaya.toLowerCase());
      if (matched) {
        setSelectedWilayaObj(matched);
        setAddress(prev => ({
          ...prev,
          wilaya: matched.name,
          commune: user.commune || ''
        }));
      }
    }
  }, [user]);

  const handleWilayaChange = (wilayaName) => {
    const selected = wilayasList.find(w => w.name === wilayaName);
    setSelectedWilayaObj(selected);
    setAddress(prev => ({
      ...prev,
      wilaya: wilayaName,
      commune: '' // Reset commune on wilaya change
    }));
    
    // Clear errors for Wilaya and Commune
    setErrors(prev => ({ ...prev, wilaya: null, commune: null }));
  };

  const handleCommuneChange = (communeName) => {
    setAddress(prev => ({
      ...prev,
      commune: communeName
    }));
    setErrors(prev => ({ ...prev, commune: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!address.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!address.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    
    // Phone validation (Algerian numbers format)
    const phoneRegex = /^(05|06|07|02|03|04|09)[0-9]{8}$/;
    if (!address.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
    } else if (!phoneRegex.test(address.telephone.replace(/\s+/g, ''))) {
      newErrors.telephone = 'Numéro invalide (ex: 0555123456)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!address.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!emailRegex.test(address.email)) {
      newErrors.email = 'Adresse email invalide';
    }

    // Wilaya & Commune check
    if (!address.wilaya) newErrors.wilaya = 'Veuillez sélectionner une wilaya';
    if (!address.commune) newErrors.commune = 'Veuillez sélectionner une commune';
    
    // Full address check
    if (!address.adresse.trim()) newErrors.adresse = 'L\'adresse complète est requise';
    else if (address.adresse.trim().length < 8) newErrors.adresse = 'L\'adresse doit être plus précise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      return toast.error('Veuillez saisir un code coupon');
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/coupons/apply', { code: couponCode, cartSubtotal: subtotal }, config);
      setAppliedCoupon(data);
      toast.success(`Coupon ${data.code} appliqué avec succès !`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur coupon');
    }
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') return (subtotal * appliedCoupon.discountValue) / 100;
    return appliedCoupon.discountValue;
  };

  const shippingCost = selectedWilayaObj 
    ? (deliveryMethod === 'Home' ? selectedWilayaObj.homePrice : selectedWilayaObj.officePrice)
    : 0;

  const estimatedDays = selectedWilayaObj ? selectedWilayaObj.deliveryDays : 3;

  const discount = getDiscountAmount();
  const total = subtotal - discount + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      setUiStep(1); // Go back to step 1
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        image: item.images?.[0]?.url || '',
        price: item.promotionalPrice || item.price,
        color: item.selectedColor || ''
      }));

      // Combine standard address with deliveryMethod, email & postalCode
      const shippingAddress = {
        ...address,
        deliveryMethod,
        coordinates: selectedWilayaObj ? `${selectedWilayaObj.code},${address.commune}` : '' // Mock coordinates for mapping
      };

      const payload = { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice: subtotal - discount, 
        shippingPrice: shippingCost, 
        totalPrice: total 
      };

      const { data } = await axios.post('/api/orders', payload, config);
      toast.success('Commande créée avec succès ! 🎮');
      dispatch(clearCart());
      navigate(`/order/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-gray-400 mb-4 uppercase">Votre panier est vide</h2>
        <Link to="/products" className="inline-flex items-center gap-2 bg-gaming-blue text-black font-black py-3 px-8 rounded-sm uppercase tracking-widest text-sm hover:scale-105 transition-transform box-glow-blue">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  // Generate option formats for SearchableSelect
  const wilayaOptions = wilayasList.map(w => ({
    value: w.name,
    label: `${w.code} - ${w.name}`,
    searchHelper: w.code
  }));

  const communeOptions = selectedWilayaObj ? selectedWilayaObj.communes : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs font-bold tracking-[0.3em] text-gaming-cyan uppercase mb-1">Finalisez votre équipement</p>
        <h1 className="text-5xl font-black uppercase tracking-tighter">
          <span className="text-white">CAIS</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-blue to-gaming-purple">SE</span>
        </h1>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={uiStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Shipping + Payment (both forms in one) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1 — Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-7 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${uiStep >= 1 ? 'bg-gaming-blue/10 border-gaming-blue box-glow-blue' : 'bg-white/5 border-white/10'}`}>
                <MapPin className="w-4 h-4 text-gaming-cyan" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-widest text-white">Adresse de Livraison</h2>
                <p className="text-xs text-gray-500">Remplissez vos coordonnées pour recevoir votre colis.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} id="checkout-form" className="space-y-5">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput 
                    label="Nom" 
                    icon={User} 
                    required 
                    type="text" 
                    value={address.nom}
                    onChange={e => setAddress({ ...address, nom: e.target.value })} 
                    placeholder="Nom"
                    error={errors.nom} 
                  />
                  {errors.nom && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.nom}</span>}
                </div>
                <div>
                  <FormInput 
                    label="Prénom" 
                    icon={User} 
                    required 
                    type="text" 
                    value={address.prenom}
                    onChange={e => setAddress({ ...address, prenom: e.target.value })} 
                    placeholder="Prénom" 
                  />
                  {errors.prenom && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.prenom}</span>}
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput 
                    label="Téléphone" 
                    icon={Phone} 
                    required 
                    type="tel" 
                    value={address.telephone}
                    onChange={e => setAddress({ ...address, telephone: e.target.value })} 
                    placeholder="0555 123 456" 
                  />
                  {errors.telephone && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.telephone}</span>}
                </div>
                <div>
                  <FormInput 
                    label="Email" 
                    icon={Mail} 
                    required 
                    type="email" 
                    value={address.email}
                    onChange={e => setAddress({ ...address, email: e.target.value })} 
                    placeholder="client@mail.com" 
                  />
                  {errors.email && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.email}</span>}
                </div>
              </div>

              {/* Wilaya & Commune with custom searchable selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SearchableSelect 
                    label="Wilaya"
                    required
                    options={wilayaOptions}
                    value={address.wilaya}
                    onChange={handleWilayaChange}
                    placeholder="Sélectionner la Wilaya"
                    error={errors.wilaya}
                  />
                </div>
                <div>
                  <SearchableSelect 
                    label="Commune"
                    required
                    options={communeOptions}
                    value={address.commune}
                    onChange={handleCommuneChange}
                    placeholder={address.wilaya ? "Sélectionner la Commune" : "Sélectionnez une wilaya d'abord"}
                    disabled={!address.wilaya}
                    error={errors.commune}
                  />
                </div>
              </div>

              {/* Postal Code & Detailed Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <FormInput 
                    label="Code Postal (Optionnel)" 
                    type="text" 
                    value={address.postalCode}
                    onChange={e => setAddress({ ...address, postalCode: e.target.value })} 
                    placeholder="ex: 16000" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Adresse Complète <span className="text-gaming-pink">*</span></label>
                  <textarea
                    required
                    rows="3"
                    value={address.adresse}
                    onChange={e => setAddress({ ...address, adresse: e.target.value })}
                    placeholder="Numéro de rue, quartier, bâtiment, appartement..."
                    className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-gaming-blue/50 placeholder-gray-700 transition-colors hover:border-white/20 resize-none
                      ${errors.adresse ? 'border-red-500/50' : 'border-white/10'}
                    `}
                  />
                  {errors.adresse && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.adresse}</span>}
                </div>
              </div>
            </form>
          </motion.div>

          {/* Smart Delivery System Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-panel rounded-2xl p-7 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${uiStep >= 1 ? 'bg-gaming-blue/10 border-gaming-blue box-glow-blue' : 'bg-white/5 border-white/10'}`}>
                <Truck className="w-4 h-4 text-gaming-cyan" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-widest text-white">Mode de Livraison</h2>
                <p className="text-xs text-gray-500">Choisissez comment vous souhaitez être livré.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  value: 'Home', 
                  label: 'Livraison à Domicile', 
                  desc: 'Livré directement à votre adresse', 
                  price: selectedWilayaObj ? `${selectedWilayaObj.homePrice} DA` : 'Calculé selon la Wilaya',
                  icon: MapPin 
                },
                { 
                  value: 'Office', 
                  label: 'Retrait au Bureau Yalidine', 
                  desc: 'Récupérez votre colis au bureau le plus proche', 
                  price: selectedWilayaObj ? `${selectedWilayaObj.officePrice} DA` : 'Calculé selon la Wilaya',
                  icon: Package 
                },
              ].map(({ value, label, desc, price, icon: Icon }) => (
                <label
                  key={value}
                  onClick={() => { setDeliveryMethod(value); setUiStep(Math.max(uiStep, 1)); }}
                  className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    deliveryMethod === value
                      ? 'border-gaming-blue bg-gaming-blue/5 box-glow-blue'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <input type="radio" name="deliveryMethod" checked={deliveryMethod === value}
                    onChange={() => setDeliveryMethod(value)} className="accent-gaming-blue w-4 h-4" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryMethod === value ? 'bg-gaming-blue/20 text-gaming-cyan' : 'bg-white/5 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm flex justify-between items-center">
                        <span>{label}</span>
                        <span className="text-gaming-cyan text-xs font-black">{price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {selectedWilayaObj && (
              <div className="mt-4 p-3 bg-gaming-blue/5 border border-gaming-blue/10 rounded-xl flex items-center justify-between text-xs text-gray-400">
                <span>Délai estimé de livraison :</span>
                <span className="font-bold text-white">{estimatedDays} jours ouvrés</span>
              </div>
            )}
          </motion.div>

          {/* Step 2 — Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-7 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${uiStep >= 2 ? 'bg-gaming-blue/10 border-gaming-blue box-glow-blue' : 'bg-white/5 border-white/10'}`}>
                <CreditCard className="w-4 h-4 text-gaming-cyan" />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-widest text-white">Méthode de Paiement</h2>
                <p className="text-xs text-gray-500">Règlement sécurisé de votre commande.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'Cash On Delivery', label: 'Paiement à la Livraison', desc: 'Réglez en espèces à la réception de votre matériel', icon: Truck },
                { value: 'Credit Card', label: 'Carte Bancaire / CIB', desc: 'Règlement sécurisé en ligne (Bientôt disponible)', icon: CreditCard, disabled: true },
              ].map(({ value, label, desc, icon: Icon, disabled }) => (
                <label
                  key={value}
                  onClick={() => { if (!disabled) { setPaymentMethod(value); setUiStep(Math.max(uiStep, 2)); } }}
                  className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 
                    ${disabled ? 'opacity-40 cursor-not-allowed border-white/5' : 'cursor-pointer'}
                    ${!disabled && paymentMethod === value
                      ? 'border-gaming-blue bg-gaming-blue/5 box-glow-blue'
                      : !disabled ? 'border-white/10 hover:border-white/20 hover:bg-white/5' : ''
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === value}
                    disabled={disabled}
                    onChange={() => !disabled && setPaymentMethod(value)} 
                    className="accent-gaming-blue w-4 h-4" 
                  />
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === value ? 'bg-gaming-blue/20 text-gaming-cyan' : 'bg-white/5 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-white/5">
              {[
                { icon: ShieldCheck, text: 'Chiffrement SSL 256-bits' },
                { icon: Package, text: 'Colis suivi par Yalidine Express' },
                { icon: Zap, text: 'Traitement ultra-rapide en 24h' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon className="w-4 h-4 text-gaming-blue" /> {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1 space-y-4">

          {/* Coupon Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel rounded-2xl p-5 border border-white/5"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gaming-purple" /> Code Promotionnel
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="PROMO10"
                disabled={!!appliedCoupon}
                className="flex-grow bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm uppercase focus:outline-none focus:border-gaming-purple/50 text-white placeholder-gray-700 disabled:opacity-50 transition-colors"
              />
              <button type="submit" disabled={!!appliedCoupon}
                className="bg-gaming-purple hover:bg-purple-600 disabled:opacity-40 text-white font-bold px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap">
                Appliquer
              </button>
            </form>
            <AnimatePresence>
              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center justify-between text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2"
                >
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {appliedCoupon.code} — {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% de réduction` : `${appliedCoupon.discountValue} DZD de réduction`}
                  </span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-red-400 hover:text-red-300 transition-colors ml-2">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-5 border border-white/5 sticky top-28"
          >
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg bg-gaming-purple/10 border border-gaming-purple/20 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-gaming-cyan" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Récapitulatif de la Commande</h2>
            </div>

            {/* Cart items mini-list */}
            <div className="max-h-44 overflow-y-auto space-y-3 mb-5 pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-white/5">
                    <img src={item.images?.[0]?.url || ''} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-white text-xs truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-500">x{item.qty} × {(item.promotionalPrice || item.price).toLocaleString()} DA</div>
                  </div>
                  <div className="text-xs font-black text-white flex-shrink-0">
                    {((item.promotionalPrice || item.price) * item.qty).toLocaleString()} <span className="text-gray-600">DA</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 mb-5 pt-4 border-t border-white/5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span className="text-white font-bold">{subtotal.toLocaleString()} DA</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Réduction Coupon</span>
                  <span className="font-bold">-{discount.toLocaleString()} DA</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Frais de Livraison</span>
                <span className="text-white font-bold">
                  {selectedWilayaObj ? `${shippingCost.toLocaleString()} DA` : 'À sélectionner'}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="font-black uppercase tracking-wider text-sm">Montant Total</span>
                <span className="font-black text-xl text-gaming-cyan text-glow-blue">{total.toLocaleString()} <span className="text-xs">DA</span></span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={loading || !selectedWilayaObj}
              onClick={() => setUiStep(3)}
              className="w-full group relative bg-gaming-blue text-black font-black py-4 rounded-sm overflow-hidden hover:brightness-110 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer box-glow-blue disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out skew-x-12 disabled:hidden" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Confirmer la Commande <ChevronRight className="w-4 h-4" /></>
                )}
              </span>
            </button>

            {!selectedWilayaObj && (
              <p className="text-[10px] text-gaming-pink mt-3 text-center">
                Veuillez sélectionner une Wilaya de livraison.
              </p>
            )}

            <p className="text-center text-[10px] text-gray-600 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gaming-blue" /> Transaction sécurisée et confidentielle
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
