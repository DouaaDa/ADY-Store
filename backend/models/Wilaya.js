import mongoose from 'mongoose';

const wilayaSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  homePrice: {
    type: Number,
    required: true,
    default: 700
  },
  officePrice: {
    type: Number,
    required: true,
    default: 400
  },
  deliveryDays: {
    type: Number,
    required: true,
    default: 3
  },
  communes: [
    {
      type: String
    }
  ]
}, {
  timestamps: true
});

const Wilaya = mongoose.model('Wilaya', wilayaSchema);

export default Wilaya;
