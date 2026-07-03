import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Package, Users, ShoppingCart, TrendingUp, Star,
  AlertTriangle, DollarSign, BarChart2, ArrowUpRight,
  ArrowDownRight, Activity, Zap, CheckCircle2, Clock,
  Download, FileSpreadsheet, FileText, Bell
} from 'lucide-react';
import { fetchAnalytics } from '../../store/adminSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  'Livrée': '#00ff88',
  'Expédiée': '#00e5ff',
  'Prête': '#6366f1',
  'Préparation': '#b026ff',
  'Confirmée': '#f59e0b',
  'En attente': '#64748b',
  'Annulée': '#ef4444',
};

const BRAND_COLORS = ['#00e5ff', '#b026ff', '#00ff88', '#f59e0b', '#ef4444'];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } })
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-white font-orbitron font-black text-lg">{payload[0].value?.toLocaleString('fr-DZ')} <span className="text-xs text-gaming-cyan">DA</span></p>
      </div>
    );
  }
  return null;
};

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const [exporting, setExporting] = useState({});

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const handleExport = async (type) => {
    setExporting(prev => ({ ...prev, [type]: true }));
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob'
      };
      const { data } = await axios.get(`/api/reports/${type}`, config);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      const extensions = { orders: 'xlsx', customers: 'xlsx', products: 'xlsx' };
      const names = { orders: 'Commandes', customers: 'Clients', products: 'Produits' };
      link.setAttribute('download', `${names[type] || type}.${extensions[type] || 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Export ${names[type]} téléchargé`);
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(prev => ({ ...prev, [type]: false }));
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-gaming-purple rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="font-orbitron text-sm text-gray-500 uppercase tracking-widest animate-pulse">Chargement des données...</p>
      </div>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayOrders = analytics.recentOrders?.filter(o => new Date(o.createdAt) >= todayStart) || [];
  const todayRevenue = todayOrders.filter(o => o.status !== 'Annulée').reduce((sum, o) => sum + o.totalPrice, 0);

  const statusDist = analytics.recentOrders?.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(statusDist).map(([name, value]) => ({ name, value }));

  const stats = [
    { title: "Revenu Aujourd'hui", value: `${todayRevenue.toLocaleString('fr-DZ')}`, suffix: 'DA', icon: DollarSign, color: 'text-gaming-cyan', bg: 'from-gaming-blue/20 to-gaming-blue/5', border: 'border-gaming-blue/20', glow: 'shadow-[0_0_30px_rgba(0,229,255,0.15)]', trend: `${todayOrders.length} commande(s)`, trendUp: true, sub: "Aujourd'hui" },
    { title: 'Revenu Global', value: `${(analytics.totalRevenue || 0).toLocaleString('fr-DZ')}`, suffix: 'DA', icon: DollarSign, color: 'text-gaming-purple', bg: 'from-gaming-purple/20 to-gaming-purple/5', border: 'border-gaming-purple/20', glow: 'shadow-[0_0_30px_rgba(176,38,255,0.15)]', trend: '+12%', trendUp: true, sub: 'Toutes commandes' },
    { title: 'Total Commandes', value: analytics.totalOrders, suffix: '', icon: ShoppingCart, color: 'text-gaming-blue', bg: 'from-gaming-blue/25 to-gaming-blue/5', border: 'border-gaming-blue/20', glow: 'shadow-[0_0_30px_rgba(0,229,255,0.1)]', trend: `+${todayOrders.length} aujourd'hui`, trendUp: true, sub: 'Total enregistrées' },
    { title: 'Clients Actifs', value: analytics.totalClients, suffix: '', icon: Users, color: 'text-gaming-green', bg: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', glow: 'shadow-[0_0_30px_rgba(0,255,136,0.1)]', trend: '+5%', trendUp: true, sub: 'Comptes actifs' },
    { title: 'Rupture Stock', value: analytics.outOfStockProducts?.length || 0, suffix: '', icon: AlertTriangle, color: 'text-red-400', bg: 'from-red-400/20 to-red-400/5', border: 'border-red-400/20', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.1)]', trend: `${analytics.lowStockProducts?.length || 0} bas`, trendUp: false, sub: `${analytics.lowStockProducts?.length || 0} stock bas` },
  ];

  const rawSales = analytics.salesData || [];
  const today = new Date();
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const found = rawSales.find(s => s._id === key);
    return { day: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), ventes: found ? found.totalSales : 0 };
  });

  const ordersPerMonthData = (analytics.ordersPerMonth || []).map(m => ({
    month: m._id,
    commandes: m.totalOrders,
    revenu: m.totalRevenue
  }));

  const topBrandsData = (analytics.topBrands || []).filter(b => b._id).map(b => ({
    name: b._id,
    produits: b.totalProducts,
    vues: b.totalViews || 0
  }));

  const topCategoriesData = (analytics.topCategories || []).map(c => ({
    name: c.name || 'Inconnu',
    produits: c.totalProducts
  }));

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-orbitron font-bold tracking-[0.3em] text-gaming-cyan uppercase mb-2">{greeting} 👋</p>
          <h1 className="text-4xl font-black mb-1 text-white font-orbitron uppercase tracking-tight">Vue d'ensemble</h1>
          <p className="text-gray-400 text-sm">Bienvenue, <span className="text-white font-bold">{user?.prenom}</span>. Voici le résumé de la boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            {[
              { key: 'orders', label: 'Commandes', icon: FileSpreadsheet, color: 'text-gaming-cyan' },
              { key: 'customers', label: 'Clients', icon: FileSpreadsheet, color: 'text-gaming-green' },
              { key: 'products', label: 'Produits', icon: FileSpreadsheet, color: 'text-gaming-purple' },
            ].map(exp => (
              <button key={exp.key} onClick={() => handleExport(exp.key)} disabled={exporting[exp.key]}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all disabled:opacity-50" title={`Exporter ${exp.label} Excel`}>
                {exporting[exp.key] ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <exp.icon className={`w-3.5 h-3.5 ${exp.color}`} />}
                <span className="hidden xl:inline font-medium">{exp.label}</span>
                <Download className="w-3 h-3" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs font-orbitron text-gray-500 bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-md">
            <Activity className="w-4 h-4 text-gaming-cyan" />
            <span className="uppercase tracking-widest">
              Mis à jour : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bg} border ${stat.border} ${stat.glow} p-6 group hover:scale-[1.02] transition-transform duration-300`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-black/30 border ${stat.border}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">{stat.title}</p>
              <div className="font-orbitron font-black text-3xl text-white mb-1">
                {stat.value} <span className="text-sm text-gray-400 font-bold">{stat.suffix}</span>
              </div>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1: Sales + Delivery Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-premium rounded-2xl p-6 border border-white/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2">
                <TrendingUp className="text-gaming-purple w-5 h-5" /> Évolution des Ventes
              </h2>
              <p className="text-xs text-gray-500 mt-1">Revenu journalier (DZD) — 14 derniers jours</p>
            </div>
            <div className="bg-gaming-purple/10 border border-gaming-purple/20 px-3 py-1.5 rounded-full">
              <span className="text-[10px] font-orbitron font-black text-gaming-purple uppercase tracking-widest">En Direct</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b026ff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#b026ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#404040" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                <YAxis stroke="#404040" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ventes" stroke="#b026ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-premium rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-2">
              <BarChart2 className="text-gaming-cyan w-5 h-5" /> Répartition Livraison
            </h2>
            <p className="text-xs text-gray-500">Statuts de livraison des commandes</p>
          </div>
          <div className="h-44 w-full relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#718096'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Commande(s)`]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-500 font-orbitron uppercase">Aucune commande active</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 mt-2">
            {Object.keys(STATUS_COLORS).map(status => {
              const val = statusDist[status] || 0;
              if (val === 0) return null;
              return (
                <div key={status} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[status] }} />
                  <span className="truncate">{status} ({val})</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2: Orders/Month + Top Brands + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Per Month */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-4">
            <BarChart2 className="text-gaming-blue w-5 h-5" /> Commandes / Mois
          </h2>
          <div className="h-48 w-full">
            {ordersPerMonthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersPerMonthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" stroke="#404040" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} />
                  <YAxis stroke="#404040" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="commandes" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-500 text-center py-16">Pas de données</p>
            )}
          </div>
        </motion.div>

        {/* Top Brands */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400 w-5 h-5" /> Top Marques
          </h2>
          <div className="space-y-3">
            {topBrandsData.length > 0 ? topBrandsData.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-black text-sm" style={{ backgroundColor: `${BRAND_COLORS[i % BRAND_COLORS.length]}20`, color: BRAND_COLORS[i % BRAND_COLORS.length], border: `1px solid ${BRAND_COLORS[i % BRAND_COLORS.length]}30` }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{b.name}</p>
                  <p className="text-[10px] text-gray-500">{b.produits} produit(s) · {b.vues} vues</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-500 text-center py-8">Pas de données</p>
            )}
          </div>
        </motion.div>

        {/* Top Categories */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-4">
            <Package className="text-gaming-green w-5 h-5" /> Top Catégories
          </h2>
          <div className="space-y-3">
            {topCategoriesData.length > 0 ? topCategoriesData.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gaming-green/10 flex items-center justify-center font-orbitron font-black text-sm text-gaming-green border border-gaming-green/20">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-[10px] text-gray-500">{c.produits} produit(s)</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-500 text-center py-8">Pas de données</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Out of Stock + Low Stock Alerts */}
      {(analytics.outOfStockProducts?.length > 0 || analytics.lowStockProducts?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.outOfStockProducts?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl">
              <h3 className="text-red-400 font-bold font-orbitron flex items-center gap-2 mb-3 uppercase tracking-wider text-sm">
                <AlertTriangle className="w-4 h-4" /> Ruptures de stock ({analytics.outOfStockProducts.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.outOfStockProducts.slice(0, 12).map(p => (
                  <span key={p._id} className="text-xs px-3 py-1 bg-red-500/10 text-red-300 rounded-full border border-red-500/20">{p.name}</span>
                ))}
                {analytics.outOfStockProducts.length > 12 && (
                  <span className="text-xs px-3 py-1 bg-white/5 text-gray-400 rounded-full border border-white/10">+{analytics.outOfStockProducts.length - 12} autres</span>
                )}
              </div>
            </motion.div>
          )}
          {analytics.lowStockProducts?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="bg-yellow-500/5 border border-yellow-500/20 p-5 rounded-2xl">
              <h3 className="text-yellow-400 font-bold font-orbitron flex items-center gap-2 mb-3 uppercase tracking-wider text-sm">
                <AlertTriangle className="w-4 h-4" /> Stock bas ({analytics.lowStockProducts.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.lowStockProducts.slice(0, 12).map(p => (
                  <span key={p._id} className="text-xs px-3 py-1 bg-yellow-500/10 text-yellow-300 rounded-full border border-yellow-500/20">{p.name} ({p.countInStock})</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Lists: Recent Orders, Top Products, Best Customers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-6">
            <ShoppingCart className="text-gaming-cyan w-5 h-5" /> Commandes Récentes
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-72 scrollbar-hide pr-1">
            {(analytics.recentOrders || []).slice(0, 8).map(order => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-white/3 hover:bg-white/5 rounded-xl transition-colors border border-white/5 group">
                <div>
                  <p className="font-bold text-xs text-white group-hover:text-gaming-cyan transition-colors truncate max-w-[120px]">
                    {order.shippingAddress?.prenom || order.user?.prenom} {order.shippingAddress?.nom || order.user?.nom}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-orbitron font-bold text-xs text-gaming-cyan">{order.totalPrice?.toLocaleString('fr-DZ')} DA</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full mt-1 inline-block font-bold border"
                    style={{ backgroundColor: `${STATUS_COLORS[order.status] || '#94a3b8'}15`, color: STATUS_COLORS[order.status] || '#94a3b8', borderColor: `${STATUS_COLORS[order.status] || '#94a3b8'}30` }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {!analytics.recentOrders?.length && <p className="text-center text-gray-500 text-sm py-8">Aucune commande récente</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-6">
            <Star className="text-yellow-400 w-5 h-5 fill-yellow-400" /> Top Produits
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-72 scrollbar-hide pr-1">
            {(analytics.mostOrderedProducts || []).map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-white/3 hover:bg-white/5 rounded-xl border border-white/5 transition-colors group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-black text-sm flex-shrink-0 ${i === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : i === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' : i === 2 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white truncate group-hover:text-gaming-cyan transition-colors">{p._id || 'Produit inconnu'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.totalOrdered} vendus</p>
                </div>
                <p className="font-orbitron font-bold text-xs text-gaming-cyan flex-shrink-0">{(p.revenue || 0).toLocaleString('fr-DZ')} DA</p>
              </div>
            ))}
            {(!analytics.mostOrderedProducts || analytics.mostOrderedProducts.length === 0) && <p className="text-center text-gray-500 text-sm py-8">Pas encore de données</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="glass-premium rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-black font-orbitron uppercase tracking-widest text-white flex items-center gap-2 mb-6">
            <Users className="text-gaming-green w-5 h-5" /> Meilleurs Clients
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-72 scrollbar-hide pr-1">
            {(analytics.mostActiveCustomers || []).map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-white/3 hover:bg-white/5 rounded-xl border border-white/5 transition-colors group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple/30 to-gaming-blue/30 border border-white/10 flex items-center justify-center font-orbitron font-black text-xs text-white flex-shrink-0">
                  {c.prenom?.[0]}{c.nom?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white group-hover:text-gaming-cyan transition-colors">{c.prenom} {c.nom}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{c.orderCount} commande(s)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-orbitron font-bold text-xs text-gaming-cyan">{(c.totalSpent || 0).toLocaleString('fr-DZ')} DA</p>
                </div>
              </div>
            ))}
            {(!analytics.mostActiveCustomers || analytics.mostActiveCustomers.length === 0) && <p className="text-center text-gray-500 text-sm py-8">Pas encore de données</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
