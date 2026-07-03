import Coupon from '../models/Coupon.js';
import { logActivity } from '../utils/helpers.js';

// @desc    Apply a coupon
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Veuillez saisir un code coupon' });
    }
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(400).json({ message: 'Coupon invalide ou expiré' });
    }

    // Check expiration date
    const now = new Date();
    if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
      return res.status(400).json({ message: 'Ce coupon a expiré' });
    }

    // Check usage limits
    if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({ message: 'Ce coupon a atteint sa limite d\'utilisation' });
    }

    // Check minimum purchase
    if (cartSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Le montant minimum d'achat pour ce coupon est de ${coupon.minOrderAmount} DZD` });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive, description } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Un coupon avec ce code existe déjà' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxUses,
      expiresAt,
      isActive,
      description
    });

    await logActivity('Coupon Created', req.user._id, `Coupon: ${code}`);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive, description } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.code = code ? code.toUpperCase() : coupon.code;
      coupon.discountType = discountType || coupon.discountType;
      coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
      coupon.minOrderAmount = minOrderAmount !== undefined ? minOrderAmount : coupon.minOrderAmount;
      coupon.maxUses = maxUses !== undefined ? maxUses : coupon.maxUses;
      coupon.expiresAt = expiresAt || coupon.expiresAt;
      coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
      coupon.description = description !== undefined ? description : coupon.description;

      const updatedCoupon = await coupon.save();
      await logActivity('Coupon Updated', req.user._id, `Coupon: ${coupon.code}`);
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: 'Coupon introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      await logActivity('Coupon Deleted', req.user._id, `Coupon: ${coupon.code}`);
      res.json({ message: 'Coupon supprimé' });
    } else {
      res.status(404).json({ message: 'Coupon introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
