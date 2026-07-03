import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Settings from './models/Settings.js';
import products from './data/products.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log('🧹 Nettoyage de la base de données...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Settings.deleteMany();

    // ===== USERS (using .save() to trigger bcrypt pre-hook) =====
    console.log('👥 Création des utilisateurs...');

    const usersData = [
      { nom: 'Admin', prenom: 'ADY', email: 'admin@adystore.com', password: 'password123', telephone: '0555000000', wilaya: '16', commune: 'Alger Centre', adresse: 'Rue Didouche Mourad, Alger', role: 'admin', status: 'Actif' },
      { nom: 'Belaïd', prenom: 'Karim', email: 'karim@adystore.com', password: 'password123', telephone: '0777111222', wilaya: '16', commune: 'Sidi M\'Hamed', adresse: '12 Rue des Frères Bouadou', role: 'user', status: 'Actif' },
      { nom: 'Mansouri', prenom: 'Sarah', email: 'sarah@adystore.com', password: 'password123', telephone: '0666333444', wilaya: '31', commune: 'Oran', adresse: '5 Boulevard Soummam', role: 'user', status: 'Actif' },
      { nom: 'Hamidi', prenom: 'Youcef', email: 'youcef@adystore.com', password: 'password123', telephone: '0550555666', wilaya: '25', commune: 'Constantine', adresse: '8 Avenue de l\'Indépendance', role: 'user', status: 'Actif' },
      { nom: 'Ouahrani', prenom: 'Amina', email: 'amina@adystore.com', password: 'password123', telephone: '0660777888', wilaya: '09', commune: 'Blida', adresse: '22 Rue Emir Abdelkader', role: 'user', status: 'Actif' },
      { nom: 'Zouaghi', prenom: 'Rayan', email: 'rayan@adystore.com', password: 'password123', telephone: '0553999000', wilaya: '06', commune: 'Béjaïa', adresse: '3 Route de Souk El Tenine', role: 'user', status: 'Actif' },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = new User(u);
      await user.save(); // triggers bcrypt pre-save hook
      createdUsers.push(user);
    }

    const adminUser = createdUsers[0];
    const customers = createdUsers.slice(1);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);

    // ===== CATEGORIES =====
    console.log('📂 Création des catégories...');
    const categoriesData = [
      { name: 'Souris Gaming', icon: 'Mouse', status: 'Actif', description: 'Souris gaming filaires et sans fil pour tous les styles de jeu' },
      { name: 'Claviers Gaming', icon: 'Keyboard', status: 'Actif', description: 'Claviers mécaniques et optiques pour les gamers exigeants' },
      { name: 'Casques Gaming', icon: 'Headphones', status: 'Actif', description: 'Casques gaming avec son surround et micro' },
      { name: 'Écrans Gaming', icon: 'MonitorPlay', status: 'Actif', description: 'Écrans haute fréquence pour le gaming compétitif' },
      { name: 'Manettes', icon: 'Gamepad2', status: 'Actif', description: 'Manettes filaires et sans fil pour console et PC' },
      { name: 'Tapis de Souris', icon: 'Square', status: 'Actif', description: 'Tapis de souris gaming pour une précision optimale' },
      { name: 'Chaises Gaming', icon: 'Armchair', status: 'Actif', description: 'Chaises gaming ergonomiques pour les longues sessions' },
      { name: 'Microphones', icon: 'Mic', status: 'Actif', description: 'Microphones USB pour le streaming et le gaming' },
      { name: 'Composants PC', icon: 'Cpu', status: 'Actif', description: 'GPU, CPU, RAM, SSD et accessoires PC gaming' },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ ${categories.length} catégories créées`);

    // ===== PRODUCTS =====
    console.log('🎮 Insertion des produits...');
    const sampleProducts = products.map((product) => {
      const category = categories.find(c => c.name === product.category);
      return {
        ...product,
        user: adminUser._id,
        category: category ? category._id : categories[0]._id
      };
    });

    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} produits créés`);

    // ===== ORDERS =====
    console.log('📦 Création des commandes...');
    const statuses = ['En attente', 'Confirmée', 'Préparation', 'Expédiée', 'Livrée', 'Annulée'];

    const ordersData = [];
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let itemsPrice = 0;

      for (let j = 0; j < numItems; j++) {
        const prod = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = prod.promotionalPrice || prod.price;
        itemsPrice += price * qty;
        orderItems.push({
          product: prod._id,
          name: prod.name,
          qty,
          image: prod.images[0]?.url || '',
          price
        });
      }

      const shippingPrice = 700;
      const totalPrice = itemsPrice + shippingPrice;

      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));

      ordersData.push({
        user: customer._id,
        orderItems,
        shippingAddress: {
          nom: customer.nom,
          prenom: customer.prenom,
          telephone: customer.telephone,
          wilaya: customer.wilaya || '16',
          commune: customer.commune || 'Alger',
          adresse: customer.adresse || 'Algérie'
        },
        paymentMethod: 'Cash On Delivery',
        itemsPrice,
        shippingPrice,
        totalPrice,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        isDelivered: Math.random() > 0.5,
        createdAt: createdDate
      });
    }

    const insertedOrders = await Order.insertMany(ordersData);
    console.log(`✅ ${insertedOrders.length} commandes créées`);

    // ===== COUPONS =====
    console.log('🎟️  Création des coupons...');
    const couponsData = [
      { code: 'BIENVENUE10', discountType: 'percentage', discountValue: 10, minOrderAmount: 5000, maxUses: 100, currentUses: 23, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true, description: 'Coupon de bienvenue 10% de réduction' },
      { code: 'GAMING20', discountType: 'percentage', discountValue: 20, minOrderAmount: 20000, maxUses: 50, currentUses: 12, expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), isActive: true, description: '20% sur les commandes gaming' },
      { code: 'PROMO5000', discountType: 'fixed', discountValue: 5000, minOrderAmount: 30000, maxUses: 30, currentUses: 8, expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), isActive: true, description: '5000 DA de réduction fixe' },
      { code: 'NOEL15', discountType: 'percentage', discountValue: 15, minOrderAmount: 10000, maxUses: 200, currentUses: 67, expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), isActive: false, description: 'Coupon Noël expiré' },
    ];
    const insertedCoupons = await Coupon.insertMany(couponsData);
    console.log(`✅ ${insertedCoupons.length} coupons créés`);

    // ===== SETTINGS =====
    console.log('⚙️  Création des paramètres...');
    await Settings.create({
      storeName: 'ADY Store',
      storeEmail: 'contact@adystore.com',
      storePhone: '0555 123 456',
      storeAddress: 'Rue Didouche Mourad, Alger Centre, 16000 Alger, Algérie',
      currency: 'DZD',
      taxRate: 19,
      shippingFee: 700,
      freeShippingThreshold: 15000,
      theme: 'dark',
      accentColor: '#b026ff',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: false,
      orderNotifications: true,
      stockAlertThreshold: 5,
      socialLinks: {
        facebook: 'https://facebook.com/adystore',
        instagram: 'https://instagram.com/adystore',
        twitter: 'https://twitter.com/adystore',
        youtube: 'https://youtube.com/adystore'
      },
      metaTitle: 'ADY Store - N°1 Gaming Algeria',
      metaDescription: 'La référence gaming en Algérie. Souris, claviers, casques, écrans et accessoires gaming.',
      heroTitle: 'Level Up Your Gaming Experience',
      heroSubtitle: 'Découvrez les meilleurs équipements gaming au meilleur prix en Algérie.',
    });
    console.log('✅ Paramètres créés');

    console.log('\n🚀 =========================================');
    console.log('✅  BASE DE DONNÉES SEEDING TERMINÉ !');
    console.log('=========================================');
    console.log(`📊 Résumé:`);
    console.log(`   👤 Utilisateurs : ${createdUsers.length}`);
    console.log(`   📂 Catégories   : ${categories.length}`);
    console.log(`   🎮 Produits     : ${insertedProducts.length}`);
    console.log(`   📦 Commandes    : ${insertedOrders.length}`);
    console.log(`   🎟️  Coupons      : ${insertedCoupons.length}`);
    console.log('=========================================');
    console.log('🔑 Compte Admin:');
    console.log('   Email    : admin@adystore.com');
    console.log('   Password : password123');
    console.log('🔑 Compte Client (exemple):');
    console.log('   Email    : karim@adystore.com');
    console.log('   Password : password123');
    console.log('=========================================\n');

    process.exit();
  } catch (error) {
    console.error(`❌ Erreur seeder: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Settings.deleteMany();
    console.log('🗑️  Données supprimées avec succès !');
    process.exit();
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
