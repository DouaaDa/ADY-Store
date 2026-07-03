import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Ticket, Plus, Edit2, Trash2, X, Calendar, Percent, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';

const CouponManager = () => {
  const { user } = useSelector(s => s.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true, description: '' };
  const [form, setForm] = useState(emptyForm);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/coupons', config);
      setCoupons(data);
    } catch { toast.error('Erreur chargement'); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditCoupon(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => {
    setEditCoupon(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount, maxUses: c.maxUses,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split('T')[0] : '',
      isActive: c.isActive, description: c.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, discountValue: Number(form.discountValue), minOrderAmount: Number(form.minOrderAmount), maxUses: Number(form.maxUses) };
    try {
      if (editCoupon) {
        await axios.put(`/api/coupons/${editCoupon._id}`, payload, config);
        toast.success('Coupon mis à jour');
      } else {
        await axios.post('/api/coupons', payload, config);
        toast.success('Coupon créé');
      }
      setShowModal(false);
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`, config);
      toast.success('Coupon supprimé');
      setDeleteConfirm(null);
      fetch();
    } catch { toast.error('Erreur suppression'); }
  };

  const toggleActive = async (coupon) => {
    try {
      await axios.put(`/api/coupons/${coupon._id}`, { ...coupon, isActive: !coupon.isActive }, config);
      setCoupons(coupons.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c));
      toast.success(`Coupon ${!coupon.isActive ? 'activé' : 'désactivé'}`);
    } catch { toast.error('Erreur'); }
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-glow">Gestion des Coupons</h1>
          <p className="text-gray-400 mt-1">{coupons.length} coupons au total</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" /> Nouveau Coupon
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: coupons.length, color: 'text-white' },
          { label: 'Actifs', value: coupons.filter(c => c.isActive).length, color: 'text-green-400' },
          { label: 'Expirés', value: coupons.filter(c => isExpired(c.expiresAt)).length, color: 'text-red-400' },
          { label: 'Utilisations totales', value: coupons.reduce((s, c) => s + (c.currentUses || 0), 0), color: 'text-gaming-blue' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

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
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Réduction</th>
                  <th className="px-6 py-4 text-left">Min. commande</th>
                  <th className="px-6 py-4 text-left">Utilisations</th>
                  <th className="px-6 py-4 text-left">Expiration</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon, i) => (
                  <motion.tr key={coupon._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono font-bold text-gaming-purple bg-gaming-purple/10 px-2 py-1 rounded-lg text-sm">{coupon.code}</span>
                        {coupon.description && <p className="text-xs text-gray-400 mt-1">{coupon.description}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 font-bold ${coupon.discountType === 'percentage' ? 'text-green-400' : 'text-gaming-blue'}`}>
                        {coupon.discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' DZD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{coupon.minOrderAmount?.toLocaleString()} DZD</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${coupon.currentUses >= coupon.maxUses ? 'text-red-400' : 'text-white'}`}>
                        {coupon.currentUses || 0} / {coupon.maxUses || '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 text-sm ${isExpired(coupon.expiresAt) ? 'text-red-400' : 'text-green-400'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('fr-DZ') : 'Illimité'}
                        {isExpired(coupon.expiresAt) && <span className="text-xs">(Expiré)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {coupon.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(coupon)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => toggleActive(coupon)} className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                          {coupon.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setDeleteConfirm(coupon)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun coupon créé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gaming-surface border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editCoupon ? 'Modifier Coupon' : 'Nouveau Coupon'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code du coupon *</label>
                  <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-gaming-purple uppercase"
                    placeholder="PROMO20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}
                      className="w-full px-4 py-3 bg-gaming-bg border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Fixe (DZD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Valeur *</label>
                    <input required type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder={form.discountType === 'percentage' ? '10' : '5000'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min. commande (DZD)</label>
                    <input type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="5000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max. utilisations</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date d'expiration *</label>
                  <input required type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
                    placeholder="Description optionnelle" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded accent-gaming-purple" />
                  <span className="text-sm text-gray-300">Coupon actif</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-gray-400 hover:bg-white/5">Annuler</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gaming-purple text-white rounded-xl font-bold hover:bg-purple-700">{editCoupon ? 'Mettre à jour' : 'Créer'}</button>
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
              <h3 className="text-lg font-bold mb-2">Supprimer ce coupon ?</h3>
              <p className="text-gray-400 text-sm mb-6">Le coupon "<span className="font-mono text-gaming-purple">{deleteConfirm.code}</span>" sera supprimé.</p>
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

export default CouponManager;
