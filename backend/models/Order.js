import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      color: { type: String }, // Couleur sélectionnée
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  shippingAddress: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    wilaya: { type: String, required: true },
    commune: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String },
    postalCode: { type: String },
    deliveryMethod: { type: String, default: 'Home' }, // 'Home' or 'Office'
    coordinates: { type: String } // optional, e.g. "36.75,3.05"
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash On Delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Refunded'],
    default: 'Unpaid'
  },
  deliveryCompany: {
    type: String,
    enum: ['Yalidine', 'ZR Express', 'EMS Algeria', 'None'],
    default: 'None'
  },
  trackingNumber: {
    type: String
  },
  shipmentReference: {
    type: String
  },
  shipmentTimeline: [
    {
      status: { type: String },
      date: { type: Date, default: Date.now },
      location: { type: String },
      description: { type: String }
    }
  ],
  estimatedDeliveryDate: {
    type: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['En attente', 'Confirmée', 'Préparation', 'Prête', 'Expédiée', 'Livrée', 'Annulée'],
    default: 'En attente'
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  customerNotes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
