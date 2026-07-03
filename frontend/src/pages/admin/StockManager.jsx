import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Package, AlertTriangle, X, RefreshCw, TrendingDown,
  Search, Edit2, Save, Box, Layers, ArrowUpDown, TrendingUp
} from 'lucide-react';

const THRESHOLDS = { critical: 3, low: 10, medium: 30 };

const getStockStatus = (count) => {
  if (count === 0) return { label: 'Rupture', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', ring: '#ef4444' };
  if (count <= THRESHOLDS.critical) return { label: 'Critique', color: '#f97316', bg: 'rgba(249,115,22,0.12)', ring: '#f97316' };
  if (count <= THRESHOLDS.low) return { label: 'Faible', color: '#eab308', bg: 'rgba(234,179,8,0.12)', ring: '#eab308' };
  if (count <= THRESHOLDS.medium) return { label: 'Moyen', color: '#00e5ff', bg: 'rgba(0,229,255,0.12)', ring: '#00e5ff' };
  return { label: 'OK', color: '#00ff88', bg: 'rgba(0,255,136,0.12)', ring: '#00ff88' };
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' } })
};

const StockManager = () => {
  const { user } = useSelector((s) => s.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('countInStock');
  const [sortDir, setSortDir] = useState('asc');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [expandedVariants, setExpandedVariants] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products/stock', config);
      setProducts(data);
    } catch {
      toast.error('Erreur lors du chargement des stocks');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const stats = useMemo(() => {
    const out = products.filter(p => p.countInStock === 0).length;
    const critical = products.filter(p => p.countInStock > 0 && p.countInStock <= THRESHOLDS.critical).length;
    const low = products.filter(p => p.countInStock > THRESHOLDS.critical && p.countInStock <= THRESHOLDS.low).length;
    const total = products.reduce((s, p) => s + p.countInStock, 0);
    return { out, critical, low, total, count: products.length };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.category?.name || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'out': list = list.filter(p => p.countInStock === 0); break;
        case 'critical': list = list.filter(p => p.countInStock > 0 && p.countInStock <= THRESHOLDS.critical); break;
        case 'low': list = list.filter(p => p.countInStock > THRESHOLDS.critical && p.countInStock <= THRESHOLDS.low); break;
        case 'ok': list = list.filter(p => p.countInStock > THRESHOLDS.low); break;
        default: break;
      }
    }
    list.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [products, search, filterStatus, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditValues({
      countInStock: product.countInStock,
      variants: (product.variants || []).map(v => ({ _id: v._id, color: v.color, stock: v.stock }))
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditValues({}); };

  const saveStock = async (productId) => {
    setSaving(true);
    try {
      const { data } = await axios.put(`/api/products/${productId}/stock`, editValues, config);
      setProducts(prev => prev.map(p => p._id === productId
        ? { ...p, countInStock: data.countInStock, variants: data.variants, isAvailable: data.isAvailable }
        : p
      ));
      setEditingId(null);
      toast.success('Stock mis à jour ✓');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
    setSaving(false);
  };

  const toggleVariants = (id) => setExpandedVariants(p => ({ ...p, [id]: !p[id] }));

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={13} className="opacity-30" />;
    return sortDir === 'asc' ? <TrendingUp size={13} style={{ color: '#00e5ff' }} /> : <TrendingDown size={13} style={{ color: '#00e5ff' }} />;
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #00e5ff22, #b026ff22)', border: '1px solid #00e5ff44' }}>
              <Package size={22} style={{ color: '#00e5ff' }} />
            </div>
            Gestion des Stocks
          </h1>
          <p className="text-sm text-gray-400 mt-1">{stats.count} produits · {stats.total.toLocaleString('fr-DZ')} unités totales</p>
        </div>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Rupture de stock', value: stats.out, Icon: X, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', filter: 'out' },
          { label: 'Stock critique', value: stats.critical, Icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.08)', filter: 'critical' },
          { label: 'Stock faible', value: stats.low, Icon: TrendingDown, color: '#eab308', bg: 'rgba(234,179,8,0.08)', filter: 'low' },
          { label: 'Unités totales', value: stats.total.toLocaleString(), Icon: Box, color: '#00ff88', bg: 'rgba(0,255,136,0.08)', filter: 'ok' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => setFilterStatus(filterStatus === s.filter ? 'all' : s.filter)}
            className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 hover:brightness-125"
            style={{
              background: s.bg,
              border: `1px solid ${s.color}33`,
              outline: filterStatus === s.filter ? `2px solid ${s.color}88` : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <s.Icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, marque, catégorie..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { v: 'all', l: 'Tous' },
            { v: 'out', l: '🔴 Rupture' },
            { v: 'critical', l: '🟠 Critique' },
            { v: 'low', l: '🟡 Faible' },
            { v: 'ok', l: '🟢 OK' },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => setFilterStatus(opt.v)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filterStatus === opt.v ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filterStatus === opt.v ? '#00e5ff' : 'rgba(255,255,255,0.1)'}`,
                color: filterStatus === opt.v ? '#00e5ff' : '#9ca3af'
              }}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="col-span-5">Produit</div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-300" onClick={() => toggleSort('brand')}>
            Marque <SortIcon field="brand" />
          </div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-300" onClick={() => toggleSort('countInStock')}>
            Stock <SortIcon field="countInStock" />
          </div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={32} className="animate-spin mx-auto mb-3" style={{ color: '#00e5ff' }} />
            <p className="text-gray-400 text-sm">Chargement des stocks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((product, idx) => {
              const status = getStockStatus(product.countInStock);
              const isEditing = editingId === product._id;
              const hasVariants = product.variants && product.variants.length > 0;
              const variantsExpanded = expandedVariants[product._id];
              const img = product.images?.[0]?.url || product.media?.[0]?.url;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: idx * 0.015 } }}
                  exit={{ opacity: 0 }}
                  className="border-b last:border-b-0"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
                    style={{ background: isEditing ? 'rgba(0,229,255,0.03)' : undefined }}
                  >
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        {img ? (
                          <img src={img} alt={product.name} className="w-10 h-10 rounded-lg object-cover" style={{ border: `1px solid ${status.ring}44` }} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Package size={16} className="text-gray-500" />
                          </div>
                        )}
                        {product.countInStock === 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" style={{ border: '2px solid #0a0a0f' }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{product.category?.name}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-sm text-gray-300 truncate">{product.brand}</div>

                    <div className="col-span-2">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editValues.countInStock}
                          onChange={e => setEditValues(v => ({ ...v, countInStock: e.target.value }))}
                          className="w-20 px-2 py-1.5 rounded-lg text-sm text-white text-center font-bold outline-none"
                          style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.4)' }}
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: status.color }}>{product.countInStock}</span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: status.color, background: status.bg, border: `1px solid ${status.ring}44` }}>
                        {status.label}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      {hasVariants && (
                        <button
                          onClick={() => toggleVariants(product._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Voir variantes"
                        >
                          <Layers size={14} />
                        </button>
                      )}
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveStock(product._id)}
                            disabled={saving}
                            className="p-1.5 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}
                            title="Sauvegarder"
                          >
                            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                            title="Annuler"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(product)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}
                          title="Modifier le stock"
                        >
                          <Edit2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Variants panel */}
                  <AnimatePresence>
                    {hasVariants && variantsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-3 pt-2 space-y-2" style={{ background: 'rgba(0,229,255,0.02)', borderTop: '1px dashed rgba(0,229,255,0.1)' }}>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Layers size={12} /> Variantes
                          </p>
                          {product.variants.map((variant, vi) => {
                            const vs = getStockStatus(variant.stock);
                            return (
                              <div key={variant._id || vi} className="flex items-center gap-4 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="flex items-center gap-2 min-w-[120px]">
                                  <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" style={{ background: variant.color || '#666' }} />
                                  <span className="text-xs text-gray-300">{variant.color}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Stock:</span>
                                  {isEditing && editValues.variants ? (
                                    <input
                                      type="number"
                                      min="0"
                                      value={editValues.variants[vi]?.stock ?? variant.stock}
                                      onChange={e => {
                                        const newVariants = [...editValues.variants];
                                        newVariants[vi] = { ...newVariants[vi], stock: e.target.value };
                                        setEditValues(v => ({ ...v, variants: newVariants }));
                                      }}
                                      className="w-16 px-2 py-1 rounded text-xs text-center font-bold outline-none"
                                      style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: '#fff' }}
                                    />
                                  ) : (
                                    <span className="text-xs font-bold" style={{ color: vs.color }}>{variant.stock}</span>
                                  )}
                                </div>
                                {variant.sku && <span className="text-xs text-gray-600 ml-2">SKU: {variant.sku}</span>}
                                <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ color: vs.color, background: vs.bg }}>
                                  {vs.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }} className="text-xs text-gray-600 text-center pb-4">
        {filtered.length} produit{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''} sur {products.length}
      </motion.div>
    </div>
  );
};

export default StockManager;
