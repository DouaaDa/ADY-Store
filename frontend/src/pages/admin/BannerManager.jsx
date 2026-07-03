import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle, XCircle, ArrowUp, ArrowDown, Calendar, Link as LinkIcon, Upload } from 'lucide-react';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    subtitle: '',
    buttonText: '',
    link: '',
    mediaUrl: '',
    mediaType: 'image',
    isEnabled: true,
    order: 0,
    startDate: '',
    endDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchBanners = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/banners/admin', config);
      setBanners(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des bannières');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post('/api/upload', bodyFormData, config);
      setFormData(prev => ({ 
        ...prev, 
        mediaUrl: data.url,
        mediaType: file.type.startsWith('video') ? 'video' : 'image'
      }));
      toast.success('Fichier uploadé avec succès');
    } catch (error) {
      toast.error("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = { ...formData };
      if (payload.startDate === '') delete payload.startDate;
      if (payload.endDate === '') delete payload.endDate;

      if (editingBanner) {
        await axios.put(`/api/banners/${editingBanner._id}`, payload, config);
        toast.success('Bannière mise à jour');
      } else {
        await axios.post('/api/banners', payload, config);
        toast.success('Bannière créée');
      }
      
      setModalOpen(false);
      setEditingBanner(null);
      setFormData(initialFormState);
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette bannière ?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/banners/${id}`, config);
        toast.success('Bannière supprimée');
        fetchBanners();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText || '',
      link: banner.link || '',
      mediaUrl: banner.mediaUrl || '',
      mediaType: banner.mediaType || 'image',
      isEnabled: banner.isEnabled,
      order: banner.order || 0,
      startDate: banner.startDate ? banner.startDate.substring(0, 10) : '',
      endDate: banner.endDate ? banner.endDate.substring(0, 10) : ''
    });
    setModalOpen(true);
  };

  const moveOrder = async (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === banners.length - 1)) return;
    
    const newBanners = [...banners];
    const temp = newBanners[index].order;
    newBanners[index].order = newBanners[index + direction].order;
    newBanners[index + direction].order = temp;

    setBanners(newBanners.sort((a, b) => a.order - b.order));
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await Promise.all([
        axios.put(`/api/banners/${newBanners[index]._id}`, { order: newBanners[index].order }, config),
        axios.put(`/api/banners/${newBanners[index + direction]._id}`, { order: newBanners[index + direction].order }, config)
      ]);
      toast.success('Ordre mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'ordre');
      fetchBanners(); // revert on fail
    }
  };

  const toggleStatus = async (banner) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/banners/${banner._id}`, { isEnabled: !banner.isEnabled }, config);
      toast.success(`Bannière ${!banner.isEnabled ? 'activée' : 'désactivée'}`);
      fetchBanners();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
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
          <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-wider mb-2">Gestion Bannières</h1>
          <p className="text-gray-400 text-sm">Gérez le carrousel principal de la page d'accueil</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setFormData(initialFormState);
            setModalOpen(true);
          }}
          className="btn-gaming bg-gaming-blue hover:bg-gaming-blue/90 text-black px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Bannière</span>
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <motion.div
            key={banner._id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className={`glass-premium p-4 rounded-2xl border ${banner.isEnabled ? 'border-white/10' : 'border-red-500/30 opacity-75'} flex flex-col md:flex-row gap-6 items-center transition-all hover:border-gaming-blue/50`}
          >
            {/* Image Preview */}
            <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden bg-black/50 border border-white/5 relative flex-shrink-0 group">
              {banner.mediaType === 'video' ? (
                <video src={banner.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay />
              ) : (
                <img src={banner.mediaUrl} alt={banner.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus(banner)} className="btn-gaming py-1.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20">
                  {banner.isEnabled ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-orbitron font-bold text-white truncate">{banner.title || 'Sans titre'}</h3>
                {banner.isEnabled ? (
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Actif</span>
                ) : (
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="w-3 h-3"/> Inactif</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{banner.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-gaming-cyan" />
                  <span className="truncate max-w-[150px]">{banner.link || 'Aucun lien'}</span>
                </div>
                {(banner.startDate || banner.endDate) && (
                  <div className="flex items-center gap-1.5 bg-gaming-purple/10 text-gaming-purple px-2 py-1 rounded border border-gaming-purple/20">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{banner.startDate ? new Date(banner.startDate).toLocaleDateString() : '∞'} - {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : '∞'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:flex-col md:border-l md:border-white/10 md:pl-6">
              <div className="flex md:flex-col gap-1">
                <button onClick={() => moveOrder(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveOrder(index, 1)} disabled={index === banners.length - 1} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="w-px h-8 bg-white/10 md:w-8 md:h-px my-1" />
              <button onClick={() => handleEdit(banner)} className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(banner._id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-orbitron text-white mb-2">Aucune bannière</h3>
            <p className="text-gray-400 text-sm">Créez votre première bannière pour la page d'accueil</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gaming-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
              <h2 className="text-2xl font-orbitron font-black text-white uppercase mb-6">{editingBanner ? 'Modifier Bannière' : 'Nouvelle Bannière'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image ou Vidéo (Média principal)</label>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input type="text" name="mediaUrl" value={formData.mediaUrl} onChange={handleInputChange} placeholder="URL de l'image/vidéo" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-blue transition-colors" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={uploadFileHandler} className="hidden" accept="image/*,video/mp4,video/webm" />
                    <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="btn-gaming bg-white/5 hover:bg-white/10 text-white px-4 py-3 flex items-center gap-2 border border-white/10">
                      {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Uploader</span>
                    </button>
                  </div>
                  {formData.mediaUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden bg-black/50 border border-white/10 h-40">
                      {formData.mediaType === 'video' ? (
                        <video src={formData.mediaUrl} className="w-full h-full object-cover" muted autoPlay loop />
                      ) : (
                        <img src={formData.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-blue" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Texte Bouton</label>
                    <input type="text" name="buttonText" value={formData.buttonText} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sous-titre / Description</label>
                  <textarea name="subtitle" value={formData.subtitle} onChange={handleInputChange} rows="2" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-blue" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lien de redirection</label>
                  <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="ex: /products?category=pc-gamer" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-blue" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date de début (Optionnel)</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gaming-blue" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date de fin (Optionnel)</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gaming-blue" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isEnabled" checked={formData.isEnabled} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-cyan"></div>
                  </label>
                  <span className="text-sm font-bold text-white">Bannière Active</span>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors">
                    Annuler
                  </button>
                  <button type="submit" disabled={uploading} className="btn-gaming bg-gaming-blue hover:bg-gaming-blue/90 text-black px-6 py-3">
                    {editingBanner ? 'Mettre à jour' : 'Créer Bannière'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerManager;
