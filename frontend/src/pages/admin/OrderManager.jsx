import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, Search, Eye, X, Check, Truck, Package, Clock, 
  XCircle, ChevronDown, MapPin, Plus, Trash2, Edit2, Calendar, 
  Phone, Mail, Link, AlertTriangle, FileText, Printer, Download,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

const STATUS_CONFIG = {
  'En attente':   { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
  'Confirmée':    { color: 'text-blue-400',   bg: 'bg-blue-500/20',   icon: CheckCircle2 },
  'Préparation':  { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Package },
  'Prête':        { color: 'text-indigo-400', bg: 'bg-indigo-500/20', icon: BoxIcon },
  'Expédiée':     { color: 'text-cyan-400',   bg: 'bg-cyan-500/20',   icon: Truck },
  'Livrée':       { color: 'text-green-400',  bg: 'bg-green-500/20',  icon: Check },
  'Annulée':      { color: 'text-red-400',    bg: 'bg-red-500/20',    icon: XCircle },
};

function BoxIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

const OrderManager = () => {
  const { user } = useSelector(s => s.auth);
  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'delivery'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminNotesText, setAdminNotesText] = useState('');

  // Delivery states
  const [wilayas, setWilayas] = useState([]);
  const [wilayasLoading, setWilayasLoading] = useState(true);
  const [showWilayaModal, setShowWilayaModal] = useState(false);
  const [editingWilaya, setEditingWilaya] = useState(null);
  const [wilayaForm, setWilayaForm] = useState({
    code: '',
    name: '',
    homePrice: 700,
    officePrice: 400,
    deliveryDays: 3,
    communesInput: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/orders/all', config);
      setOrders(data);
    } catch (e) {
      toast.error('Erreur de chargement des commandes');
    }
    setLoading(false);
  };

  const fetchWilayas = async () => {
    setWilayasLoading(true);
    try {
      const { data } = await axios.get('/api/wilayas');
      setWilayas(data);
    } catch (e) {
      toast.error('Erreur de chargement des wilayas');
    }
    setWilayasLoading(false);
  };

  useEffect(() => { 
    fetchOrders(); 
    fetchWilayas();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { status }, config);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      toast.success(`Statut mis à jour : ${status}`);
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
    setUpdatingId(null);
  };

  const saveAdminNotes = async () => {
    try {
      await axios.put(`/api/orders/${selectedOrder._id}/status`, { adminNotes: adminNotesText }, config);
      setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, adminNotes: adminNotesText } : o));
      setSelectedOrder({ ...selectedOrder, adminNotes: adminNotesText });
      toast.success('Notes internes enregistrées');
    } catch (e) {
      toast.error('Erreur sauvegarde des notes');
    }
  };

  // Wilaya managers
  const handleWilayaSubmit = async (e) => {
    e.preventDefault();
    const communesArray = wilayaForm.communesInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const payload = {
      code: wilayaForm.code,
      name: wilayaForm.name,
      homePrice: Number(wilayaForm.homePrice),
      officePrice: Number(wilayaForm.officePrice),
      deliveryDays: Number(wilayaForm.deliveryDays),
      communes: communesArray
    };

    try {
      if (editingWilaya) {
        const { data } = await axios.put(`/api/wilayas/${editingWilaya._id}`, payload, config);
        setWilayas(wilayas.map(w => w._id === editingWilaya._id ? data : w));
        toast.success('Wilaya mise à jour avec succès');
      } else {
        const { data } = await axios.post('/api/wilayas', payload, config);
        setWilayas([...wilayas, data].sort((a,b) => a.code.localeCompare(b.code)));
        toast.success('Wilaya ajoutée avec succès');
      }
      setShowWilayaModal(false);
      setEditingWilaya(null);
      resetWilayaForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur Wilaya');
    }
  };

  const handleEditWilayaClick = (w) => {
    setEditingWilaya(w);
    setWilayaForm({
      code: w.code,
      name: w.name,
      homePrice: w.homePrice,
      officePrice: w.officePrice,
      deliveryDays: w.deliveryDays,
      communesInput: w.communes.join(', ')
    });
    setShowWilayaModal(true);
  };

  const handleDeleteWilaya = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette wilaya et ses tarifs ?')) return;
    try {
      await axios.delete(`/api/wilayas/${id}`, config);
      setWilayas(wilayas.filter(w => w._id !== id));
      toast.success('Wilaya supprimée');
    } catch (err) {
      toast.error('Erreur de suppression');
    }
  };

  const resetWilayaForm = () => {
    setWilayaForm({
      code: '',
      name: '',
      homePrice: 700,
      officePrice: 400,
      deliveryDays: 3,
      communesInput: ''
    });
  };

  const handlePrintOrderInvoice = () => {
    // Open printable page for the order
    const printWindow = window.open(`/order/${selectedOrder._id}`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownloadPDFInvoice = () => {
    // Redirect or let user trigger PDF download in details view
    toast.info('Veuillez télécharger le PDF depuis l\'écran client ci-dessous.');
    window.open(`/order/${selectedOrder._id}`, '_blank');
  };

  const filtered = orders.filter(o => {
    const userName = `${o.user?.nom} ${o.user?.prenom}`.toLowerCase();
    const customerName = `${o.shippingAddress?.prenom} ${o.shippingAddress?.nom}`.toLowerCase();
    const matchSearch = userName.includes(search.toLowerCase()) || 
                        customerName.includes(search.toLowerCase()) || 
                        o._id.includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const StatusBadge = ({ status }) => {
    const conf = STATUS_CONFIG[status] || STATUS_CONFIG['En attente'];
    const Icon = conf.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${conf.bg} ${conf.color}`}>
        <Icon className="w-3.5 h-3.5" /> {status}
      </span>
    );
  };

  const totalRevenue = orders.filter(o => o.status !== 'Annulée').reduce((s, o) => s + o.totalPrice, 0);
  const byStatus = Object.keys(STATUS_CONFIG).map(s => ({ label: s, count: orders.filter(o => o.status === s).length }));

  return (
    <div className="space-y-6">
      {/* Tab Selector & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow">ADY Store Logistique</h1>
          <p className="text-gray-400 mt-1">Gestion des commandes & tarifs d'expédition Yalidine</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 max-w-sm">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-4 py-2 text-xs font-orbitron font-bold uppercase rounded-lg transition-all
              ${activeTab === 'orders' ? 'bg-gaming-blue text-black box-glow-blue' : 'text-gray-400 hover:text-white'}
            `}
          >
            Commandes
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 px-4 py-2 text-xs font-orbitron font-bold uppercase rounded-lg transition-all
              ${activeTab === 'delivery' ? 'bg-gaming-blue text-black box-glow-blue' : 'text-gray-400 hover:text-white'}
            `}
          >
            Tarifs Livraison
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Order Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {byStatus.map(({ label, count }) => {
              const conf = STATUS_CONFIG[label] || STATUS_CONFIG['En attente'];
              return (
                <div key={label} className="glass rounded-xl p-4 text-center cursor-pointer hover:border-white/20 transition-colors"
                  onClick={() => setFilterStatus(filterStatus === label ? '' : label)}>
                  <p className={`text-2xl font-bold ${conf.color}`}>{count}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="glass rounded-2xl p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" placeholder="Rechercher par client, destinataire ou ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gaming-purple"
              />
            </div>
            <select
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gaming-purple"
            >
              <option value="">Tous les statuts</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="glass rounded-xl px-4 py-2.5 text-gaming-blue font-bold flex items-center gap-2">
              Chiffre d'Affaires: {totalRevenue.toLocaleString()} DA
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-gaming-purple rounded-full border-t-transparent animate-spin" />
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-gray-400 text-sm">
                      <th className="px-6 py-4 text-left">Facture</th>
                      <th className="px-6 py-4 text-left">Client / Destinataire</th>
                      <th className="px-6 py-4 text-left">Wilaya & Commune</th>
                      <th className="px-6 py-4 text-left">Articles</th>
                      <th className="px-6 py-4 text-left">Total</th>
                      <th className="px-6 py-4 text-left">Statut</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gaming-cyan font-bold">FAC-{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm">
                            {order.shippingAddress?.prenom} {order.shippingAddress?.nom}
                          </p>
                          <p className="text-xs text-gray-500">{order.shippingAddress?.telephone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-300">{order.shippingAddress?.wilaya}</p>
                          <p className="text-xs text-gray-500">{order.shippingAddress?.commune}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{order.orderItems?.length} article(s)</td>
                        <td className="px-6 py-4 font-orbitron font-bold text-gaming-blue text-sm">{(order.totalPrice || 0).toLocaleString()} DA</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-4">
                          <button onClick={() => { setSelectedOrder(order); setAdminNotesText(order.adminNotes || ''); }} className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                            <Eye className="w-4 h-4" /> Détail
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune commande trouvée</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Delivery Rates Dashboard Tab */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-black/20 p-4 border border-white/5 rounded-2xl">
            <div>
              <h2 className="text-lg font-bold text-white font-orbitron uppercase">Tarifs des 58 Wilayas</h2>
              <p className="text-xs text-gray-400">Modifiez les tarifs Yalidine Express à tout moment.</p>
            </div>
            <button 
              onClick={() => { setEditingWilaya(null); resetWilayaForm(); setShowWilayaModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gaming-blue text-black font-orbitron font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform box-glow-blue cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ajouter Wilaya
            </button>
          </div>

          {wilayasLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-blue" />
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-gray-400 text-sm">
                      <th className="px-6 py-4 text-left">Code</th>
                      <th className="px-6 py-4 text-left">Nom Wilaya</th>
                      <th className="px-6 py-4 text-left">Tarif Domicile</th>
                      <th className="px-6 py-4 text-left">Tarif Bureau</th>
                      <th className="px-6 py-4 text-left">Délais (Jours)</th>
                      <th className="px-6 py-4 text-left">Communes</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                    {wilayas.map((w) => (
                      <tr key={w._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gaming-cyan">{w.code}</td>
                        <td className="px-6 py-4 font-bold text-white">{w.name}</td>
                        <td className="px-6 py-4 font-bold">{w.homePrice.toLocaleString()} DA</td>
                        <td className="px-6 py-4 font-bold">{w.officePrice.toLocaleString()} DA</td>
                        <td className="px-6 py-4">{w.deliveryDays} jours</td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-500" title={w.communes.join(', ')}>
                          {w.communes.join(', ') || 'Aucune commune configurée'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditWilayaClick(w)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                              <Edit2 className="w-3.5 h-3.5 text-gaming-cyan" />
                            </button>
                            <button onClick={() => handleDeleteWilaya(w._id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Dashboard Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:hidden"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gaming-surface border border-white/10 rounded-[2rem] p-8 w-full max-w-5xl max-h-[92vh] overflow-y-auto relative scrollbar-thin"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black font-orbitron uppercase text-white">Fiche Commande</h2>
                    <span className="px-3 py-1 bg-gaming-blue/10 text-gaming-cyan rounded-full text-xs font-bold border border-gaming-blue/30 font-mono">
                      FAC-{selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-mono mt-1">ID: #{selectedOrder._id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Cards info */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Customer Card */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <h3 className="text-xs font-orbitron font-bold text-gaming-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gaming-cyan" /> Informations Destinataire
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Nom complet</p>
                        <p className="font-bold text-white mt-0.5">{selectedOrder.shippingAddress?.prenom} {selectedOrder.shippingAddress?.nom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Téléphone (Click-to-call)</p>
                        <a href={`tel:${selectedOrder.shippingAddress?.telephone}`} className="inline-flex items-center gap-1.5 font-bold text-gaming-blue hover:underline mt-0.5">
                          <Phone className="w-4 h-4" /> {selectedOrder.shippingAddress?.telephone}
                        </a>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 text-xs">Email client</p>
                        <a href={`mailto:${selectedOrder.shippingAddress?.email || selectedOrder.user?.email}`} className="inline-flex items-center gap-1.5 text-white hover:underline mt-0.5">
                          <Mail className="w-4 h-4 text-gray-500" /> {selectedOrder.shippingAddress?.email || selectedOrder.user?.email || 'N/A'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Card */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-xs font-orbitron font-bold text-gaming-purple uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gaming-purple" /> Détail d'Expédition
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 text-xs">Wilaya de livraison</p>
                        <p className="font-bold text-white mt-0.5">{selectedOrder.shippingAddress?.wilaya}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Commune</p>
                        <p className="font-bold text-white mt-0.5">{selectedOrder.shippingAddress?.commune}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 text-xs">Adresse complète</p>
                        <p className="text-gray-300 mt-0.5 leading-relaxed">{selectedOrder.shippingAddress?.adresse}</p>
                      </div>
                      {selectedOrder.shippingAddress?.postalCode && (
                        <div>
                          <p className="text-gray-500 text-xs">Code Postal</p>
                          <p className="font-bold text-white mt-0.5">{selectedOrder.shippingAddress?.postalCode}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-xs">Lien Google Maps</p>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${selectedOrder.shippingAddress?.adresse}, ${selectedOrder.shippingAddress?.commune}, ${selectedOrder.shippingAddress?.wilaya}`
                          )}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-gaming-cyan bg-gaming-cyan/10 px-3 py-1 rounded-lg border border-gaming-cyan/30 hover:bg-gaming-cyan/20 transition-all mt-1"
                        >
                          <Link className="w-3.5 h-3.5" /> Ouvrir dans Maps
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Products Card */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-xs font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" /> Articles de la Commande
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.orderItems?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/3 p-3 rounded-xl border border-white/5">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-black p-1 border border-white/5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qté: {item.qty} × {item.price?.toLocaleString('fr-DZ')} DA
                              {item.color && ` | Couleur: ${item.color}`}
                            </p>
                          </div>
                          <p className="font-orbitron font-black text-sm text-gaming-blue">{(item.qty * item.price).toLocaleString()} DA</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Timeline & Workflow */}
                <div className="space-y-4">
                  {/* Status Timeline */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-xs font-orbitron font-bold text-gaming-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Statut et Progression
                    </h3>
                    
                    {/* Workflow status buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Confirmée')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Confirmée' ? 'bg-blue-500 border-blue-500 text-black' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'}
                        `}
                      >
                        Valider Commande
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Préparation')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Préparation' ? 'bg-purple-500 border-purple-500 text-black' : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'}
                        `}
                      >
                        Préparation
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Prête')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Prête' ? 'bg-indigo-500 border-indigo-500 text-black' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'}
                        `}
                      >
                        Colis Prêt
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Expédiée')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Expédiée' ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'}
                        `}
                      >
                        Expédiée
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Livrée')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Livrée' ? 'bg-green-500 border-green-500 text-black' : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'}
                        `}
                      >
                        Livrée
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'Annulée')}
                        className={`px-3 py-2 text-[10px] font-orbitron font-black uppercase rounded-lg border transition-all cursor-pointer
                          ${selectedOrder.status === 'Annulée' ? 'bg-red-500 border-red-500 text-black' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}
                        `}
                      >
                        Annulée
                      </button>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs flex justify-between items-center mb-4">
                      <span className="text-gray-400">Statut actuel:</span>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>

                  {/* Notes Card */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col">
                    <h3 className="text-xs font-orbitron font-bold text-gray-300 uppercase tracking-widest mb-3">Notes & Remarques</h3>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-xs text-gray-400 mb-3 max-h-20 overflow-y-auto">
                      <p className="font-bold text-white mb-1">Notes Client :</p>
                      {selectedOrder.customerNotes || 'Aucune note de commande.'}
                    </div>
                    <textarea
                      value={adminNotesText}
                      onChange={e => setAdminNotesText(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gaming-purple resize-none h-20 mb-3"
                      placeholder="Ajouter des notes internes..."
                    />
                    <button
                      onClick={saveAdminNotes}
                      className="px-4 py-2 bg-gaming-purple hover:bg-purple-700 text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>

                  {/* Summary & Invoicing Card */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-orbitron font-bold text-white uppercase tracking-widest mb-1">Bilan Commande</h3>
                    <div className="text-xs text-gray-400 space-y-2 border-b border-white/5 pb-3">
                      <div className="flex justify-between"><span>Articles ({selectedOrder.orderItems?.length})</span> <span>{selectedOrder.itemsPrice?.toLocaleString()} DA</span></div>
                      <div className="flex justify-between"><span>Frais Yalidine ({selectedOrder.shippingAddress?.deliveryMethod === 'Home' ? 'Domicile' : 'Bureau'})</span> <span>{selectedOrder.shippingPrice?.toLocaleString()} DA</span></div>
                      <div className="flex justify-between text-sm font-bold text-white"><span>Total Facture</span> <span className="text-gaming-cyan">{selectedOrder.totalPrice?.toLocaleString()} DA</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button onClick={handleDownloadPDFInvoice} className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gaming-blue/20 hover:bg-gaming-blue hover:text-black border border-gaming-blue text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button onClick={handlePrintOrderInvoice} className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer">
                        <Printer className="w-3.5 h-3.5" /> Imprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wilaya Manager Modal */}
      <AnimatePresence>
        {showWilayaModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-gaming-surface border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                <h2 className="text-xl font-bold font-orbitron text-white">
                  {editingWilaya ? 'Modifier Wilaya' : 'Ajouter Wilaya'}
                </h2>
                <button onClick={() => setShowWilayaModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWilayaSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-400 mb-1">Code *</label>
                    <input 
                      required 
                      type="text" 
                      maxLength="2"
                      value={wilayaForm.code} 
                      onChange={e => setWilayaForm({ ...wilayaForm, code: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gaming-purple font-mono"
                      placeholder="16"
                      disabled={!!editingWilaya}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 mb-1">Nom Wilaya *</label>
                    <input 
                      required 
                      type="text" 
                      value={wilayaForm.name} 
                      onChange={e => setWilayaForm({ ...wilayaForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gaming-purple"
                      placeholder="Alger"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Tarif Domicile (DA) *</label>
                    <input 
                      required 
                      type="number" 
                      value={wilayaForm.homePrice} 
                      onChange={e => setWilayaForm({ ...wilayaForm, homePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gaming-purple font-mono"
                      placeholder="600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Tarif Bureau (DA) *</label>
                    <input 
                      required 
                      type="number" 
                      value={wilayaForm.officePrice} 
                      onChange={e => setWilayaForm({ ...wilayaForm, officePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gaming-purple font-mono"
                      placeholder="400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Délais estimé (Jours) *</label>
                  <input 
                    required 
                    type="number" 
                    value={wilayaForm.deliveryDays} 
                    onChange={e => setWilayaForm({ ...wilayaForm, deliveryDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gaming-purple font-mono"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Communes (séparées par des virgules)</label>
                  <textarea 
                    rows="3"
                    value={wilayaForm.communesInput} 
                    onChange={e => setWilayaForm({ ...wilayaForm, communesInput: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gaming-purple resize-none"
                    placeholder="Alger Centre, Sidi M'hamed, Bab El Oued..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowWilayaModal(false)}
                    className="px-4 py-2 border border-white/10 text-white text-xs font-orbitron font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gaming-blue text-black text-xs font-orbitron font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform box-glow-blue cursor-pointer"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal icon component for details
function UserIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default OrderManager;
