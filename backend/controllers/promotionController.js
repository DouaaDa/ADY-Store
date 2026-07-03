import Promotion from '../models/Promotion.js';

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = async (req, res) => {
  try {
    const currentDate = new Date();
    // Get currently active promotions
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('products', 'name price images');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all promotions (Admin)
// @route   GET /api/promotions/admin
// @access  Private/Admin
export const getAdminPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({})
      .populate('products', 'name price')
      .sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = async (req, res) => {
  try {
    const { title, description, bannerUrl, bannerPublicId, percentage, startDate, endDate, isActive, products } = req.body;

    const promotion = new Promotion({
      title,
      description,
      bannerUrl,
      bannerPublicId,
      percentage,
      startDate,
      endDate,
      isActive,
      products,
      user: req.user._id
    });

    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = async (req, res) => {
  try {
    const { title, description, bannerUrl, bannerPublicId, percentage, startDate, endDate, isActive, products } = req.body;

    const promotion = await Promotion.findById(req.params.id);

    if (promotion) {
      promotion.title = title || promotion.title;
      promotion.description = description !== undefined ? description : promotion.description;
      promotion.bannerUrl = bannerUrl || promotion.bannerUrl;
      promotion.bannerPublicId = bannerPublicId !== undefined ? bannerPublicId : promotion.bannerPublicId;
      promotion.percentage = percentage !== undefined ? percentage : promotion.percentage;
      promotion.startDate = startDate || promotion.startDate;
      promotion.endDate = endDate || promotion.endDate;
      promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;
      promotion.products = products || promotion.products;

      const updatedPromotion = await promotion.save();
      res.json(updatedPromotion);
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (promotion) {
      await Promotion.deleteOne({ _id: promotion._id });
      res.json({ message: 'Promotion removed' });
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
