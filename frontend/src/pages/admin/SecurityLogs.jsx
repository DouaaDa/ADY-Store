import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Shield, Search, Activity, User, Clock, Filter, RefreshCw } from 'lucide-react';

const ACTION_COLORS = {
  'Product Created': 'text-green-400 bg-green-400/10',
  'Product Updated': 'text-blue-400 bg-blue-400/10',
  'Product Deleted': 'text-red-400 bg-red-400/10',
  'Order Created': 'text-purple-400 bg-purple-400/10',
  'Order Status Updated': 'text-yellow-400 bg-yellow-400/10',
  'Review Moderated': 'text-cyan-400 bg-cyan-400/10',
  'Review Deleted': 'text-red-400 bg-red-400/10',
  'Contact Message Replied': 'text-pink-400 bg-pink-400/10',
  'Message Deleted': 'text-gray-400 bg-gray-400/10',
};

const SecurityLogs = () => {
  const { user } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/system/logs', config);
      setLogs(data);
    } catch (err) {
      toast.error('Erreur de chargement des journaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const uniqueActions = ['all', ...new Set(logs.map(l => l.action))];

  const filtered = logs
    .filter(l => actionFilter === 'all' || l.action === actionFilter)
    .filter(l =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.details?.toLowerCase().includes(search.toLowerCase()) ||
      `${l.user?.prenom} ${l.user?.nom}`.toLowerCase().includes(search.toLowerCase())
    );

  const getActionStyle = (action) => ACTION_COLORS[action] || 'text-gray-400 bg-gray-400/10';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 text-glow">Journal de Sécurité</h1>
          <p className="text-gray-400">Historique complet des actions administratives — {logs.length} événements</p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Événements', value: logs.length, color: 'text-white' },
          { label: 'Produits', value: logs.filter(l => l.action?.includes('Product')).length, color: 'text-blue-400' },
          { label: 'Commandes', value: logs.filter(l => l.action?.includes('Order')).length, color: 'text-purple-400' },
          { label: 'Aujourd\'hui', value: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-green-400' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher action, détails, utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gaming-purple/50"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gaming-purple/50"
        >
          {uniqueActions.map(a => (
            <option key={a} value={a}>{a === 'all' ? 'Toutes les actions' : a}</option>
          ))}
        </select>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucun journal trouvé</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="text-left px-5 py-4 font-medium">Action</th>
                <th className="text-left px-5 py-4 font-medium hidden md:table-cell">Détails</th>
                <th className="text-left px-5 py-4 font-medium hidden sm:table-cell">Utilisateur</th>
                <th className="text-left px-5 py-4 font-medium">Date & Heure</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell max-w-[300px] truncate">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {log.user ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gaming-purple/30 flex items-center justify-center text-xs font-bold text-gaming-purple">
                          {log.user.prenom?.[0]}
                        </div>
                        <span className="text-gray-300">{log.user.prenom} {log.user.nom}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityLogs;
