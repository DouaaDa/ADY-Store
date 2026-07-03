import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  phone: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est obligatoire']
  },
  message: {
    type: String,
    required: [true, 'Le message est obligatoire']
  },
  reply: {
    type: String,
    default: ''
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Archived'],
    default: 'Unread'
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
