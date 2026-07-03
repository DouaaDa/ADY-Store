import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { logActivity, createNotification } from '../utils/helpers.js';

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i'
      }
    } : {};

    let categoryFilter = {};
    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        categoryFilter = { category: req.query.category };
      } else {
        const cat = await Category.findOne({ name: { $regex: new RegExp(`^${req.query.category}$`, 'i') } });
        if (cat) {
          categoryFilter = { category: cat._id };
        } else {
          categoryFilter = { category: new mongoose.Types.ObjectId() }; // force no results
        }
      }
    }

    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};
    const colorFilter = req.query.color ? { colors: { $in: [req.query.color] } } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);

    // Availability
    const availabilityFilter = {};
    if (req.query.availability === 'inStock') {
      availabilityFilter.countInStock = { $gt: 0 };
    } else if (req.query.availability === 'outOfStock') {
      availabilityFilter.countInStock = 0;
    }

    // Promotion
    const promotionFilter = req.query.promotion === 'true' ? { promotionalPrice: { $ne: null } } : {};

    // Rating
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Popularity
    const popularityFilter = req.query.isPopular === 'true' ? { isPopular: true } : {};

    const filter = { 
      ...keyword, 
      ...categoryFilter, 
      ...brandFilter, 
      ...colorFilter,
      ...availabilityFilter,
      ...promotionFilter,
      ...ratingFilter,
      ...popularityFilter
    };

    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    let sortCriteria = {};
    switch (req.query.sort) {
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'bestSelling':
        sortCriteria = { purchases: -1 };
        break;
      case 'priceHigh':
        sortCriteria = { price: -1 };
        break;
      case 'priceLow':
        sortCriteria = { price: 1 };
        break;
      case 'topRated':
        sortCriteria = { rating: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    const query = Product.find(filter).populate('category', 'name icon').sort(sortCriteria);
    
    if (req.query.limit) {
      query.limit(Number(req.query.limit));
    }
    
    const products = await query;

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name icon');

    if (product) {
      product.views = (product.views || 0) + 1;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, images, media, featuredMedia, brand, category, subCategory, countInStock, colors, sizes, features, isFeatured, isPopular, promotionalPrice, discountPercentage, status } = req.body;

    const product = new Product({
      user: req.user._id,
      name,
      price,
      description,
      images,
      media,
      featuredMedia,
      brand,
      category,
      subCategory,
      countInStock,
      colors,
      sizes,
      features,
      isFeatured,
      isPopular,
      promotionalPrice,
      discountPercentage,
      status
    });

    const createdProduct = await product.save();
    await logActivity('Product Created', req.user._id, `Product: ${name}`);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, media, featuredMedia, brand, category, subCategory, countInStock, colors, sizes, features, isFeatured, isPopular, promotionalPrice, discountPercentage, status } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.media = media || product.media;
      product.featuredMedia = featuredMedia !== undefined ? featuredMedia : product.featuredMedia;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.subCategory = subCategory || product.subCategory;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.colors = colors || product.colors;
      product.sizes = sizes || product.sizes;
      product.features = features || product.features;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPopular = isPopular !== undefined ? isPopular : product.isPopular;
      product.promotionalPrice = promotionalPrice !== undefined ? promotionalPrice : product.promotionalPrice;
      product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
      product.status = status || product.status;

      const updatedProduct = await product.save();
      await logActivity('Product Updated', req.user._id, `Product: ${product.name}`);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      await logActivity('Product Deleted', req.user._id, `Product: ${product.name}`);
      res.json({ message: 'Produit supprimé' });
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Produit déjà évalué par cet utilisateur' });
      }

      const review = {
        name: `${req.user.prenom} ${req.user.nom}`,
        rating: Number(rating),
        comment,
        user: req.user._id,
        status: 'En attente'
      };

      product.reviews.push(review);
      await product.save();

      await createNotification(
        'NEW_REVIEW',
        'Nouveau avis à modérer',
        `Avis de ${review.name} (${rating}/5) pour "${product.name}"`,
        `/admin/reviews`
      );

      res.status(201).json({ message: 'Avis soumis, en attente de modération par l\'administrateur' });
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for moderation (Admin)
// @route   GET /api/products/reviews/all
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({});
    let allReviews = [];

    products.forEach((p) => {
      p.reviews.forEach((r) => {
        allReviews.push({
          _id: r._id,
          productId: p._id,
          productName: p.name,
          user: r.user,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          status: r.status,
          createdAt: r.createdAt
        });
      });
    });

    res.json(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Moderate a review (Admin: Approve or Reject)
// @route   PUT /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
export const moderateReview = async (req, res) => {
  try {
    const { status } = req.body; // 'Approuvé' or 'Rejeté'
    const product = await Product.findById(req.params.productId);

    if (product) {
      const review = product.reviews.id(req.params.reviewId);
      if (review) {
        review.status = status;
        
        // Recalculate average rating using ONLY Approved reviews
        const approvedReviews = product.reviews.filter(r => r.status === 'Approuvé');
        product.numReviews = approvedReviews.length;
        if (product.numReviews > 0) {
          product.rating = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
        } else {
          product.rating = 0;
        }

        await product.save();
        await logActivity('Review Moderated', req.user._id, `Review on "${product.name}" set to ${status}`);
        res.json({ message: `Avis ${status.toLowerCase()} avec succès`, product });
      } else {
        res.status(404).json({ message: 'Avis introuvable' });
      }
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (product) {
      const review = product.reviews.id(req.params.reviewId);
      if (review) {
        product.reviews.pull({ _id: req.params.reviewId });

        // Recalculate rating
        const approvedReviews = product.reviews.filter(r => r.status === 'Approuvé');
        product.numReviews = approvedReviews.length;
        if (product.numReviews > 0) {
          product.rating = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
        } else {
          product.rating = 0;
        }

        await product.save();
        await logActivity('Review Deleted', req.user._id, `Review on "${product.name}" deleted`);
        res.json({ message: 'Avis supprimé avec succès', product });
      } else {
        res.status(404).json({ message: 'Avis introuvable' });
      }
    } else {
      res.status(404).json({ message: 'Produit introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
export const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    })
    .populate('category', 'name icon')
    .limit(8);

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Live search — returns products, brands, categories matching query
// @route   GET /api/products/search?q=
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ products: [], brands: [], categories: [] });
    }

    const regex = new RegExp(q, 'i');

    // Top 8 product matches (name or brand)
    const products = await Product.find({
      $or: [{ name: regex }, { brand: regex }],
      status: { $ne: 'Inactif' }
    })
      .select('name brand price promotionalPrice images countInStock rating')
      .populate('category', 'name')
      .limit(8)
      .lean();

    // Distinct matching brands
    const brandDocs = await Product.distinct('brand', { brand: regex });
    const brands = brandDocs.slice(0, 5);

    // Matching categories
    const catDocs = await Category.find({ name: regex }).select('name icon').limit(5).lean();

    res.json({ products, brands, categories: catDocs, query: q });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low-stock product alerts (stock <= 5)
// @route   GET /api/products/stock-alerts
// @access  Private/Admin
export const getStockAlerts = async (req, res) => {
  try {
    const products = await Product.find({ countInStock: { $lte: 5 } })
      .select('name brand countInStock images status')
      .populate('category', 'name')
      .sort({ countInStock: 1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products with stock info (admin)
// @route   GET /api/products/stock
// @access  Private/Admin
export const getAllStock = async (req, res) => {
  try {
    const products = await Product.find({})
      .select('name brand countInStock images status category variants price promotionalPrice')
      .populate('category', 'name')
      .sort({ countInStock: 1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    const { countInStock, variants } = req.body;

    if (countInStock !== undefined) {
      product.countInStock = Number(countInStock);
    }

    // Update variant stock if provided
    if (variants && Array.isArray(variants)) {
      variants.forEach((v) => {
        const existing = product.variants.id(v._id);
        if (existing) {
          existing.stock = Number(v.stock);
        }
      });
    }

    const updatedProduct = await product.save();

    await logActivity('Stock Updated', req.user._id, `Stock mis à jour pour "${product.name}" → ${product.countInStock} unités`);

    res.json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      countInStock: updatedProduct.countInStock,
      variants: updatedProduct.variants,
      isAvailable: updatedProduct.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
