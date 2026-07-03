import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tag, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';

const ICONS = ['Mouse', 'Keyboard', 'Headphones', 'MonitorPlay', 'Gamepad2', 'Square', 'Armchair', 'Mic', 'Cpu', 'Zap', 'Star', 'Package'];

const CategoryManager = () => {
  const { user } = useSelector(s => s.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', icon: 'Package', description: '', status: 'Actif' });

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/categories', config);
      setCategories(data);
    } catch { toast.error('Erreur chargement'); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditCat(null); setForm({ name: '', icon: 'Package', description: '', status: 'Actif' }); setShowModal(true); };
  const openEdit = (c) => { setEditCat(c); setForm({ name: c.name, icon: c.icon, description: c.description || '', status: c.status || 'Actif' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await axios.put(`/api/categories/${editCat._id}`, form, config);
        toast.success('Catégorie mise à jour');
      } else {
        await axios.post('/api/categories', form, config);
        toast.success('Catégorie créée');
      }
      setShowModal(false);
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`, config);
      toast.success('Catégorie supprimée');
      setDeleteConfirm(null);
      fetch();
    } catch { toast.error('Erreur suppression'); }
  };

  const toggleStatus = async (cat) => {
    const newStatus = cat.status === 'Actif' ? 'Inactif' : 'Actif';
    try {
      await axios.put(`/api/categories/${cat._id}`, { ...cat, status: newStatus }, config);
      setCategories(categories.map(c => c._id === cat._id ? { ...c, status: newStatus } : c));
      toast.success(`Statut: ${newStatus}`);
    } catch { toast.error('Erreur'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-glow">Gestion des Catégories</h1>
          <p className="text-gray-400 mt-1">{categories.length} catégories au total</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" /> Add Category
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Tag className="w-16 h-16 text-gaming-purple" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gaming-purple/20 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-gaming-purple" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cat.status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {cat.status || 'Actif'}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-400 mb-1">Icône: {cat.icon}</p>
              {cat.description && <p className="text-xs text-gray-500 mb-4 line-clamp-2">{cat.description}</p>}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <button onClick={() => openEdit(cat)} className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm">
                  <Edit2 className="w-4 h-4" /> Edit Category
                </button>
                <button onClick={() => toggleStatus(cat)} className={`p-2 rounded-xl transition-colors ${cat.status === 'Actif' ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                  {cat.status === 'Actif' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => setDeleteConfirm(cat)} className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                  <Trash2 className="w-4 h-4" /> Delete Category
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gaming-surface border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editCat ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                    placeholder="Souris Gaming" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Icône Lucide</label>
                  <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-gaming-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple resize-none"
                    placeholder="Description de la catégorie..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Statut</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gaming-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5">Annuler</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700">{editCat ? 'Mettre à jour' : 'Créer'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gaming-surface border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center">
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Supprimer cette catégorie ?</h3>
              <p className="text-gray-400 text-sm mb-6">"{deleteConfirm.name}" sera supprimée.</p>
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

export default CategoryManager;
