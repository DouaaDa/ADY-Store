import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Percent, CheckCircle, XCircle, Calendar, Upload, Tag } from 'lucide-react';

const PromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    description: '',
    bannerUrl: '',
    percentage: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    products: []
  };

  const [formData, setFormData] = useState(initialFormState);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get('/api/promotions/admin', config);
      setPromotions(data);
    } catch {
      toast.error('Erreur lors du chargement des promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch {}
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  const uploadBannerHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);
    try {
      const uploadConfig = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/upload', bodyFormData, uploadConfig);
      setFormData(prev => ({ ...prev, bannerUrl: data.url }));
      toast.success('Image uploadée');
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      if (editingPromotion) {
        await axios.put(`/api/promotions/${editingPromotion._id}`, payload, config);
        toast.success('Promotion mise à jour');
      } else {
        await axios.post('/api/promotions', payload, config);
        toast.success('Promotion créée');
      }
      setModalOpen(false);
      setEditingPromotion(null);
      setFormData(initialFormState);
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette promotion ?')) {
      try {
        await axios.delete(`/api/promotions/${id}`, config);
        toast.success('Promotion supprimée');
        fetchPromotions();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (promo) => {
    setEditingPromotion(promo);
    setFormData({
      title: promo.title || '',
      description: promo.description || '',
      bannerUrl: promo.bannerUrl || '',
      percentage: promo.percentage || 0,
      startDate: promo.startDate ? promo.startDate.substring(0, 10) : '',
      endDate: promo.endDate ? promo.endDate.substring(0, 10) : '',
      isActive: promo.isActive,
      products: promo.products?.map(p => p._id || p) || []
    });
    setModalOpen(true);
  };

  const toggleActive = async (promo) => {
    try {
      await axios.put(`/api/promotions/${promo._id}`, { isActive: !promo.isActive }, config);
      toast.success(`Promotion ${!promo.isActive ? 'activée' : 'désactivée'}`);
      fetchPromotions();
    } catch {
      toast.error('Erreur');
    }
  };

  const isPromoActive = (promo) => {
    if (!promo.isActive) return false;
    const now = new Date();
    if (promo.startDate && new Date(promo.startDate) > now) return false;
    if (promo.endDate && new Date(promo.endDate) < now) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-gaming-purple rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="font-orbitron text-sm text-gray-500 uppercase tracking-widest animate-pulse">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-wider mb-2">Promotions</h1>
          <p className="text-gray-400 text-sm">Black Friday, Gaming Week, Rentrée scolaire...</p>
        </div>
        <button onClick={() => { setEditingPromotion(null); setFormData(initialFormState); setModalOpen(true); }}
          className="btn-gaming bg-gaming-purple hover:bg-gaming-purple/90 text-white px-6 py-3 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Promotion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {promotions.map((promo, i) => {
          const active = isPromoActive(promo);
          return (
            <motion.div key={promo._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-premium rounded-2xl overflow-hidden border ${active ? 'border-gaming-purple/30' : 'border-white/10 opacity-70'} transition-all hover:border-gaming-purple/60 group`}>
              
              {promo.bannerUrl && (
                <div className="h-36 overflow-hidden relative">
                  <img src={promo.bannerUrl} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {promo.percentage > 0 && (
                    <div className="absolute top-3 left-3 bg-gaming-purple/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-orbitron font-black flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" /> -{promo.percentage}%
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white mb-1">{promo.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{promo.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gaming-cyan" />
                  <span>{promo.startDate ? new Date(promo.startDate).toLocaleDateString() : '∞'} → {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : '∞'}</span>
                </div>

                {promo.products?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Tag className="w-3.5 h-3.5 text-gaming-blue" />
                    <span>{promo.products.length} produit(s) inclus</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <button onClick={() => toggleActive(promo)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'}`}>
                    {active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => handleEdit(promo)} className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(promo._id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {promotions.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <Percent className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-orbitron text-white mb-2">Aucune promotion</h3>
            <p className="text-gray-400 text-sm">Créez votre première promotion</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gaming-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
              <h2 className="text-2xl font-orbitron font-black text-white uppercase mb-6">{editingPromotion ? 'Modifier' : 'Nouvelle'} Promotion</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bannière</label>
                  <div className="flex gap-4 items-end">
                    <input type="text" name="bannerUrl" value={formData.bannerUrl} onChange={handleInputChange} placeholder="URL de la bannière" className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-purple" />
                    <input type="file" ref={fileInputRef} onChange={uploadBannerHandler} className="hidden" accept="image/*" />
                    <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="btn-gaming bg-white/5 hover:bg-white/10 text-white px-4 py-3 flex items-center gap-2 border border-white/10">
                      {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Upload</span>
                    </button>
                  </div>
                  {formData.bannerUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden bg-black/50 border border-white/10 h-32">
                      <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pourcentage (%)</label>
                    <input type="number" name="percentage" value={formData.percentage} onChange={handleInputChange} min="0" max="99" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-purple" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-purple" />
                </div>

                <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date début</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gaming-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date fin</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gaming-purple" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Produits inclus ({formData.products.length} sélectionné(s))</label>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar bg-black/50 rounded-xl border border-white/10 p-3 space-y-1">
                    {products.map(product => (
                      <label key={product._id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.products.includes(product._id) ? 'bg-gaming-purple/10 border border-gaming-purple/20' : 'hover:bg-white/5 border border-transparent'}`}>
                        <input type="checkbox" checked={formData.products.includes(product._id)} onChange={() => handleProductToggle(product._id)} className="accent-gaming-purple w-4 h-4" />
                        <span className="text-sm text-white truncate">{product.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{product.price?.toLocaleString()} DA</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-purple"></div>
                  </label>
                  <span className="text-sm font-bold text-white">Promotion Active</span>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors">Annuler</button>
                  <button type="submit" className="btn-gaming bg-gaming-purple hover:bg-gaming-purple/90 text-white px-6 py-3">{editingPromotion ? 'Mettre à jour' : 'Créer'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionManager;
