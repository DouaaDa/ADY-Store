import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Users, Search, Eye, Shield, ShieldOff, Mail, Phone, MapPin, X, Crown, User } from 'lucide-react';

const UserManager = () => {
  const { user: currentUser } = useSelector(s => s.auth);
  const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/auth/users', config);
      setUsers(data);
    } catch (e) {
      toast.error('Erreur de chargement des utilisateurs');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Actif' ? 'Bloqué' : 'Actif';
    try {
      await axios.put(`/api/auth/users/${userId}/status`, { status: newStatus }, config);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, status: newStatus });
      toast.success(`Utilisateur ${newStatus === 'Bloqué' ? 'bloqué' : 'débloqué'}`);
    } catch (e) {
      toast.error('Erreur mise à jour');
    }
  };

  const filtered = users.filter(u => {
    const name = `${u.nom} ${u.prenom} ${u.email}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalActive = users.filter(u => u.status === 'Actif').length;
  const totalBlocked = users.filter(u => u.status === 'Bloqué').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-glow">Gestion des Utilisateurs</h1>
        <p className="text-gray-400 mt-1">{users.length} utilisateurs au total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: users.length, color: 'text-white', bg: 'bg-white/5' },
          { label: 'Admins', value: totalAdmins, color: 'text-gaming-purple', bg: 'bg-purple-500/10' },
          { label: 'Actifs', value: totalActive, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Bloqués', value: totalBlocked, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(s => (
          <div key={s.label} className={`glass rounded-xl p-4 text-center ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Rechercher par nom ou email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gaming-purple"
          />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="user">Client</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple">
          <option value="">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Bloqué">Bloqué</option>
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
                  <th className="px-6 py-4 text-left">Utilisateur</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Rôle</th>
                  <th className="px-6 py-4 text-left">Localisation</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-left">Commandes</th>
                  <th className="px-6 py-4 text-left">Dépenses</th>
                  <th className="px-6 py-4 text-left">Inscrit le</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${u.role === 'admin' ? 'bg-gaming-purple/20 text-gaming-purple' : 'bg-gaming-blue/20 text-gaming-blue'}`}>
                          {u.nom?.[0]}{u.prenom?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{u.prenom} {u.nom}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{u.telephone}</td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gaming-purple/20 text-gaming-purple font-semibold">
                          <Crown className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 font-semibold">
                          <User className="w-3 h-3" /> Client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{u.commune}, {u.wilaya}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {u.totalOrders || 0}
                    </td>
                    <td className="px-6 py-4 font-bold text-gaming-blue text-sm">
                      {(u.totalSpent || 0).toLocaleString()} DZD
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('fr-DZ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedUser(u)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => toggleBlock(u._id, u.status)}
                            className={`p-2 rounded-lg transition-colors ${u.status === 'Actif' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                            title={u.status === 'Actif' ? 'Bloquer' : 'Débloquer'}
                          >
                            {u.status === 'Actif' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gaming-surface border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profil Utilisateur</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-3 ${selectedUser.role === 'admin' ? 'bg-gaming-purple/20 text-gaming-purple' : 'bg-gaming-blue/20 text-gaming-blue'}`}>
                  {selectedUser.nom?.[0]}{selectedUser.prenom?.[0]}
                </div>
                <h3 className="text-lg font-bold">{selectedUser.prenom} {selectedUser.nom}</h3>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {selectedUser.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gaming-purple/20 text-gaming-purple font-semibold">
                      <Crown className="w-3 h-3" /> Administrateur
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 font-semibold">
                      <User className="w-3 h-3" /> Client
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedUser.status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <p className="text-gray-400 text-xs">Commandes</p>
                  <p className="text-xl font-bold text-white">{selectedUser.totalOrders || 0}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <p className="text-gray-400 text-xs">Total Dépensé</p>
                  <p className="text-xl font-bold text-gaming-blue">{(selectedUser.totalSpent || 0).toLocaleString()} DZD</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedUser.telephone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedUser.commune}, Wilaya {selectedUser.wilaya}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedUser.adresse}</span>
                </div>
              </div>
              {selectedUser._id !== currentUser?._id && (
                <button
                  onClick={() => toggleBlock(selectedUser._id, selectedUser.status)}
                  className={`mt-6 w-full py-3 rounded-xl font-bold transition-colors ${selectedUser.status === 'Actif' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {selectedUser.status === 'Actif' ? '🚫 Bloquer cet utilisateur' : '✅ Débloquer cet utilisateur'}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManager;
