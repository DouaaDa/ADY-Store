import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Settings, Save, Store, Mail, Phone, MapPin, DollarSign,
  Palette, Shield, Globe, Bell, Package, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';

const SettingsManager = () => {
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/settings', config);
      setSettings(data);
    } catch (err) {
      toast.error('Erreur de chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings', settings, config);
      toast.success('Paramètres enregistrés avec succès !');
    } catch (err) {
      toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const update = (path, value) => {
    const keys = path.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Store },
    { id: 'commerce', label: 'Commerce', icon: Package },
    { id: 'theme', label: 'Apparence', icon: Palette },
    { id: 'homepage', label: 'Accueil', icon: Eye },
    { id: 'social', label: 'Réseaux Sociaux', icon: Globe },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'seo', label: 'SEO & CMS', icon: Eye },
  ];

  const InputField = ({ label, value, onChange, type = 'text', icon: Icon, placeholder }) => (
    <div>
      <label className="text-sm text-gray-400 font-medium mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-black/30 border border-white/10 rounded-xl py-2.5 ${Icon ? 'pl-9' : 'pl-4'} pr-4 text-sm focus:outline-none focus:border-gaming-purple/60 transition-colors`}
        />
      </div>
    </div>
  );

  const Toggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div>
        <p className="font-medium text-sm">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`p-1 rounded-full transition-colors ${value ? 'text-gaming-purple' : 'text-gray-500'}`}
      >
        {value ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple" />
    </div>
  );

  if (!settings) return (
    <div className="text-center text-gray-400 py-20">
      <Settings className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>Impossible de charger les paramètres</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 text-glow">Paramètres</h1>
          <p className="text-gray-400">Configuration globale de la boutique ADY Store.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gaming-purple hover:bg-gaming-blue text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gaming-purple text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl"
      >
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Store className="w-5 h-5 text-gaming-purple" /> Informations Boutique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nom de la boutique" value={settings.storeName} onChange={v => update('storeName', v)} icon={Store} />
              <InputField label="Email" value={settings.storeEmail} onChange={v => update('storeEmail', v)} icon={Mail} type="email" />
              <InputField label="Téléphone" value={settings.storePhone} onChange={v => update('storePhone', v)} icon={Phone} />
              <InputField label="Devise" value={settings.currency} onChange={v => update('currency', v)} icon={DollarSign} />
            </div>
            <InputField label="Adresse" value={settings.storeAddress} onChange={v => update('storeAddress', v)} icon={MapPin} />
          </div>
        )}

        {activeTab === 'commerce' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Package className="w-5 h-5 text-gaming-purple" /> Paramètres Commerce</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Taxe (%)" value={settings.taxRate} onChange={v => update('taxRate', v)} type="number" />
              <InputField label="Frais de livraison (DZD)" value={settings.shippingFee} onChange={v => update('shippingFee', v)} type="number" />
              <InputField label="Livraison gratuite à partir de (DZD)" value={settings.freeShippingThreshold} onChange={v => update('freeShippingThreshold', v)} type="number" />
              <InputField label="Seuil d'alerte stock" value={settings.stockAlertThreshold} onChange={v => update('stockAlertThreshold', v)} type="number" />
            </div>
            <div className="space-y-3">
              <Toggle label="Notifications de commandes" description="Recevoir des notifications lors de nouvelles commandes" value={settings.orderNotifications} onChange={v => update('orderNotifications', v)} />
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Palette className="w-5 h-5 text-gaming-purple" /> Apparence</h2>
            
            {/* Logos & Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <label className="text-sm text-gray-400 font-medium mb-1.5 block">Logo du site</label>
                <div className="flex gap-4 items-center">
                  {settings.storeLogo && <img src={settings.storeLogo} alt="Logo" className="h-12 w-auto bg-black/50 p-2 rounded" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const fd = new FormData(); fd.append('logo', file);
                    try { const res = await axios.post('/api/upload/logo', fd, config); update('storeLogo', res.data.url); toast.success('Logo uploadé'); } catch(err) { toast.error('Erreur upload'); }
                  }} className="text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium mb-1.5 block">Favicon</label>
                <div className="flex gap-4 items-center">
                  {settings.favicon && <img src={settings.favicon} alt="Favicon" className="h-8 w-8 bg-black/50 p-1 rounded" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const fd = new FormData(); fd.append('favicon', file);
                    try { const res = await axios.post('/api/upload/favicon', fd, config); update('favicon', res.data.url); toast.success('Favicon uploadé'); } catch(err) { toast.error('Erreur upload'); }
                  }} className="text-sm" />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'primaryColor', label: 'Couleur Primaire' },
                { key: 'secondaryColor', label: 'Couleur Secondaire' },
                { key: 'bgColor', label: 'Fond de page' },
                { key: 'textColor', label: 'Texte principal' },
                { key: 'buttonColor', label: 'Boutons' },
                { key: 'accentColor', label: 'Accent' },
                { key: 'headerColor', label: 'En-tête (Header)' },
                { key: 'footerColor', label: 'Pied de page (Footer)' },
              ].map(c => (
                <div key={c.key}>
                  <label className="text-sm text-gray-400 font-medium mb-1.5 block">{c.label}</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings[c.key] || '#ffffff'} onChange={e => update(c.key, e.target.value)} className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer p-0" />
                    <input type="text" value={settings[c.key] || ''} onChange={e => update(c.key, e.target.value)} className="w-full bg-black/30 border border-white/10 rounded py-2 px-3 text-xs focus:outline-none focus:border-gaming-purple/60" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Toggle label="Mode maintenance" description="La boutique sera inaccessible aux clients" value={settings.maintenanceMode} onChange={v => update('maintenanceMode', v)} />
            </div>
          </div>
        )}

        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Eye className="w-5 h-5 text-gaming-purple" /> Personnalisation Accueil (Hero)</h2>
              <div className="flex gap-4">
                <Toggle label="Afficher le Hero" value={settings.showHero} onChange={v => update('showHero', v)} />
              </div>
            </div>

            {/* Hero Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Titre Principal" value={settings.heroTitle} onChange={v => update('heroTitle', v)} />
              <InputField label="Sous-titre" value={settings.heroSubtitle} onChange={v => update('heroSubtitle', v)} />
            </div>

            {/* Image Uploader Helper Component */}
            {(() => {
              const ImageUploadBox = ({ label, fieldPath, placeholder }) => {
                const url = fieldPath.split('.').reduce((o, i) => o?.[i], settings) || placeholder;
                const isPlaceholder = url === placeholder;

                const handleUpload = async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('images', file);
                  try {
                    const res = await axios.post('/api/upload/image', fd, config);
                    if (res.data.urls?.length > 0) {
                      update(fieldPath, res.data.urls[0]);
                      toast.success(`${label} uploadé avec succès`);
                    }
                  } catch (err) {
                    toast.error(`Erreur upload ${label}`);
                  }
                };

                return (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                    <label className="text-sm font-bold text-gray-300 mb-3 block">{label}</label>
                    <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden border border-dashed border-white/20 group-hover:border-gaming-cyan transition-colors">
                      {url && <img src={url} alt={label} className={`w-full h-full object-cover ${isPlaceholder ? 'opacity-30' : ''}`} />}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <span className="text-xs font-bold text-white bg-gaming-purple px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gaming-blue transition-colors">
                          Changer l'image
                          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </span>
                        {!isPlaceholder && (
                          <button onClick={() => update(fieldPath, '')} className="text-xs text-red-400 hover:text-red-300">
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <>
                  <h3 className="text-md font-bold text-gaming-cyan mt-6 border-b border-white/10 pb-2">Images Principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadBox label="Image de fond (Background)" fieldPath="heroConfig.background" placeholder="/assets/hero_rgb.png" />
                    <ImageUploadBox label="Image principale (Featured)" fieldPath="heroConfig.featured" placeholder="/assets/product_placeholder.png" />
                  </div>

                  <div className="flex items-center justify-between mt-8 border-b border-white/10 pb-2">
                    <h3 className="text-md font-bold text-gaming-purple">Cartes Flottantes (Floating Cards)</h3>
                    <button 
                      onClick={() => {
                        const cards = [...(settings.heroConfig?.floatingCards || [])];
                        cards.push({ image: '', title: 'Nouveau', subtitle: 'Sous-titre', enabled: true, position: 'top-right', order: cards.length });
                        update('heroConfig.floatingCards', cards);
                      }}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                    >
                      + Ajouter une carte
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {(settings.heroConfig?.floatingCards || []).map((card, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 relative">
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                          <Toggle value={card.enabled} onChange={v => update(`heroConfig.floatingCards.${index}.enabled`, v)} />
                          <button onClick={() => {
                            const cards = settings.heroConfig.floatingCards.filter((_, i) => i !== index);
                            update('heroConfig.floatingCards', cards);
                          }} className="text-red-500 hover:text-red-400">
                            <span className="sr-only">Delete</span>×
                          </button>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="w-1/3">
                            <ImageUploadBox label="Icône / Image" fieldPath={`heroConfig.floatingCards.${index}.image`} placeholder="" />
                          </div>
                          <div className="w-2/3 space-y-3 pt-6">
                            <InputField label="Titre" value={card.title} onChange={v => update(`heroConfig.floatingCards.${index}.title`, v)} />
                            <InputField label="Sous-titre" value={card.subtitle} onChange={v => update(`heroConfig.floatingCards.${index}.subtitle`, v)} />
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Position</label>
                              <select 
                                value={card.position} 
                                onChange={e => update(`heroConfig.floatingCards.${index}.position`, e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded py-2 px-3 text-xs focus:outline-none"
                              >
                                <option value="top-right">Haut Droite</option>
                                <option value="bottom-left">Bas Gauche</option>
                                <option value="top-left">Haut Gauche</option>
                                <option value="bottom-right">Bas Droite</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!settings.heroConfig?.floatingCards || settings.heroConfig.floatingCards.length === 0) && (
                      <div className="col-span-full text-center text-gray-500 py-6">Aucune carte flottante configurée</div>
                    )}
                  </div>
                </>
              );
            })()}

            <div className="space-y-4 pt-4 border-t border-white/10">
              <Toggle label="Afficher la bannière promotionnelle" value={settings.showPromo} onChange={v => update('showPromo', v)} />
              <div>
                <label className="text-sm text-gray-400 font-medium mb-1.5 block">Image Promotionnelle</label>
                <div className="flex gap-4 items-center">
                  {settings.promoBanner && <img src={settings.promoBanner} alt="Promo" className="h-16 w-32 object-cover bg-black/50 p-1 rounded" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const fd = new FormData(); fd.append('images', file);
                    try { const res = await axios.post('/api/upload/image', fd, config); update('promoBanner', res.data.urls[0]); toast.success('Image uploadée'); } catch(err) { toast.error('Erreur upload'); }
                  }} className="text-sm" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-gaming-purple" /> Réseaux Sociaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Facebook" value={settings.socialLinks?.facebook} onChange={v => update('socialLinks.facebook', v)} placeholder="https://facebook.com/..." />
              <InputField label="Instagram" value={settings.socialLinks?.instagram} onChange={v => update('socialLinks.instagram', v)} placeholder="https://instagram.com/..." />
              <InputField label="Twitter / X" value={settings.socialLinks?.twitter} onChange={v => update('socialLinks.twitter', v)} placeholder="https://twitter.com/..." />
              <InputField label="YouTube" value={settings.socialLinks?.youtube} onChange={v => update('socialLinks.youtube', v)} placeholder="https://youtube.com/..." />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-gaming-purple" /> Sécurité & Accès</h2>
            <div className="space-y-3">
              <Toggle label="Autoriser les inscriptions" description="Les nouveaux utilisateurs peuvent s'inscrire" value={settings.allowRegistration} onChange={v => update('allowRegistration', v)} />
              <Toggle label="Vérification email requise" description="Les utilisateurs doivent vérifier leur email" value={settings.requireEmailVerification} onChange={v => update('requireEmailVerification', v)} />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Eye className="w-5 h-5 text-gaming-purple" /> SEO & Contenu Page d'Accueil</h2>
            <div className="space-y-4">
              <InputField label="Titre Meta (SEO)" value={settings.metaTitle} onChange={v => update('metaTitle', v)} placeholder="ADY Store - Gaming Algeria" />
              <div>
                <label className="text-sm text-gray-400 font-medium mb-1.5 block">Description Meta (SEO)</label>
                <textarea
                  value={settings.metaDescription ?? ''}
                  onChange={(e) => update('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-gaming-purple/60 resize-none"
                  placeholder="Description courte de votre boutique..."
                />
              </div>
              <InputField label="Titre Hero (page d'accueil)" value={settings.heroTitle} onChange={v => update('heroTitle', v)} placeholder="Level Up Your Gaming Experience" />
              <div>
                <label className="text-sm text-gray-400 font-medium mb-1.5 block">Sous-titre Hero</label>
                <textarea
                  value={settings.heroSubtitle ?? ''}
                  onChange={(e) => update('heroSubtitle', e.target.value)}
                  rows={2}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-gaming-purple/60 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Save button (mobile bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gaming-purple hover:bg-gaming-blue text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Sauvegarder les paramètres'}
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;
