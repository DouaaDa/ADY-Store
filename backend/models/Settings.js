import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'ADY Store'
  },
  storeLogo: {
    type: String,
    default: ''
  },
  storeEmail: {
    type: String,
    default: 'contact@adystore.com'
  },
  storePhone: {
    type: String,
    default: '+213 555 00 00 00'
  },
  storeAddress: {
    type: String,
    default: 'Alger Centre, Algérie'
  },
  currency: {
    type: String,
    default: 'DZD'
  },
  taxRate: {
    type: Number,
    default: 19
  },
  shippingFee: {
    type: Number,
    default: 700
  },
  freeShippingThreshold: {
    type: Number,
    default: 15000
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  accentColor: { type: String, default: '#8B5CF6' },
  primaryColor: { type: String, default: '#8B5CF6' },
  secondaryColor: { type: String, default: '#3B82F6' },
  bgColor: { type: String, default: '#0F0F0F' },
  headerColor: { type: String, default: 'rgba(255, 255, 255, 0.05)' },
  footerColor: { type: String, default: 'rgba(0, 0, 0, 0.5)' },
  textColor: { type: String, default: '#FFFFFF' },
  buttonColor: { type: String, default: '#8B5CF6' },
  favicon: { type: String, default: '' },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  requireEmailVerification: {
    type: Boolean,
    default: false
  },
  orderNotifications: {
    type: Boolean,
    default: true
  },
  stockAlertThreshold: {
    type: Number,
    default: 5
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    discord: { type: String, default: '' }
  },
  metaTitle: {
    type: String,
    default: 'ADY Store - N°1 Gaming Algeria'
  },
  metaDescription: {
    type: String,
    default: 'La référence gaming en Algérie.'
  },
  heroTitle: {
    type: String,
    default: 'Level Up Your Gaming Experience'
  },
  heroSubtitle: {
    type: String,
    default: 'Découvrez les meilleurs équipements gaming au meilleur prix.'
  },
  heroConfig: {
    background: { type: String, default: '/assets/hero_rgb.png' },
    featured: { type: String, default: '/assets/product_placeholder.png' },
    floatingCards: [
      {
        image: { type: String, default: '' },
        title: { type: String, default: 'RTX 4090' },
        subtitle: { type: String, default: 'Puissance Absolue' },
        enabled: { type: Boolean, default: true },
        position: { type: String, default: 'top-right' }, // top-right, bottom-left, etc.
        order: { type: Number, default: 0 }
      }
    ]
  },
  heroImage: { type: String, default: '' },
  promoBanner: { type: String, default: '' },
  showHero: { type: Boolean, default: true },
  showPromo: { type: Boolean, default: true },
  footerInfo: {
    type: String,
    default: '© 2026 ADY Store. Tous droits réservés.'
  },
  cms: {
    about: { type: String, default: 'Nous sommes ADY Store, leader de la vente de matériel gaming premium en Algérie.' },
    faq: { type: String, default: 'Q: Comment puis-je suivre ma commande?\nA: Rendez-vous dans votre espace client.' },
    terms: { type: String, default: 'En achetant sur ADY Store, vous acceptez nos conditions générales de vente.' },
    privacy: { type: String, default: 'Vos données personnelles sont protégées et ne seront jamais partagées.' }
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
