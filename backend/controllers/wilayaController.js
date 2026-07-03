import Wilaya from '../models/Wilaya.js';

// Seed initial Wilayas if collection is empty
export const seedWilayasIfNeeded = async () => {
  try {
    const count = await Wilaya.countDocuments();
    if (count > 0) return;

    const defaultWilayas = [
      { code: '01', name: 'Adrar', homePrice: 1000, officePrice: 700, deliveryDays: 5, communes: ['Adrar', 'Reggane', 'Timimoun', 'Zaouiet Kounta'] },
      { code: '02', name: 'Chlef', homePrice: 600, officePrice: 400, deliveryDays: 3, communes: ['Chlef', 'Oued Fodda', 'Ténès', 'Ouled Farès'] },
      { code: '03', name: 'Laghouat', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Laghouat', 'Aflou', 'Hassi R\'Mel', 'Ain Madhi'] },
      { code: '04', name: 'Oum El Bouaghi', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Oum El Bouaghi', 'Ain Beida', 'Ain M\'lila', 'Ain Fakroun'] },
      { code: '05', name: 'Batna', homePrice: 700, officePrice: 450, deliveryDays: 3, communes: ['Batna', 'Arris', 'Barika', 'Merouana'] },
      { code: '06', name: 'Béjaïa', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Béjaïa', 'Akbou', 'Amizour', 'Kherrata'] },
      { code: '07', name: 'Biskra', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['Biskra', 'Tolga', 'Ouled Djellal', 'Sidi Okba'] },
      { code: '08', name: 'Béchar', homePrice: 900, officePrice: 600, deliveryDays: 5, communes: ['Béchar', 'Kenadsa', 'Taghit', 'Abadla'] },
      { code: '09', name: 'Blida', homePrice: 500, officePrice: 300, deliveryDays: 2, communes: ['Blida', 'Boufarik', 'Ouled Yaïch', 'Larbaa'] },
      { code: '10', name: 'Bouira', homePrice: 600, officePrice: 350, deliveryDays: 3, communes: ['Bouira', 'Lakhdaria', 'Sour El Ghozlane', 'M\'Chedallah'] },
      { code: '11', name: 'Tamanrasset', homePrice: 1200, officePrice: 800, deliveryDays: 6, communes: ['Tamanrasset', 'In Salah', 'In Ghar', 'Abalessa'] },
      { code: '12', name: 'Tébessa', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['Tébessa', 'Bir El Ater', 'Cheria', 'Ouenza'] },
      { code: '13', name: 'Tlemcen', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Tlemcen', 'Maghnia', 'Ghazaouet', 'Remchi'] },
      { code: '14', name: 'Tiaret', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Tiaret', 'Sougueur', 'Frenda', 'Mahdia'] },
      { code: '15', name: 'Tizi Ouzou', homePrice: 600, officePrice: 350, deliveryDays: 3, communes: ['Tizi Ouzou', 'Azazga', 'Larbaâ Nath Irathen', 'Draâ El Mizan'] },
      { code: '16', name: 'Alger', homePrice: 400, officePrice: 250, deliveryDays: 1, communes: ['Alger Centre', 'Sidi M\'Hamed', 'Bab El Oued', 'El Harrach', 'Kouba', 'Hydra', 'Bir Mourad Raïs', 'Zéralda', 'Cheraga', 'Rouïba', 'Reghaïa', 'Hussein Dey'] },
      { code: '17', name: 'Djelfa', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Djelfa', 'Hassi Bahbah', 'Ain Oussera', 'Messaad'] },
      { code: '18', name: 'Jijel', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Jijel', 'Taher', 'El Milia', 'Chekfa'] },
      { code: '19', name: 'Sétif', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Sétif', 'El Eulma', 'Ain Oulmene', 'Bouandas'] },
      { code: '20', name: 'Saïda', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['Saïda', 'Hassasna', 'Ain El Hadjar', 'Youb'] },
      { code: '21', name: 'Skikda', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Skikda', 'Collo', 'El Harrouch', 'Azzaba'] },
      { code: '22', name: 'Sidi Bel Abbès', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Sidi Bel Abbès', 'Sfisef', 'Tessala', 'Telagh'] },
      { code: '23', name: 'Annaba', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Annaba', 'El Bouni', 'Sidi Amar', 'Berrahal'] },
      { code: '24', name: 'Guelma', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Guelma', 'Bouchegouf', 'Oued Zenati', 'Heliopolis'] },
      { code: '25', name: 'Constantine', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Constantine', 'El Khroub', 'Hamma Bouziane', 'Didouche Mourad'] },
      { code: '26', name: 'Médéa', homePrice: 600, officePrice: 350, deliveryDays: 3, communes: ['Médéa', 'Berrouaghia', 'Ksar El Boukhari', 'Tablat'] },
      { code: '27', name: 'Mostaganem', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Mostaganem', 'Ain Nouïssy', 'Sidi Ali', 'Bouguirat'] },
      { code: '28', name: 'M\'Sila', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['M\'Sila', 'Bou Saâda', 'Sidi Aïssa', 'Ain El Melh'] },
      { code: '29', name: 'Mascara', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Mascara', 'Sig', 'Mohammadia', 'Ghriss'] },
      { code: '30', name: 'Ouargla', homePrice: 850, officePrice: 550, deliveryDays: 5, communes: ['Ouargla', 'Hassi Messaoud', 'Touggourt', 'Rouissat'] },
      { code: '31', name: 'Oran', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Oran', 'Es Senia', 'Bir El Djir', 'Arzew', 'Ain El Turk'] },
      { code: '32', name: 'El Bayadh', homePrice: 800, officePrice: 500, deliveryDays: 5, communes: ['El Bayadh', 'Rogassa', 'Chellala', 'Bougtob'] },
      { code: '33', name: 'Illizi', homePrice: 1100, officePrice: 750, deliveryDays: 6, communes: ['Illizi', 'Djanet', 'In Amenas'] },
      { code: '34', name: 'Bordj Bou Arréridj', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Bordj Bou Arréridj', 'Ras El Oued', 'Mansoura', 'Bordj Ghedir'] },
      { code: '35', name: 'Boumerdès', homePrice: 500, officePrice: 300, deliveryDays: 2, communes: ['Boumerdès', 'Dellys', 'Boudouaou', 'Corso'] },
      { code: '36', name: 'El Tarf', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['El Tarf', 'El Kala', 'Drean', 'Besbes'] },
      { code: '37', name: 'Tindouf', homePrice: 1200, officePrice: 800, deliveryDays: 6, communes: ['Tindouf', 'Umm el Assel'] },
      { code: '38', name: 'Tissemsilt', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Tissemsilt', 'Lardjem', 'Theniet El Had'] },
      { code: '39', name: 'El Oued', homePrice: 800, officePrice: 500, deliveryDays: 5, communes: ['El Oued', 'Guemar', 'Robbah', 'Bayadha'] },
      { code: '40', name: 'Khenchela', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['Khenchela', 'Chechar', 'Kais', 'Babar'] },
      { code: '41', name: 'Souk Ahras', homePrice: 750, officePrice: 500, deliveryDays: 4, communes: ['Souk Ahras', 'Sedrata', 'M\'daourouch'] },
      { code: '42', name: 'Tipaza', homePrice: 500, officePrice: 300, deliveryDays: 2, communes: ['Tipaza', 'Cherchell', 'Kolea', 'Bouharoun'] },
      { code: '43', name: 'Mila', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Mila', 'Chelghoum Laïd', 'Grarem Gouga', 'Teleghma'] },
      { code: '44', name: 'Aïn Defla', homePrice: 650, officePrice: 400, deliveryDays: 3, communes: ['Aïn Defla', 'Khemis Miliana', 'Miliana', 'El Attaf'] },
      { code: '45', name: 'Naâma', homePrice: 800, officePrice: 550, deliveryDays: 5, communes: ['Naâma', 'Ain Sefra', 'Mecheria'] },
      { code: '46', name: 'Aïn Témouchent', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Aïn Témouchent', 'Beni Saf', 'Hammam Bou Hadjar'] },
      { code: '47', name: 'Ghardaïa', homePrice: 800, officePrice: 500, deliveryDays: 5, communes: ['Ghardaïa', 'Metlili', 'El Guerrara', 'Bounoura'] },
      { code: '48', name: 'Relizane', homePrice: 700, officePrice: 450, deliveryDays: 4, communes: ['Relizane', 'Oued Rhiou', 'Mazouna', 'Yellel'] },
      { code: '49', name: 'El M\'Ghair', homePrice: 850, officePrice: 550, deliveryDays: 5, communes: ['El M\'Ghair', 'Djamaa'] },
      { code: '50', name: 'El Menia', homePrice: 900, officePrice: 600, deliveryDays: 5, communes: ['El Menia', 'Hassi Gara'] },
      { code: '51', name: 'Ouled Djellal', homePrice: 800, officePrice: 500, deliveryDays: 4, communes: ['Ouled Djellal', 'Chaïba'] },
      { code: '52', name: 'Bordj Baji Mokhtar', homePrice: 1300, officePrice: 900, deliveryDays: 6, communes: ['Bordj Baji Mokhtar', 'Timiaouine'] },
      { code: '53', name: 'Béni Abbès', homePrice: 950, officePrice: 650, deliveryDays: 5, communes: ['Béni Abbès', 'Kerzaz'] },
      { code: '54', name: 'Timimoun', homePrice: 900, officePrice: 600, deliveryDays: 5, communes: ['Timimoun', 'Aougrout'] },
      { code: '55', name: 'Touggourt', homePrice: 800, officePrice: 500, deliveryDays: 4, communes: ['Touggourt', 'Nezla'] },
      { code: '56', name: 'Djanet', homePrice: 1200, officePrice: 800, deliveryDays: 6, communes: ['Djanet', 'Bordj El Haouas'] },
      { code: '57', name: 'In Salah', homePrice: 1000, officePrice: 700, deliveryDays: 5, communes: ['In Salah', 'Foggaret Ezzaouia'] },
      { code: '58', name: 'In Guezzam', homePrice: 1300, officePrice: 900, deliveryDays: 6, communes: ['In Guezzam', 'Tin Zaouatine'] }
    ];

    await Wilaya.insertMany(defaultWilayas);
    console.log('Successfully seeded 58 Algerian Wilayas in database.');
  } catch (error) {
    console.error('Error seeding Wilayas:', error.message);
  }
};

// @desc    Get all wilayas
// @route   GET /api/wilayas
// @access  Public
export const getWilayas = async (req, res) => {
  try {
    const wilayas = await Wilaya.find({}).sort({ code: 1 });
    res.json(wilayas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a wilaya
// @route   POST /api/wilayas
// @access  Private/Admin
export const createWilaya = async (req, res) => {
  try {
    const { code, name, homePrice, officePrice, deliveryDays, communes } = req.body;
    
    const exists = await Wilaya.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: 'Une wilaya avec ce code existe déjà' });
    }

    const wilaya = new Wilaya({
      code,
      name,
      homePrice,
      officePrice,
      deliveryDays,
      communes: communes || []
    });

    const created = await wilaya.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a wilaya
// @route   PUT /api/wilayas/:id
// @access  Private/Admin
export const updateWilaya = async (req, res) => {
  try {
    const { name, homePrice, officePrice, deliveryDays, communes } = req.body;
    const wilaya = await Wilaya.findById(req.params.id);

    if (wilaya) {
      wilaya.name = name || wilaya.name;
      if (homePrice !== undefined) wilaya.homePrice = homePrice;
      if (officePrice !== undefined) wilaya.officePrice = officePrice;
      if (deliveryDays !== undefined) wilaya.deliveryDays = deliveryDays;
      if (communes !== undefined) wilaya.communes = communes;

      const updated = await wilaya.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Wilaya introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a wilaya
// @route   DELETE /api/wilayas/:id
// @access  Private/Admin
export const deleteWilaya = async (req, res) => {
  try {
    const wilaya = await Wilaya.findById(req.params.id);
    if (wilaya) {
      await Wilaya.deleteOne({ _id: wilaya._id });
      res.json({ message: 'Wilaya supprimée' });
    } else {
      res.status(404).json({ message: 'Wilaya introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
