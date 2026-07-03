import Settings from '../models/Settings.js';
import { logActivity } from '../utils/helpers.js';

// @desc    Get website settings (Public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create defaults
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }

    const {
      storeName,
      storeLogo,
      storeEmail,
      storePhone,
      storeAddress,
      currency,
      taxRate,
      shippingFee,
      freeShippingThreshold,
      theme,
      accentColor,
      maintenanceMode,
      allowRegistration,
      requireEmailVerification,
      orderNotifications,
      stockAlertThreshold,
      socialLinks,
      metaTitle,
      metaDescription,
      heroTitle,
      heroSubtitle,
      heroImage,
      promoBanner,
      showHero,
      showPromo,
      footerInfo,
      primaryColor,
      secondaryColor,
      bgColor,
      headerColor,
      footerColor,
      textColor,
      buttonColor,
      favicon,
      cms
    } = req.body;

    if (storeName !== undefined) settings.storeName = storeName;
    if (storeLogo !== undefined) settings.storeLogo = storeLogo;
    if (storeEmail !== undefined) settings.storeEmail = storeEmail;
    if (storePhone !== undefined) settings.storePhone = storePhone;
    if (storeAddress !== undefined) settings.storeAddress = storeAddress;
    if (currency !== undefined) settings.currency = currency;
    if (taxRate !== undefined) settings.taxRate = taxRate;
    if (shippingFee !== undefined) settings.shippingFee = shippingFee;
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
    if (theme !== undefined) settings.theme = theme;
    if (accentColor !== undefined) settings.accentColor = accentColor;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowRegistration !== undefined) settings.allowRegistration = allowRegistration;
    if (requireEmailVerification !== undefined) settings.requireEmailVerification = requireEmailVerification;
    if (orderNotifications !== undefined) settings.orderNotifications = orderNotifications;
    if (stockAlertThreshold !== undefined) settings.stockAlertThreshold = stockAlertThreshold;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroImage !== undefined) settings.heroImage = heroImage;
    if (promoBanner !== undefined) settings.promoBanner = promoBanner;
    if (showHero !== undefined) settings.showHero = showHero;
    if (showPromo !== undefined) settings.showPromo = showPromo;
    if (footerInfo !== undefined) settings.footerInfo = footerInfo;
    if (metaTitle !== undefined) settings.metaTitle = metaTitle;
    if (metaDescription !== undefined) settings.metaDescription = metaDescription;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settings.secondaryColor = secondaryColor;
    if (bgColor !== undefined) settings.bgColor = bgColor;
    if (headerColor !== undefined) settings.headerColor = headerColor;
    if (footerColor !== undefined) settings.footerColor = footerColor;
    if (textColor !== undefined) settings.textColor = textColor;
    if (buttonColor !== undefined) settings.buttonColor = buttonColor;
    if (favicon !== undefined) settings.favicon = favicon;

    if (socialLinks) {
      settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    }
    if (cms) {
      settings.cms = { ...settings.cms, ...cms };
    }

    const updatedSettings = await settings.save();
    await logActivity('Settings Updated', req.user._id, 'Website settings and customizations updated');
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
