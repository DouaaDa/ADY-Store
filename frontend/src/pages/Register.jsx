import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from '../store/authSlice';
import { toast } from 'react-toastify';
import { Loader2, Store, User, Mail, Lock, Phone, MapPin, ChevronRight, UserPlus } from 'lucide-react';

const WILAYAS = [
  { code: '01', name: 'Adrar' }, { code: '02', name: 'Chlef' }, { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' }, { code: '05', name: 'Batna' }, { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' }, { code: '08', name: 'Béchar' }, { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' }, { code: '11', name: 'Tamanrasset' }, { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' }, { code: '14', name: 'Tiaret' }, { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger' }, { code: '17', name: 'Djelfa' }, { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' }, { code: '20', name: 'Saïda' }, { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' }, { code: '23', name: 'Annaba' }, { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' }, { code: '26', name: 'Médéa' }, { code: '27', name: 'Mostaganem' },
  { code: '28', name: 'M\'Sila' }, { code: '29', name: 'Mascara' }, { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' }, { code: '32', name: 'El Bayadh' }, { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' }, { code: '35', name: 'Boumerdès' }, { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' }, { code: '38', name: 'Tissemsilt' }, { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' }, { code: '41', name: 'Souk Ahras' }, { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' }, { code: '44', name: 'Aïn Defla' }, { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' }, { code: '47', name: 'Ghardaïa' }, { code: '48', name: 'Relizane' },
  { code: '49', name: 'El M\'Ghair' }, { code: '50', name: 'El Menia' }, { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Bordj Baji Mokhtar' }, { code: '53', name: 'Béni Abbès' }, { code: '54', name: 'Timimoun' },
  { code: '55', name: 'Touggourt' }, { code: '56', name: 'Djanet' }, { code: '57', name: 'In Salah' }, { code: '58', name: 'In Guezzam' },
];

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password", "");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess || user) {
      toast.success('Compte créé avec succès ! Bienvenue 🎮');
      navigate('/');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gaming-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 gaming-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gaming-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gaming-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full relative z-10"
      >
        <div className="glass-premium rounded-2xl p-8 lg:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Subtle animated border top */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gaming-cyan to-transparent opacity-50" />
          
          <div className="text-center mb-10 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group/logo">
              <div className="relative group-hover/logo:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gaming-cyan/10 rounded-xl blur-md group-hover/logo:bg-gaming-cyan/20 transition-colors duration-500" />
                <img
                  src="/ady-logo.png"
                  alt="ADY Store"
                  className="relative h-12 w-auto object-contain rounded-xl drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                />
              </div>
              <div className="text-left leading-none">
                <span className="block font-orbitron text-2xl font-black tracking-tighter text-white text-glow-blue">ADY</span>
                <span className="block text-[10px] font-bold tracking-[0.4em] text-gaming-purple uppercase mt-1">Store</span>
              </div>
            </Link>
            
            <h1 className="text-2xl font-black text-white font-orbitron uppercase tracking-widest">
              Créer un Compte
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Rejoignez l'élite et accédez au meilleur matériel gaming
            </p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Infos Personnelles */}
            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-xs font-orbitron font-bold text-gaming-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Informations Personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nom</label>
                  <input type="text" {...register("nom", { required: "Le nom est requis" })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                    placeholder="Votre nom" disabled={isLoading} />
                  {errors.nom && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.nom.message}</span>}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Prénom</label>
                  <input type="text" {...register("prenom", { required: "Le prénom est requis" })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                    placeholder="Votre prénom" disabled={isLoading} />
                  {errors.prenom && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.prenom.message}</span>}
                </div>
              </div>
            </div>

            {/* Identifiants */}
            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-xs font-orbitron font-bold text-gaming-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Sécurité & Contact
              </h3>
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Adresse Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-500" /></div>
                    <input type="email" {...register("email", { required: "L'email est requis", pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                      placeholder="joueur@exemple.com" disabled={isLoading} />
                  </div>
                  {errors.email && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.email.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mot de Passe</label>
                    <input type="password" {...register("password", { required: "Requis", minLength: { value: 6, message: "Minimum 6 caractères" } })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                      placeholder="••••••••" disabled={isLoading} />
                    {errors.password && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.password.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmer</label>
                    <input type="password" {...register("confirmPassword", { required: "Requis", validate: value => value === password || "Les mots de passe ne correspondent pas" })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                      placeholder="••••••••" disabled={isLoading} />
                    {errors.confirmPassword && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.confirmPassword.message}</span>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Téléphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-gray-500" /></div>
                    <input type="tel" {...register("telephone", { required: "Requis" })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                      placeholder="05XXXXXXXX" disabled={isLoading} />
                  </div>
                  {errors.telephone && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.telephone.message}</span>}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-xs font-orbitron font-bold text-gaming-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Adresse de Livraison
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Wilaya</label>
                    <select {...register("wilaya", { required: "La wilaya est requise" })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all"
                      disabled={isLoading}>
                      <option value="" className="bg-gray-900">Sélectionner</option>
                      {WILAYAS.map(w => (
                        <option key={w.code} value={w.code} className="bg-gray-900">{w.code} - {w.name}</option>
                      ))}
                    </select>
                    {errors.wilaya && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.wilaya.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Commune</label>
                    <input type="text" {...register("commune", { required: "La commune est requise" })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all placeholder-gray-600"
                      placeholder="Votre commune" disabled={isLoading} />
                    {errors.commune && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.commune.message}</span>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Adresse Complète</label>
                  <textarea {...register("adresse", { required: "L'adresse est requise" })} rows="2"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-cyan focus:ring-1 focus:ring-gaming-cyan transition-all resize-none placeholder-gray-600"
                    placeholder="Rue, numéro, quartier..." disabled={isLoading} />
                  {errors.adresse && <span className="text-red-400 text-[10px] uppercase font-bold mt-1 block">{errors.adresse.message}</span>}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-gaming-cyan to-gaming-blue hover:from-gaming-cyan/90 hover:to-gaming-blue/90 text-black font-orbitron font-black text-sm uppercase tracking-widest py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] mt-4">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Création du compte...</>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  S'inscrire
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm relative z-10">
            <span className="text-gray-400">Déjà un compte ? </span>
            <Link to="/login" className="font-bold text-gaming-purple hover:text-white transition-colors uppercase tracking-wider text-xs">
              Se Connecter
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
