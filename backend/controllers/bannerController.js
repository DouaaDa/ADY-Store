import Banner from '../models/Banner.js';

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isEnabled: true })
      .sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
export const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, link, mediaUrl, mediaType, public_id, order, isEnabled, startDate, endDate } = req.body;

    const banner = new Banner({
      title,
      subtitle,
      buttonText,
      link,
      mediaUrl,
      mediaType,
      public_id,
      order,
      isEnabled,
      startDate,
      endDate,
      user: req.user._id
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, link, mediaUrl, mediaType, public_id, order, isEnabled, startDate, endDate } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title || banner.title;
      banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
      banner.buttonText = buttonText !== undefined ? buttonText : banner.buttonText;
      banner.link = link !== undefined ? link : banner.link;
      banner.mediaUrl = mediaUrl || banner.mediaUrl;
      banner.mediaType = mediaType || banner.mediaType;
      banner.public_id = public_id !== undefined ? public_id : banner.public_id;
      banner.order = order !== undefined ? order : banner.order;
      banner.isEnabled = isEnabled !== undefined ? isEnabled : banner.isEnabled;
      banner.startDate = startDate !== undefined ? startDate : banner.startDate;
      banner.endDate = endDate !== undefined ? endDate : banner.endDate;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      await Banner.deleteOne({ _id: banner._id });
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
