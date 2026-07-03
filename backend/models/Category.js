import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  icon: {
    type: String // Nom de l'icône Lucide (ex: 'Keyboard', 'Mouse')
  },
  image: {
    url: { type: String },
    public_id: { type: String }
  },
  subCategories: [
    {
      name: { type: String, required: true },
      slug: { type: String }
    }
  ],
  status: {
    type: String,
    enum: ['Actif', 'Inactif'],
    default: 'Actif'
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
