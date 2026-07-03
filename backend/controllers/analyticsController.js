import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    const totalClients = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'nom prenom');
    
    const outOfStockProducts = await Product.find({ countInStock: 0 });
    const lowStockProducts = await Product.find({ countInStock: { $gt: 0, $lte: 5 } });
    const mostViewedProducts = await Product.find({}).sort({ views: -1 }).limit(5);
    
    // Simplistic sales data for chart
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ordersPerMonth = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const mostOrderedProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalOrdered: { $sum: "$orderItems.qty" },
          revenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 }
    ]);

    const topBrands = await Product.aggregate([
      {
        $group: {
          _id: "$brand",
          totalProducts: { $sum: 1 },
          totalViews: { $sum: "$views" }
        }
      },
      { $sort: { totalProducts: -1 } },
      { $limit: 5 }
    ]);

    const topCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 1,
          totalProducts: 1,
          name: "$categoryInfo.name"
        }
      },
      { $sort: { totalProducts: -1 } },
      { $limit: 5 }
    ]);

    const mostActiveCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          orderCount: 1,
          totalSpent: 1,
          nom: "$userInfo.nom",
          prenom: "$userInfo.prenom",
          email: "$userInfo.email"
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      totalClients,
      totalProducts,
      totalCategories,
      recentOrders,
      outOfStockProducts,
      lowStockProducts,
      mostViewedProducts,
      salesData,
      ordersPerMonth,
      mostOrderedProducts,
      topBrands,
      topCategories,
      mostActiveCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
