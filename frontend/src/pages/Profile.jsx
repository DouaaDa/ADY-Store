import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders } from '../store/orderSlice';
import { Package, User, MapPin, Heart, Shield, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { myOrders, loading } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchMyOrders());
    }
  }, [user, navigate, dispatch]);

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gaming-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gaming-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-4"
        >
          <Shield className="w-10 h-10 text-gaming-purple" />
          <div>
            <h1 className="text-3xl font-black text-white font-orbitron uppercase tracking-widest">
              Mon Quartier Général
            </h1>
            <p className="text-sm text-gray-400 mt-1">Gérez votre profil et suivez vos équipements</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-premium p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gaming-purple to-gaming-cyan opacity-50" />
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gaming-purple/30 rounded-full blur-md group-hover:bg-gaming-purple/50 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-black border-2 border-gaming-purple/50 flex items-center justify-center text-xl font-orbitron font-black text-white relative z-10">
                    {user.nom?.[0]}{user.prenom?.[0]}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-gaming-cyan transition-colors">{user.prenom} {user.nom}</h2>
                  <p className="text-gray-400 text-xs font-orbitron tracking-wider">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gaming-purple/50 transition-all group/btn">
                  <span className="flex items-center gap-3 text-sm font-bold text-gray-300 group-hover/btn:text-white">
                    <User className="w-4 h-4 text-gaming-purple" /> Informations
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover/btn:text-gaming-purple group-hover/btn:translate-x-1 transition-all" />
                </button>
                <button className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gaming-cyan/50 transition-all group/btn">
                  <span className="flex items-center gap-3 text-sm font-bold text-gray-300 group-hover/btn:text-white">
                    <MapPin className="w-4 h-4 text-gaming-cyan" /> Adresses
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover/btn:text-gaming-cyan group-hover/btn:translate-x-1 transition-all" />
                </button>
                <button onClick={() => navigate('/wishlist')} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/50 transition-all group/btn">
                  <span className="flex items-center gap-3 text-sm font-bold text-gray-300 group-hover/btn:text-white">
                    <Heart className="w-4 h-4 text-red-500" /> Favoris
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover/btn:text-red-500 group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
            
            {/* Quick Stats (Optional aesthetic addition) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-premium p-4 rounded-xl border border-white/10 text-center">
                <p className="text-2xl font-orbitron font-black text-gaming-cyan">{myOrders?.length || 0}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Commandes</p>
              </div>
              <div className="glass-premium p-4 rounded-xl border border-white/10 text-center">
                <p className="text-2xl font-orbitron font-black text-gaming-purple">0</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Avis Laisées</p>
              </div>
            </div>
          </motion.div>
          
          {/* Order History */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-premium p-6 md:p-8 rounded-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-orbitron font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Package className="text-gaming-blue w-6 h-6" /> Historique d'Équipement
              </h3>
              {myOrders?.length > 0 && (
                <span className="text-xs font-bold text-gray-500 bg-black/50 px-3 py-1 rounded-full border border-white/5">
                  {myOrders.length} Commande{myOrders.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse border border-white/5"></div>
                ))}
              </div>
            ) : myOrders?.length > 0 ? (
              <div className="space-y-4">
                {myOrders.map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    key={order._id} 
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="p-5 bg-black/40 hover:bg-white/5 rounded-xl border border-white/5 hover:border-gaming-blue/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gaming-blue/10 border border-gaming-blue/20 flex items-center justify-center text-gaming-blue group-hover:scale-110 group-hover:bg-gaming-blue/20 transition-all">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-orbitron font-bold text-sm text-white group-hover:text-gaming-cyan transition-colors">
                          CMD-{order._id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-2 md:mt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total</p>
                        <p className="font-orbitron font-black text-gaming-blue">{order.totalPrice.toLocaleString('fr-DZ')} DA</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                          order.status === 'Livrée' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          order.status === 'Expédiée' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          order.status === 'Annulée' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/20 rounded-xl border border-white/5">
                <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-white font-bold mb-2">Aucune commande pour le moment</p>
                <p className="text-gray-500 text-sm mb-6">Votre arsenal est encore vide. Parcourez la boutique pour vous équiper.</p>
                <button onClick={() => navigate('/products')} className="bg-gaming-purple hover:bg-gaming-blue text-white font-orbitron text-xs uppercase tracking-widest px-6 py-3 rounded-lg font-bold transition-colors">
                  Explorer la Boutique
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
