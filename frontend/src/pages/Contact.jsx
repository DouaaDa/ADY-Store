import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      return toast.error('Veuillez remplir tous les champs');
    }
    setLoading(true);
    try {
      await axios.post('/api/messages', form);
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gaming-blue/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gaming-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gaming-purple/20 to-gaming-blue/20 border border-white/10 flex items-center justify-center box-glow-blue"
          >
            <MessageSquare className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white font-orbitron uppercase tracking-widest mb-4"
          >
            Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-cyan to-gaming-blue">Nous</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base font-medium"
          >
            Besoin de renfort ou d'assistance technique ? L'équipe ADY Store est prête à intervenir.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass-premium rounded-2xl p-6 flex items-start gap-5 group border border-white/10 hover:border-gaming-cyan/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gaming-cyan/10 border border-gaming-cyan/30 flex items-center justify-center text-gaming-cyan group-hover:scale-110 group-hover:bg-gaming-cyan/20 transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-white mb-1 uppercase tracking-widest text-sm">Transmission</h3>
                <p className="text-gaming-cyan font-bold text-sm mb-1">contact@adystore.com</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Réponse sous 24h</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="glass-premium rounded-2xl p-6 flex items-start gap-5 group border border-white/10 hover:border-gaming-blue/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gaming-blue/10 border border-gaming-blue/30 flex items-center justify-center text-gaming-blue group-hover:scale-110 group-hover:bg-gaming-blue/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-white mb-1 uppercase tracking-widest text-sm">Ligne Directe</h3>
                <p className="text-gaming-blue font-bold text-sm mb-1">0555 123 456</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sam - Jeu : 9h - 18h</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="glass-premium rounded-2xl p-6 flex items-start gap-5 group border border-white/10 hover:border-gaming-purple/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gaming-purple/10 border border-gaming-purple/30 flex items-center justify-center text-gaming-purple group-hover:scale-110 group-hover:bg-gaming-purple/20 transition-all shadow-[0_0_15px_rgba(176,38,255,0.1)]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-white mb-1 uppercase tracking-widest text-sm">Quartier Général</h3>
                <p className="text-gray-300 text-sm mb-2">Rue Didouche Mourad, Alger Centre, Algérie</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Boutique physique et retrait</p>
              </div>
            </motion.div>
          </div>

          {/* Message Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-premium rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gaming-blue to-transparent opacity-50" />
              
              <h2 className="text-xl font-orbitron font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-1 bg-gaming-blue rounded-full"></span>
                Envoyer une requête
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre Nom</label>
                    <input
                      type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-gaming-blue focus:ring-1 focus:ring-gaming-blue transition-all placeholder-gray-600 font-medium"
                      placeholder="Identifiant"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre Email</label>
                    <input
                      type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-gaming-blue focus:ring-1 focus:ring-gaming-blue transition-all placeholder-gray-600 font-medium"
                      placeholder="joueur@exemple.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sujet de la transmission</label>
                  <input
                    type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-gaming-blue focus:ring-1 focus:ring-gaming-blue transition-all placeholder-gray-600 font-medium"
                    placeholder="Ex: Question sur le stock"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contenu du message</label>
                  <textarea
                    required rows="6" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-gaming-blue focus:ring-1 focus:ring-gaming-blue transition-all placeholder-gray-600 font-medium resize-none"
                    placeholder="Détaillez votre requête ici..."
                  ></textarea>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-gaming-cyan to-gaming-blue hover:from-gaming-cyan/90 hover:to-gaming-blue/90 text-black font-orbitron font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] group/btn"
                >
                  {loading ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" /> Envoi en cours...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> 
                      Envoyer la transmission
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
