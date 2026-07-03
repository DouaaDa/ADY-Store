import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import exceljs from 'exceljs';
import path from 'path';

// @desc    Download Orders Excel
// @route   GET /api/reports/orders
// @access  Private/Admin
export const getOrdersExcel = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'nom prenom email').sort({ createdAt: -1 });

    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Commandes');

    sheet.columns = [
      { header: 'ID Commande', key: 'id', width: 30 },
      { header: 'Client', key: 'client', width: 30 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Prix Total', key: 'totalPrice', width: 15 },
      { header: 'Méthode Paiement', key: 'paymentMethod', width: 20 },
      { header: 'Statut Paiement', key: 'paymentStatus', width: 15 },
      { header: 'Société Livraison', key: 'deliveryCompany', width: 20 },
      { header: 'Tracking Number', key: 'trackingNumber', width: 20 },
      { header: 'Statut', key: 'status', width: 15 },
    ];

    orders.forEach(order => {
      sheet.addRow({
        id: order._id.toString(),
        client: order.user ? `${order.user.nom} ${order.user.prenom}` : order.shippingAddress.nom,
        date: new Date(order.createdAt).toLocaleDateString(),
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryCompany: order.deliveryCompany,
        trackingNumber: order.trackingNumber || '',
        status: order.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Commandes.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Download Customers Excel
// @route   GET /api/reports/customers
// @access  Private/Admin
export const getCustomersExcel = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).sort({ createdAt: -1 });

    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Clients');

    sheet.columns = [
      { header: 'ID Client', key: 'id', width: 30 },
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Téléphone', key: 'telephone', width: 20 },
      { header: 'Date Inscription', key: 'date', width: 20 },
      { header: 'Statut', key: 'status', width: 15 },
    ];

    customers.forEach(customer => {
      sheet.addRow({
        id: customer._id.toString(),
        nom: customer.nom,
        prenom: customer.prenom,
        email: customer.email,
        telephone: customer.telephone,
        date: new Date(customer.createdAt).toLocaleDateString(),
        status: customer.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Clients.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Download Products Excel
// @route   GET /api/reports/products
// @access  Private/Admin
export const getProductsExcel = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 });

    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Produits');

    sheet.columns = [
      { header: 'ID Produit', key: 'id', width: 30 },
      { header: 'Nom', key: 'name', width: 40 },
      { header: 'Marque', key: 'brand', width: 20 },
      { header: 'Catégorie', key: 'category', width: 20 },
      { header: 'Prix (DA)', key: 'price', width: 15 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Ventes', key: 'sales', width: 10 },
      { header: 'Statut', key: 'status', width: 15 },
    ];

    products.forEach(product => {
      sheet.addRow({
        id: product._id.toString(),
        name: product.name,
        brand: product.brand,
        category: product.category ? product.category.name : '',
        price: product.price,
        stock: product.countInStock,
        sales: product.purchases || 0,
        status: product.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Produits.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
