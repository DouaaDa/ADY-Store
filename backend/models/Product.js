import mongoose from 'mongoose';
import './Category.js'; // Ensures Category model is registered before population

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: {
    type: String,
    enum: ['En attente', 'Approuvé', 'Rejeté'],
    default: 'En attente'
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // L'admin qui a ajouté le produit
  },
  name: {
    type: String,
    required: true
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ['image', 'video'], required: true },
      public_id: { type: String, required: true }
    }
  ],
  featuredMedia: {
    url: { type: String },
    type: { type: String, enum: ['image', 'video'] },
    public_id: { type: String }
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subCategory: {
    type: String // Optional for now, or could be ObjectId
  },
  features: [
    { type: String } // Caractéristiques techniques (ex: Switches Cherry MX, 1ms...)
  ],
  colors: [
    { type: String } // Couleurs disponibles (Legacy)
  ],
  variants: [
    {
      color: { type: String, required: true },
      images: [{ url: String, public_id: String }],
      videos: [{ url: String, public_id: String }],
      stock: { type: Number, required: true, default: 0 },
      sku: { type: String },
      price: { type: Number },
      promotionalPrice: { type: Number }
    }
  ],
  sizes: [
    { type: String } // Tailles disponibles
  ],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  promotionalPrice: {
    type: Number,
    default: null
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Actif', 'Inactif'],
    default: 'Actif'
  },
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  revenueGenerated: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual field pour déterminer la disponibilité automatiquement selon le stock
productSchema.pre('save', function() {
  this.isAvailable = this.countInStock > 0;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
