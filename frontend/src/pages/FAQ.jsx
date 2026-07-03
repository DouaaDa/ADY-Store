import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, FileQuestion, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    question: "Comment puis-je suivre l'état de ma commande ?",
    answer: "Une fois votre commande passée, vous pouvez suivre son état en temps réel depuis votre profil dans l'onglet 'Mes Commandes'. L'état passera de 'En attente' à 'Confirmée', puis 'Préparation', 'Expédiée' et enfin 'Livrée'."
  },
  {
    question: "Quels sont les délais et tarifs de livraison en Algérie ?",
    answer: "Nous livrons sur l'ensemble des 58 wilayas d'Algérie. Le tarif standard est fixe à 700 DA. Les délais de livraison varient de 24h à 48h pour Alger et le centre, et de 3 à 5 jours pour les wilayas plus éloignées."
  },
  {
    question: "Puis-je annuler ma commande ?",
    answer: "Oui, vous pouvez annuler votre commande tant qu'elle est à l'état 'En attente' ou 'Confirmée'. Pour ce faire, veuillez contacter notre service client par téléphone ou via le formulaire de contact."
  },
  {
    question: "Comment fonctionnent les codes de réduction (coupons) ?",
    answer: "Si vous disposez d'un code de réduction, vous pouvez le saisir lors de l'étape de finalisation de votre commande (Checkout). La réduction correspondante sera immédiatement déduite du montant total de vos achats si le montant minimum d'achat est respecté."
  },
  {
    question: "Quel type de garantie offrez-vous sur vos produits ?",
    answer: "Tous nos équipements et composants gaming (souris, claviers, écrans, etc.) sont neufs et bénéficient d'une garantie constructeur ou magasin de 12 mois à compter de la date d'achat contre tout défaut de fabrication."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleIndex = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gaming-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gaming-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gaming-purple/20 to-gaming-cyan/20 border border-white/10 flex items-center justify-center box-glow-purple"
          >
            <FileQuestion className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white font-orbitron uppercase tracking-widest mb-4"
          >
            Foire Aux <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple to-gaming-cyan">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base font-medium"
          >
            Base de connaissances. Retrouvez les réponses aux interrogations les plus fréquentes.
          </motion.p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.05) }}
                className={`glass-premium rounded-2xl overflow-hidden border transition-colors duration-300 ${isOpen ? 'border-gaming-purple/50 bg-black/60 shadow-[0_0_30px_rgba(176,38,255,0.1)]' : 'border-white/10 hover:border-white/20 hover:bg-black/40'}`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left font-bold text-white group"
                >
                  <span className="flex items-center gap-4 text-sm md:text-base pr-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-gaming-purple text-white' : 'bg-white/5 text-gray-500 group-hover:text-gaming-purple group-hover:bg-gaming-purple/10'}`}>
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-white/10' : 'bg-transparent'}`}
                  >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-gaming-purple' : 'text-gray-500'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-12 border-l-2 border-gaming-purple/30">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 glass-premium rounded-3xl p-8 md:p-12 border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple/10 to-gaming-cyan/10 opacity-50" />
          <div className="relative z-10">
            <MessageCircle className="w-12 h-12 text-gaming-cyan mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-widest mb-3">Toujours besoin d'aide ?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm">
              Si vous n'avez pas trouvé la réponse à votre question, notre équipe de support technique se fera un plaisir de vous aider.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-black font-orbitron font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Contacter le Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
