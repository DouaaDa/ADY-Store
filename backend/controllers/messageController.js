import Message from '../models/Message.js';
import { logActivity, createNotification } from '../utils/helpers.js';

// @desc    Submit contact message
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    await createNotification(
      'NEW_MESSAGE',
      'Nouveau message de contact',
      `${name} a envoyé un message : "${subject}"`,
      `/admin/messages`
    );

    // Emit real-time event
    if (req.io) {
      req.io.emit('new_message', { messageId: newMessage._id, name, subject });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const filter = req.query.archived === 'true' ? { status: 'Archived' } : { status: { $ne: 'Archived' } };
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read (Lu)
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
export const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }
    message.isResolved = true;
    message.status = 'Read';
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Archive a message
// @route   PUT /api/messages/:id/archive
// @access  Private/Admin
export const archiveMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }
    message.status = 'Archived';
    await message.save();
    await logActivity('Message Archived', req.user._id, `Archived message from: ${message.email}`);
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }
    await Message.deleteOne({ _id: message._id });
    await logActivity('Message Deleted', req.user._id, `Message de: ${message.email}`);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply & Resolve a message
// @route   PUT /api/messages/:id/reply
// @access  Private/Admin
export const replyToMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);

    if (message) {
      message.reply = reply;
      message.isResolved = true;
      message.status = 'Read';
      const updatedMessage = await message.save();

      await logActivity('Contact Message Replied', req.user._id, `Replied to: ${message.email}`);
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
