import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { logActivity, createNotification } from '../utils/helpers.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, customerNotes } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Aucun produit dans la commande' });
    }

    // ── Duplicate order check (same user, same products, within 10 minutes) ──
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentProductIds = orderItems.map(i => i.product);
    const duplicate = await Order.findOne({
      user: req.user._id,
      createdAt: { $gte: tenMinutesAgo },
      'orderItems.product': { $all: recentProductIds },
      status: { $nin: ['Annulée'] }
    });
    if (duplicate) {
      return res.status(409).json({
        message: 'Commande en double détectée. Vous avez déjà passé une commande identique il y a moins de 10 minutes.',
        duplicateOrderId: duplicate._id
      });
    }

    // Validate and update stock & statistics for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.name} introuvable` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Stock insuffisant pour ${item.name} (${product.countInStock} restants)` });
      }

      // Update values
      product.countInStock -= item.qty;
      product.purchases = (product.purchases || 0) + item.qty;
      product.revenueGenerated = (product.revenueGenerated || 0) + (item.price * item.qty);
      await product.save();

      // Notifications if stock is low or out
      if (product.countInStock === 0) {
        await createNotification('OUT_OF_STOCK', 'Rupture de stock', `Le produit "${product.name}" est désormais en rupture de stock !`, '/admin/products');
        if (req.io) req.io.emit('low_stock', { type: 'out_of_stock', productName: product.name, stock: 0 });
      } else if (product.countInStock < 5) {
        await createNotification('LOW_STOCK', 'Stock bas', `Le produit "${product.name}" a un stock bas (${product.countInStock} unités restantes).`, '/admin/products');
        if (req.io) req.io.emit('low_stock', { type: 'low_stock', productName: product.name, stock: product.countInStock });
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      customerNotes
    });

    const createdOrder = await order.save();

    // Notifications & activity log
    await createNotification(
      'NEW_ORDER',
      'Nouvelle commande reçue',
      `Commande #${createdOrder._id.toString().substring(0, 8)} d'un montant de ${totalPrice} DZD par ${shippingAddress.prenom} ${shippingAddress.nom}`,
      '/admin/orders'
    );
    await logActivity('Order Created', req.user._id, `Order ID: ${createdOrder._id}`);

    // Emit real-time event
    if (req.io) {
      req.io.emit('new_order', {
        orderId: createdOrder._id,
        total: totalPrice,
        customer: `${shippingAddress.prenom} ${shippingAddress.nom}`
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'nom prenom email');

    if (order) {
      // Allow user who created the order, or admin to view it
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Non autorisé à voir cette commande' });
      }
    } else {
      res.status(404).json({ message: 'Commande introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id nom prenom').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const oldStatus = order.status;
      const newStatus = req.body.status || order.status;

      order.status = newStatus;
      if (req.body.adminNotes !== undefined) order.adminNotes = req.body.adminNotes;
      if (req.body.deliveryCompany !== undefined) order.deliveryCompany = req.body.deliveryCompany;
      if (req.body.trackingNumber !== undefined) order.trackingNumber = req.body.trackingNumber;

      // Add timeline entry
      if (!order.shipmentTimeline) order.shipmentTimeline = [];
      order.shipmentTimeline.push({ status: newStatus, date: new Date(), note: req.body.timelineNote || '' });

      if (newStatus === 'Livrée' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        // Emit real-time delivery event
        if (req.io) {
          req.io.emit('order_delivered', { orderId: order._id, customerName: order.shippingAddress?.prenom });
        }
      }

      // Restore stock if cancelled
      if (newStatus === 'Annulée' && oldStatus !== 'Annulée') {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.countInStock += item.qty;
            product.purchases = Math.max(0, (product.purchases || 0) - item.qty);
            product.revenueGenerated = Math.max(0, (product.revenueGenerated || 0) - (item.price * item.qty));
            await product.save();
          }
        }
      }

      const updatedOrder = await order.save();
      await logActivity('Order Status Updated', req.user._id, `Order: #${order._id} changed from ${oldStatus} to ${newStatus}`);
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Commande introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

