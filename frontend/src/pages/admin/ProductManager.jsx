import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Package, Plus, Search, Edit2, Trash2, X, Star, Eye,
  TrendingUp, CheckCircle, XCircle, Filter, ChevronDown, Image, Video, Star as StarIcon, GripVertical
} from 'lucide-react';

// Helper: compress image to WEBP on client side
const compressToWebp = (file, maxSizeMB = 5) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);
    const img = new window.Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Resize if too large
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(newFile);
        } else {
          resolve(file);
        }
      }, 'image/webp', 0.85);
    };
    img.onerror = () => resolve(file);
    img.src = objUrl;
  });
};

const ProductManager = () => {
  const { user } = useSelector(s => s.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    name: '', brand: '', price: '', promotionalPrice: '', countInStock: '',
    description: '', category: '', features: '', colors: '',
    isFeatured: false, isPopular: false, status: 'Actif',
    media: [], featuredMedia: null
  };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get('/api/products', config),
        axios.get('/api/categories', config)
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) {
      toast.error('Erreur de chargement');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    // Handle legacy products that only have 'images' array
    const productMedia = p.media?.length ? p.media : (p.images?.length ? p.images.map(img => ({ ...img, type: 'image' })) : []);
    
    setForm({
      name: p.name, brand: p.brand, price: p.price, promotionalPrice: p.promotionalPrice || '',
      countInStock: p.countInStock, description: p.description,
      category: p.category?._id || p.category,
      features: (p.features || []).join(', '), colors: (p.colors || []).join(', '),
      isFeatured: p.isFeatured, isPopular: p.isPopular, status: p.status,
      media: productMedia,
      featuredMedia: p.featuredMedia || null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      promotionalPrice: form.promotionalPrice ? Number(form.promotionalPrice) : null,
      countInStock: Number(form.countInStock),
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
    };
    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, payload, config);
        toast.success('Produit mis à jour');
      } else {
        await axios.post('/api/products', payload, config);
        toast.success('Produit créé');
      }
      setShowModal(false);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, config);
      toast.success('Produit supprimé');
      setDeleteConfirm(null);
      fetchAll();
    } catch (e) {
      toast.error('Erreur suppression');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category?._id === filterCat || p.category === filterCat;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const statusBadge = (status) => {
    const cls = status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-glow">Gestion des Produits</h1>
          <p className="text-gray-400 mt-1">{products.length} produits au total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Rechercher produit / marque..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gaming-purple transition-colors"
          />
        </div>
        <select
          value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
        >
          <option value="">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple" />
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr className="text-gray-400 text-sm">
                  <th className="px-6 py-4 text-left">Produit</th>
                  <th className="px-6 py-4 text-left">Catégorie</th>
                  <th className="px-6 py-4 text-left">Prix</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Rating</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white/5"
                          onError={e => e.target.src = '/assets/product_placeholder.png'}
                        />
                        <div>
                          <p className="font-semibold text-sm text-white max-w-xs truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{p.category?.name || '—'}</td>
                    <td className="px-6 py-4">
                      {p.promotionalPrice ? (
                        <div>
                          <p className="text-green-400 font-bold text-sm">{p.promotionalPrice.toLocaleString()} DZD</p>
                          <p className="text-gray-500 text-xs line-through">{p.price.toLocaleString()} DZD</p>
                        </div>
                      ) : (
                        <p className="text-white font-bold text-sm">{p.price.toLocaleString()} DZD</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.countInStock <= 5 ? 'bg-red-500/20 text-red-400' : p.countInStock <= 15 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {p.countInStock} en stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-white">{p.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({p.numReviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                          <Edit2 className="w-4 h-4" /> <span className="text-xs">Edit Product</span>
                        </button>
                        <button onClick={() => setDeleteConfirm(p)} className="flex items-center gap-1.5 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 className="w-4 h-4" /> <span className="text-xs">Delete Product</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gaming-surface border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Nom du produit *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="Razer DeathAdder V3..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Marque *</label>
                    <input required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="Razer" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Catégorie *</label>
                    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gaming-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
                      <option value="">Sélectionner...</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Prix (DZD) *</label>
                    <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="15000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Prix promotionnel (DZD)</label>
                    <input type="number" value={form.promotionalPrice} onChange={e => setForm({ ...form, promotionalPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="13000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Stock *</label>
                    <input required type="number" value={form.countInStock} onChange={e => setForm({ ...form, countInStock: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="20" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Statut</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-3 bg-gaming-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                                <div className="col-span-2">
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-sm text-gray-400">Médias (Images et Vidéos) *</label>
                      <span className="text-xs text-gray-500">Glissez-déposez pour réorganiser</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* Upload Box */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-purple mb-2" />
                          ) : (
                            <Plus className="w-8 h-8 mb-2 text-gray-400" />
                          )}
                          <p className="text-sm text-gray-400">{uploading ? 'Téléchargement et compression...' : 'Cliquez ou glissez-déposez (Images et Vidéos)'}</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (Max 5MB) | MP4, WEBM (Max 50MB)</p>
                        </div>
                        <input type="file" className="hidden" multiple accept="image/*,video/*" disabled={uploading} onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          
                          setUploading(true);
                          
                          const imageFiles = files.filter(f => f.type.startsWith('image/'));
                          const videoFiles = files.filter(f => f.type.startsWith('video/'));
                          
                          const newMedia = [];
                          
                          try {
                            // Compress and upload images
                            if (imageFiles.length > 0) {
                              const compressedImages = await Promise.all(imageFiles.map(f => compressToWebp(f)));
                              const imgFd = new FormData();
                              compressedImages.forEach(f => imgFd.append('images', f));
                              const imgRes = await axios.post('/api/upload/image', imgFd, config);
                              imgRes.data.urls.forEach((url, i) => newMedia.push({ url, type: 'image', public_id: `img_${Date.now()}_${i}` }));
                            }
                            
                            // Upload videos
                            if (videoFiles.length > 0) {
                              const vidFd = new FormData();
                              videoFiles.forEach(f => vidFd.append('videos', f));
                              const vidRes = await axios.post('/api/upload/video', vidFd, config);
                              vidRes.data.urls.forEach((url, i) => newMedia.push({ url, type: 'video', public_id: `vid_${Date.now()}_${i}` }));
                            }
                            
                            setForm(prev => {
                              const updatedMedia = [...prev.media, ...newMedia];
                              // Set first media as featured if not set
                              return { ...prev, media: updatedMedia, featuredMedia: prev.featuredMedia || updatedMedia[0] };
                            });
                            toast.success('Médias téléchargés avec succès');
                          } catch (err) {
                            toast.error(err.response?.data?.message || 'Erreur lors du téléchargement');
                          } finally {
                            setUploading(false);
                          }
                        }} />
                      </label>

                      {/* Media Gallery with Drag & Drop Reordering */}
                      {form.media.length > 0 && (
                        <div className="flex flex-wrap gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                          {form.media.map((item, idx) => {
                            const isFeatured = form.featuredMedia?.url === item.url;
                            return (
                              <div 
                                key={idx} 
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('text/plain', idx)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const fromIdx = Number(e.dataTransfer.getData('text/plain'));
                                  const toIdx = idx;
                                  if (fromIdx === toIdx) return;
                                  const newMedia = [...form.media];
                                  const [moved] = newMedia.splice(fromIdx, 1);
                                  newMedia.splice(toIdx, 0, moved);
                                  setForm({ ...form, media: newMedia });
                                }}
                                className={`relative group w-32 h-32 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${isFeatured ? 'border-gaming-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                              >
                                {item.type === 'video' ? (
                                  <div className="w-full h-full relative bg-black">
                                    <video src={item.url} className="w-full h-full object-cover opacity-80" />
                                    <Video className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/70" />
                                  </div>
                                ) : (
                                  <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                
                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2">
                                  <div className="flex justify-between w-full">
                                    <button 
                                      type="button"
                                      title="Définir comme média principal"
                                      onClick={() => setForm({ ...form, featuredMedia: item })}
                                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${isFeatured ? 'bg-gaming-cyan text-black' : 'bg-white/20 text-white hover:bg-gaming-cyan/50'}`}
                                    >
                                      <StarIcon className="w-3.5 h-3.5" fill={isFeatured ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                      type="button"
                                      title="Supprimer"
                                      onClick={() => {
                                        const newMedia = form.media.filter((_, i) => i !== idx);
                                        const newFeatured = isFeatured ? (newMedia[0] || null) : form.featuredMedia;
                                        setForm({ ...form, media: newMedia, featuredMedia: newFeatured });
                                      }}
                                      className="p-1.5 bg-red-500/80 text-white rounded-lg backdrop-blur-md hover:bg-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="p-1 text-gray-300">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                </div>
                                
                                {isFeatured && (
                                  <div className="absolute bottom-0 inset-x-0 bg-gaming-cyan text-black text-[9px] font-bold text-center py-1 uppercase tracking-widest">
                                    Principal
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Description *</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple resize-none"
                      placeholder="Description du produit..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Fonctionnalités (séparées par virgule)</label>
                    <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="Capteur HERO 25K, 60g, Sans fil..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Couleurs (séparées par virgule)</label>
                    <input value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="Noir, Blanc, Rouge..." />
                  </div>
                  <div className="col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded accent-gaming-purple" />
                      <span className="text-sm text-gray-300">Mis en avant</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isPopular} onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                        className="w-4 h-4 rounded accent-gaming-purple" />
                      <span className="text-sm text-gray-300">Populaire</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 transition-colors">
                    Annuler
                  </button>
                  <button type="submit"
                    className="flex-1 px-4 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
                    {editProduct ? 'Mettre à jour' : 'Créer le produit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gaming-surface border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Supprimer ce produit ?</h3>
              <p className="text-gray-400 text-sm mb-6">"{deleteConfirm.name}" sera définitivement supprimé.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
