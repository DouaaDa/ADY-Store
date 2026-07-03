import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reset } from '../store/authSlice';
import { toast } from 'react-toastify';
import { Loader2, Store, Mail, Lock, LogIn, ChevronRight } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess || user) {
      navigate('/');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gaming-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gaming-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="glass-premium rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          {/* Subtle animated border top */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gaming-purple to-transparent opacity-50" />
          
          <div className="text-center mb-8 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group/logo">
              <div className="relative group-hover/logo:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gaming-purple/10 rounded-xl blur-md group-hover/logo:bg-gaming-purple/20 transition-colors duration-500" />
                <img
                  src="/ady-logo.png"
                  alt="ADY Store"
                  className="relative h-12 w-auto object-contain rounded-xl drop-shadow-[0_0_10px_rgba(176,38,255,0.4)]"
                />
              </div>
              <div className="text-left leading-none">
                <span className="block font-orbitron text-2xl font-black tracking-tighter text-white text-glow-pink">ADY</span>
                <span className="block text-[10px] font-bold tracking-[0.4em] text-gaming-cyan uppercase mt-1">Store</span>
              </div>
            </Link>
            
            <h1 className="text-2xl font-black text-white font-orbitron uppercase tracking-widest">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Content de vous revoir. Prêt à reprendre la partie ?
            </p>
          </div>

          <form className="space-y-5 relative z-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-orbitron">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  {...register("email", { required: "L'email est requis" })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-gaming-purple focus:ring-1 focus:ring-gaming-purple transition-all placeholder-gray-600 font-medium"
                  placeholder="joueur@exemple.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="text-red-400 text-xs mt-1 block font-bold">{errors.email.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-orbitron">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  {...register("password", { required: "Le mot de passe est requis" })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-gaming-purple focus:ring-1 focus:ring-gaming-purple transition-all placeholder-gray-600 font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <span className="text-red-400 text-xs mt-1 block font-bold">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gaming-purple to-gaming-blue hover:from-gaming-purple/90 hover:to-gaming-blue/90 text-white font-orbitron font-black text-sm uppercase tracking-widest py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_30px_rgba(176,38,255,0.5)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se Connecter
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm relative z-10">
            <span className="text-gray-400">Nouveau joueur ? </span>
            <Link to="/register" className="font-bold text-gaming-cyan hover:text-white transition-colors uppercase tracking-wider text-xs">
              Créer un compte
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
