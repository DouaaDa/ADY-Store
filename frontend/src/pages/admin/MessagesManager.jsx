import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  MessageSquare, Mail, Phone, Trash2,
  CheckCircle, Eye, Search, User, Archive, Send, Reply
} from 'lucide-react';

const MessagesManager = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/messages?archived=${showArchived}`, config);
      setMessages(data);
    } catch (err) {
      toast.error('Erreur de chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [showArchived]);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`/api/messages/${id}/read`, {}, config);
      toast.success('Marqué comme lu');
      fetchMessages();
      if (selected?._id === id) setSelected({ ...selected, status: 'Read' });
    } catch {
      toast.error('Erreur');
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.put(`/api/messages/${id}/archive`, {}, config);
      toast.success('Message archivé');
      if (selected?._id === id) setSelected(null);
      fetchMessages();
    } catch {
      toast.error('Erreur lors de l\'archivage');
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const { data } = await axios.put(`/api/messages/${id}/reply`, { reply: replyText }, config);
      toast.success('Réponse envoyée');
      setReplyText('');
      setSelected(data);
      fetchMessages();
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await axios.delete(`/api/messages/${id}`, config);
      toast.success('Message supprimé');
      if (selected?._id === id) setSelected(null);
      fetchMessages();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const filtered = messages
    .filter(m => {
      if (filter === 'unread') return m.status === 'Unread';
      if (filter === 'read') return m.status === 'Read';
      return true;
    })
    .filter(m =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
    );

  const unreadCount = messages.filter(m => m.status === 'Unread').length;

  const statusLabel = (s) => {
    if (s === 'Unread') return 'Non lu';
    if (s === 'Read') return 'Lu';
    if (s === 'Archived') return 'Archivé';
    return s;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 text-glow">Messages & Contact</h1>
          <p className="text-gray-400">Centre de messagerie client – {unreadCount} non lu(s)</p>
        </div>
        <button
          onClick={() => { setShowArchived(!showArchived); setSelected(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${showArchived ? 'bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
        >
          <Archive className="w-4 h-4" />
          {showArchived ? 'Voir Messages Actifs' : 'Voir Archivés'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: messages.length, color: 'text-white' },
          { label: 'Non lus', value: unreadCount, color: 'text-yellow-400' },
          { label: 'Lus', value: messages.filter(m => m.status === 'Read').length, color: 'text-green-400' },
        ].map((s, i) => (
          <div key={i} className="glass p-4 rounded-xl text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gaming-purple/50" />
            </div>
            <div className="flex gap-2">
              {[{ k: 'all', l: 'Tous' }, { k: 'unread', l: 'Non lus' }, { k: 'read', l: 'Lus' }].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)}
                  className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${filter === f.k ? 'bg-gaming-purple text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-purple" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass p-8 rounded-xl text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun message</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <motion.button key={msg._id}
                  onClick={() => {
                    setSelected(msg);
                    setReplyText('');
                    if (msg.status === 'Unread') handleMarkRead(msg._id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected?._id === msg._id ? 'border-gaming-purple bg-gaming-purple/10' : 'glass border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate">{msg.name}</span>
                    {msg.status === 'Unread' && <span className="w-2 h-2 rounded-full bg-gaming-purple shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-gaming-blue font-medium truncate mb-1">{msg.subject}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</p>
                    {msg.reply && <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Répondu</span>}
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div key={selected._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selected.subject}</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(selected.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    <span className="ml-2 text-xs text-gray-500">({statusLabel(selected.status)})</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {selected.status === 'Unread' && (
                    <button onClick={() => handleMarkRead(selected._id)} className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors" title="Marquer comme lu">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleArchive(selected._id)} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors" title="Archiver">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(selected._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gaming-blue shrink-0" />
                  <span className="text-gray-400">Nom :</span>
                  <span className="font-medium truncate">{selected.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gaming-purple shrink-0" />
                  <span className="text-gray-400">Email :</span>
                  <a href={`mailto:${selected.email}`} className="font-medium text-gaming-blue hover:underline truncate">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-gray-400">Tél :</span>
                    <span className="font-medium">{selected.phone}</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-5 mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Message</h3>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Previous Reply */}
              {selected.reply && (
                <div className="bg-gaming-purple/10 border border-gaming-purple/20 rounded-xl p-5 mb-6">
                  <h3 className="text-xs font-semibold text-gaming-purple uppercase tracking-widest mb-3 flex items-center gap-2"><Reply className="w-3.5 h-3.5" /> Votre réponse</h3>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.reply}</p>
                </div>
              )}

              {/* Reply Form */}
              <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Send className="w-3.5 h-3.5" /> {selected.reply ? 'Modifier la réponse' : 'Répondre'}</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  rows="3"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gaming-purple/50 resize-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReply(selected._id)}
                    disabled={!replyText.trim() || replying}
                    className="btn-gaming bg-gaming-purple hover:bg-gaming-purple/90 text-white px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
                  >
                    {replying ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    Envoyer la réponse
                  </button>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors border border-white/10">
                    <Mail className="w-4 h-4" /> Email direct
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl h-full flex items-center justify-center text-gray-500 min-h-[400px]">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Sélectionnez un message</p>
                <p className="text-sm mt-1 opacity-60">Cliquez sur un message pour l'afficher</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
