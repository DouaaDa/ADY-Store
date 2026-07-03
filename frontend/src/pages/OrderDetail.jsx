import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Package, MapPin, CreditCard, Calendar, FileText, Printer, 
  ArrowLeft, CheckCircle2, ChevronRight, Truck, Box, Download, 
  Clock, ShieldAlert, BadgeHelp, Check, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { printInvoice, generatePDF } from '../utils/printInvoice';

const STATUS_STEPS = ['En attente', 'Confirmée', 'Préparation', 'Prête', 'Expédiée', 'Livrée'];

const STATUS_CONFIGS = {
  'En attente': { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', icon: Clock, desc: 'Votre commande est en cours de validation.' },
  'Confirmée': { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', icon: CheckCircle2, desc: 'Commande confirmée par ADY Store.' },
  'Préparation': { color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', icon: Package, desc: 'Nous préparons votre colis avec soin.' },
  'Prête': { color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', icon: Box, desc: 'Votre colis est prêt à être expédié.' },
  'Expédiée': { color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', icon: Truck, desc: 'Colis en cours de livraison via Yalidine.' },
  'Livrée': { color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', icon: Check, desc: 'Commande livrée avec succès !' },
  'Annulée': { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', icon: AlertCircle, desc: 'Commande annulée.' }
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) fetchOrder();
  }, [id, user]);

  const handlePrint = () => {
    if (!order) return;
    printInvoice(order);
  };

  const handleDownloadPDF = async () => {
    if (!order) return;
    try {
      await generatePDF(order);
    } catch (err) {
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gaming-bg">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-gaming-purple rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(176,38,255,0.5)]" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gaming-bg px-4">
        <div className="glass-premium p-10 rounded-3xl border border-white/10 text-center max-w-md w-full">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white font-orbitron uppercase tracking-widest mb-3">Commande introuvable</h2>
          <p className="text-gray-400 text-sm mb-8">Les données de cette commande sont inaccessibles ou n'existent pas.</p>
          <Link to="/profile" className="inline-block bg-gaming-purple text-white font-bold px-6 py-3 rounded-xl uppercase text-xs tracking-widest font-orbitron hover:bg-gaming-blue transition-colors">
            Retour au Profil
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Annulée';

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-gaming-bg print:bg-white print:py-0 print:px-0">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none print:hidden" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gaming-blue/10 rounded-full blur-[150px] pointer-events-none print:hidden" />

      {/* Hidden A4 Invoice Print Area */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="invoice-print-area" style={{ width: '210mm', padding: '20mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '2px solid #e2e8f0', paddingBottom: '8mm', marginBottom: '8mm' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/ady-logo.png" alt="Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
                <h1 style={{ fontSize: '26px', fontWeight: '900', margin: 0, letterSpacing: '1px' }}>ADY STORE</h1>
              </div>
              <p style={{ fontSize: '12px', color: '#4a5568', marginTop: '5px', marginBottom: 0 }}>Matériel High-Tech & Gaming Premium</p>
              <p style={{ fontSize: '10px', color: '#718096', margin: '2px 0 0 0' }}>16 Rue Didouche Mourad, Alger Centre</p>
              <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>Email: contact@adystore.com | Tel: 0555 123 456</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#1a202c' }}>FACTURE</h2>
              <p style={{ fontSize: '11px', color: '#4a5568', margin: '5px 0 0 0' }}>N°: FAC-{order._id.substring(0, 8).toUpperCase()}</p>
              <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>Réf: #{order._id.toString().toUpperCase()}</p>
              <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>Date: {new Date(order.createdAt).toLocaleDateString('fr-DZ')}</p>
              <p style={{ fontSize: '10px', color: '#718096', margin: 0 }}>Paiement: Cash à la livraison</p>
            </div>
          </div>

          {/* Details Row */}
          <div style={{ display: 'flex', gap: '15mm', marginBottom: '8mm' }}>
            <div style={{ flex: 1, backgroundColor: '#f7fafc', padding: '4mm', borderRadius: '8px', border: '1px solid #edf2f7' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 8px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', color: '#4a5568' }}>INFORMATIONS CLIENT</h3>
              <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{order.shippingAddress.prenom} {order.shippingAddress.nom}</p>
              <p style={{ fontSize: '10px', color: '#4a5568', margin: '0 0 3px 0' }}>Tél: {order.shippingAddress.telephone}</p>
              <p style={{ fontSize: '10px', color: '#4a5568', margin: 0 }}>Email: {order.shippingAddress.email || user.email}</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f7fafc', padding: '4mm', borderRadius: '8px', border: '1px solid #edf2f7' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 8px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', color: '#4a5568' }}>EXPÉDITION & RETRAIT</h3>
              <p style={{ fontSize: '10px', color: '#4a5568', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Mode :</span> {order.shippingAddress.deliveryMethod === 'Home' ? 'Livraison à Domicile' : 'Retrait Bureau Yalidine'}</p>
              <p style={{ fontSize: '10px', color: '#4a5568', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Lieu :</span> {order.shippingAddress.commune}, {order.shippingAddress.wilaya}</p>
              <p style={{ fontSize: '10px', color: '#4a5568', margin: 0 }}><span style={{ fontWeight: '600' }}>Adresse :</span> {order.shippingAddress.adresse}</p>
              {order.shippingAddress.postalCode && <p style={{ fontSize: '10px', color: '#4a5568', margin: '3px 0 0 0' }}><span style={{ fontWeight: '600' }}>Code Postal :</span> {order.shippingAddress.postalCode}</p>}
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8mm' }}>
            <thead>
              <tr style={{ backgroundColor: '#edf2f7', borderBottom: '2px solid #cbd5e0' }}>
                <th style={{ textAlign: 'left', padding: '3mm', fontSize: '10px', fontWeight: '700' }}>ARTICLE</th>
                <th style={{ textAlign: 'center', padding: '3mm', fontSize: '10px', fontWeight: '700', width: '30mm' }}>P.U</th>
                <th style={{ textAlign: 'center', padding: '3mm', fontSize: '10px', fontWeight: '700', width: '15mm' }}>QTÉ</th>
                <th style={{ textAlign: 'right', padding: '3mm', fontSize: '10px', fontWeight: '700', width: '30mm' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '3mm', fontSize: '10px' }}>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    {item.color && <div style={{ fontSize: '8px', color: '#718096', marginTop: '2px' }}>Couleur: {item.color}</div>}
                  </td>
                  <td style={{ padding: '3mm', fontSize: '10px', textAlign: 'center' }}>{item.price.toLocaleString('fr-DZ')} DA</td>
                  <td style={{ padding: '3mm', fontSize: '10px', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '3mm', fontSize: '10px', textAlign: 'right', fontWeight: '600' }}>{(item.price * item.qty).toLocaleString('fr-DZ')} DA</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing breakdown */}
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <div style={{ width: '70mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '1.5mm 0', color: '#4a5568' }}>
                <span>Sous-total</span>
                <span>{order.itemsPrice.toLocaleString('fr-DZ')} DA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '1.5mm 0', color: '#4a5568' }}>
                <span>Frais de livraison</span>
                <span>{order.shippingPrice.toLocaleString('fr-DZ')} DA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', borderTop: '2px solid #cbd5e0', padding: '3mm 0', color: '#1a202c' }}>
                <span>TOTAL</span>
                <span>{order.totalPrice.toLocaleString('fr-DZ')} DA</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ borderTop: '1px solid #cbd5e0', paddingTop: '6mm', marginTop: '10mm', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Merci pour votre commande chez ADY Store !</p>
            <p style={{ fontSize: '9px', color: '#718096', margin: 0 }}>Pour toute réclamation, veuillez contacter le support muni de votre numéro de facture.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        
        {/* Back & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
          <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour Profil
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-gaming-purple/20 hover:bg-gaming-purple text-white font-orbitron font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-xl border border-gaming-purple transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Télécharger PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-orbitron font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-xl border border-white/10 hover:border-gaming-cyan transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimer
            </button>
          </div>
        </div>

        {/* Invoice ID Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-black text-white font-orbitron uppercase tracking-widest flex items-center gap-3">
              Commande <span className="text-gaming-cyan">#{order._id.substring(0, 8).toUpperCase()}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Passée le {new Date(order.createdAt).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Tracking Stepper */}
            {!isCancelled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-premium rounded-2xl p-8 border border-white/10 print:hidden relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gaming-purple to-transparent opacity-50" />
                
                <h2 className="text-sm font-orbitron font-black text-white uppercase tracking-widest flex items-center gap-2 mb-10">
                  <Truck className="w-5 h-5 text-gaming-purple" /> État de Déploiement Yalidine
                </h2>

                <div className="relative flex justify-between items-center w-full mt-4 pb-8 px-4 sm:px-8">
                  {/* Background Line */}
                  <div className="absolute top-5 left-10 right-10 h-1.5 bg-black rounded-full z-0 border border-white/5" />
                  
                  {/* Active Progress Line */}
                  <div
                    className="absolute top-5 left-10 h-1.5 bg-gradient-to-r from-gaming-purple to-gaming-cyan rounded-full z-0 transition-all duration-1000 shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                    style={{ width: `calc(${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}% - 40px)` }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <div key={step} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative bg-gaming-bg
                            ${isCompleted ? 'border-gaming-cyan text-gaming-cyan shadow-[0_0_20px_rgba(0,229,255,0.3)]' : 'border-white/10 text-gray-600'}
                          `}
                        >
                          {isActive && <div className="absolute inset-0 bg-gaming-cyan/20 rounded-full animate-ping" />}
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 relative z-10" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] mt-3 font-orbitron tracking-widest uppercase absolute top-12 whitespace-nowrap transition-colors
                            ${isActive ? 'text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : isCompleted ? 'text-gray-400 font-bold' : 'text-gray-600'}
                          `}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {isCancelled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 flex items-center gap-4 print:hidden"
              >
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold uppercase tracking-widest text-sm mb-1 text-red-300">Commande Annulée</h3>
                  <p className="text-sm">Cette commande a été annulée. N'hésitez pas à nous contacter si besoin.</p>
                </div>
              </motion.div>
            )}

            {/* Standard client display for Order info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
              <div className="glass-premium rounded-2xl p-6 border border-white/10">
                <h3 className="text-xs font-orbitron font-bold mb-4 uppercase tracking-widest flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 text-gaming-purple" /> Coordonnées de Livraison
                </h3>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="font-bold text-white mb-2">{order.shippingAddress.prenom} {order.shippingAddress.nom}</div>
                  <div className="space-y-1.5 text-sm text-gray-400">
                    <div className="flex justify-between"><span className="text-gray-500">Tél :</span> <span className="text-white font-bold">{order.shippingAddress.telephone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Email :</span> <span className="text-white">{order.shippingAddress.email || user.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Mode :</span> <span className="text-white">{order.shippingAddress.deliveryMethod === 'Home' ? 'À Domicile' : 'Bureau Yalidine'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Lieu :</span> <span className="text-white">{order.shippingAddress.commune}, {order.shippingAddress.wilaya}</span></div>
                    <div className="pt-2 mt-2 border-t border-white/5">
                      <p className="text-xs text-gray-500 font-bold mb-1">Adresse complète :</p>
                      <p className="text-xs text-gray-400">{order.shippingAddress.adresse}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-premium rounded-2xl p-6 border border-white/10">
                <h3 className="text-xs font-orbitron font-bold mb-4 uppercase tracking-widest flex items-center gap-2 text-white">
                  <CreditCard className="w-4 h-4 text-gaming-cyan" /> Transaction & Paiement
                </h3>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5 h-[178px] flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-white mb-2">
                      {order.paymentMethod === 'Cash On Delivery' ? 'Paiement à la Livraison (Cash)' : 'Carte Bancaire / CIB'}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Le règlement s'effectue en monnaie locale (DZD) au moment de la réception de la marchandise.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gaming-cyan" />
                    <span className="text-[10px] text-gray-400">Garanti ADY Store officiel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="glass-premium rounded-2xl p-6 border border-white/10 print:hidden">
              <h3 className="text-xs font-orbitron font-bold mb-6 uppercase tracking-widest flex items-center gap-2 text-white">
                <Box className="w-4 h-4 text-white" /> Articles de la Commande
              </h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-4 items-center transition-colors hover:bg-white/5">
                    <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 relative border border-white/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-gaming-cyan">Qté : {item.qty}</span>
                        <span className="text-gray-600 text-xs">×</span>
                        <span className="text-xs text-gray-400">{item.price.toLocaleString('fr-DZ')} DA</span>
                        {item.color && (
                          <>
                            <span className="text-gray-600 text-xs">|</span>
                            <span className="text-xs text-gray-400 uppercase">Couleur: {item.color}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="font-orbitron font-black text-sm text-white whitespace-nowrap">
                      {(item.price * item.qty).toLocaleString('fr-DZ')} <span className="text-[10px] text-gaming-purple">DA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Total Summary */}
          <div className="lg:col-span-1 print:hidden">
            <div className="glass-premium rounded-2xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-sm font-orbitron font-black mb-6 text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-5 h-5 text-gaming-blue" /> Bilan Financier
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Sous-total</span>
                  <span className="text-white font-bold font-orbitron">{order.itemsPrice.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Frais de livraison</span>
                  <span className="text-white font-bold font-orbitron">{order.shippingPrice.toLocaleString('fr-DZ')} DA</span>
                </div>
                
                <div className="border-t border-white/10 my-4" />
                
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-300 uppercase tracking-widest text-xs">Total Facture</span>
                  <div className="text-right">
                    <span className="font-black text-2xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan to-gaming-blue">
                      {order.totalPrice.toLocaleString('fr-DZ')}
                    </span>
                    <span className="text-xs font-bold text-gaming-cyan ml-1">DZD</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl border flex flex-col items-center justify-center text-center bg-black/50 border-white/10 relative overflow-hidden">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Statut Actuel</p>
                <div className={`font-orbitron font-black uppercase tracking-widest text-sm flex items-center gap-2 ${
                  isCancelled ? 'text-red-500' : 
                  order.status === 'Livrée' ? 'text-green-500' :
                  'text-gaming-cyan'
                }`}>
                  {order.status}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                  {STATUS_CONFIGS[order.status]?.desc || ''}
                </p>
              </div>

              <div className="mt-6 bg-gaming-purple/5 border border-gaming-purple/20 rounded-xl p-4 text-xs text-gray-400 text-center leading-relaxed">
                Merci pour votre confiance ! <br/>L'équipe <span className="font-bold text-white">ADY STORE</span> reste à votre disposition.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
