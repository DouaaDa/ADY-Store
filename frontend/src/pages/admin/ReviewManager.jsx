import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Star, CheckCircle, XCircle, Trash2, Eye, Search, Filter } from 'lucide-react';

const ReviewManager = () => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products/reviews/all', config);
      setReviews(data);
    } catch (err) {
      toast.error('Erreur de chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleModerate = async (productId, reviewId, status) => {
    try {
      await axios.put(`/api/products/${productId}/reviews/${reviewId}`, { status }, config);
      toast.success(`Avis ${status === 'Approuvé' ? 'approuvé' : 'rejeté'}`);
      fetchReviews();
    } catch (err) {
      toast.error('Erreur de modération');
    }
  };

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    try {
      await axios.delete(`/api/products/${productId}/reviews/${reviewId}`, config);
      toast.success('Avis supprimé');
      fetchReviews();
    } catch (err) {
      toast.error('Erreur de suppression');
    }
  };

  const filtered = reviews
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r =>
      r.productName?.toLowerCase().includes(search.toLowerCase()) ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
    );

  const statusBadge = (status) => {
    const map = {
      'En attente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Approuvé': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Rejeté': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return `text-xs px-2 py-1 rounded-full border ${map[status] || 'bg-gray-500/20 text-gray-400'}`;
  };

  const countByStatus = (s) => reviews.filter(r => r.status === s).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black mb-2 text-glow">Modération des Avis</h1>
        <p className="text-gray-400">Gérez et modérez les avis clients sur vos produits.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: reviews.length, color: 'text-white' },
          { label: 'En attente', value: countByStatus('En attente'), color: 'text-yellow-400' },
          { label: 'Approuvés', value: countByStatus('Approuvé'), color: 'text-green-400' },
          { label: 'Rejetés', value: countByStatus('Rejeté'), color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher produit, auteur, commentaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gaming-purple/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'En attente', 'Approuvé', 'Rejeté'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-gaming-purple text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {s === 'all' ? 'Tous' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-gaming-blue">{review.productName}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        par <span className="text-white font-medium">{review.name}</span> • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={statusBadge(review.status)}>{review.status}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">{review.rating}/5</span>
                  </div>

                  <p className="text-sm text-gray-300 bg-white/5 rounded-lg p-3">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  {review.status !== 'Approuvé' && (
                    <button
                      onClick={() => handleModerate(review.productId, review._id, 'Approuvé')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Approuver</span>
                    </button>
                  )}
                  {review.status !== 'Rejeté' && (
                    <button
                      onClick={() => handleModerate(review.productId, review._id, 'Rejeté')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Rejeter</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.productId, review._id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManager;
