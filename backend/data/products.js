const products = [
  // ===== SOURIS GAMING (8 products) =====
  {
    name: 'Logitech G Pro X Superlight 2',
    images: [{ url: 'https://images.unsplash.com/photo-1527814050087-379381547961?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_1' }],
    brand: 'Logitech',
    category: 'Souris Gaming',
    description: 'La souris la plus légère de Logitech G pour l\'eSport. Conception ultra-légère à moins de 60 grammes, capteur HERO 25K pour une précision inégalée. Idéale pour les compétiteurs professionnels.',
    features: ['Capteur HERO 25K', '< 60 grammes', 'Sans fil LIGHTSPEED', 'Pieds en PTFE sans additif', '70h autonomie'],
    colors: ['Noir', 'Blanc'],
    price: 18000, promotionalPrice: 15500, countInStock: 25, rating: 4.9, numReviews: 245, isFeatured: true, isPopular: true
  },
  {
    name: 'Razer DeathAdder V3 HyperSpeed',
    images: [{ url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_2' }],
    brand: 'Razer',
    category: 'Souris Gaming',
    description: 'Souris gaming ergonomique sans fil avec capteur Focus Pro 30K. Design légendaire de la DeathAdder redessiné pour les compétitions. Confort exceptionnel pour les longues sessions.',
    features: ['Capteur Focus Pro 30K', 'Ergonomique', 'Sans fil 2.4GHz', 'Clics optiques Razer'],
    colors: ['Noir'],
    price: 14500, countInStock: 18, rating: 4.7, numReviews: 189
  },
  {
    name: 'SteelSeries Aerox 5 Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_3' }],
    brand: 'SteelSeries',
    category: 'Souris Gaming',
    description: 'Souris gaming sans fil ultra-légère avec 9 boutons programmables et coque perforée pour un poids plume de 74g. Batterie 180h et connexion sans fil ultra-stable.',
    features: ['74g ultra-légère', '9 boutons programmables', '180h autonomie', 'Coque perforée AquaBarrier'],
    colors: ['Noir', 'Blanc'],
    price: 16500, promotionalPrice: 14000, countInStock: 22, rating: 4.6, numReviews: 134
  },
  {
    name: 'Corsair M75 Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_4' }],
    brand: 'Corsair',
    category: 'Souris Gaming',
    description: 'Souris gaming sans fil Bluetooth et 2.4GHz avec capteur PixArt 3395. Éclairage RGB ICUE personnalisable et construction en aluminium haut de gamme.',
    features: ['Capteur PixArt PAW3395', 'Dual wireless BT + 2.4GHz', 'Éclairage ICUE RGB', 'Corps en aluminium'],
    colors: ['Noir', 'Blanc'],
    price: 13500, countInStock: 30, rating: 4.5, numReviews: 87
  },
  {
    name: 'ASUS ROG Gladius III AimPoint',
    images: [{ url: 'https://images.unsplash.com/photo-1527814050087-379381547961?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_5' }],
    brand: 'ASUS ROG',
    category: 'Souris Gaming',
    description: 'Souris gaming filaire avec capteur ROG AimPoint 36000 DPI. Switchs optiques à pousser pour remplacer les boutons usés. Design ergonomique pour les droitiers.',
    features: ['Capteur ROG AimPoint 36000 DPI', 'Switchs optiques remplaçables', '6 boutons programmables', 'Câble paracord'],
    colors: ['Noir'],
    price: 11500, countInStock: 40, rating: 4.4, numReviews: 63
  },
  {
    name: 'Zowie EC2-CW Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_6' }],
    brand: 'Zowie',
    category: 'Souris Gaming',
    description: 'Souris gaming sans fil Zowie pour les joueurs compétitifs exigeants. Aucun logiciel requis, réglages par switches matériels. Préférée par les pros de l\'eSport.',
    features: ['Sans logiciel', 'Réglages hardware', 'Design eSport', 'Plug & Play'],
    colors: ['Noir', 'Blanc'],
    price: 19500, countInStock: 12, rating: 4.8, numReviews: 201
  },
  {
    name: 'Endgame Gear XM2we Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_7' }],
    brand: 'Endgame Gear',
    category: 'Souris Gaming',
    description: 'Souris gaming sans fil ultra-légère de 63g avec capteur PixArt 3370. Conçue pour les compétiteurs sérieux avec une connexion Kailh GM 8.0 ultra-précise.',
    features: ['63g ultra-légère', 'Capteur PixArt 3370', 'Kailh GM 8.0 switches', '80h autonomie'],
    colors: ['Blanc', 'Noir'],
    price: 12500, countInStock: 15, rating: 4.6, numReviews: 92
  },
  {
    name: 'Glorious Model O Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mouse_8' }],
    brand: 'Glorious',
    category: 'Souris Gaming',
    description: 'Souris gaming honeycomb design sans fil avec coque perforée distinctive. Poids ultra-faible de 69g avec éclairage RGB visible à travers les trous.',
    features: ['Design honeycomb', '69g léger', 'Éclairage RGB', 'BAMF Sensor 19000 DPI'],
    colors: ['Noir', 'Blanc', 'Rose'],
    price: 10500, promotionalPrice: 8900, countInStock: 35, rating: 4.5, numReviews: 178
  },

  // ===== CLAVIERS GAMING (8 products) =====
  {
    name: 'Razer Huntsman V3 Pro',
    images: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_1' }],
    brand: 'Razer',
    category: 'Claviers Gaming',
    description: 'Clavier gaming optique analogique avec un temps de réponse proche de zéro. Switchs optiques Razer de 2ème génération, acoustique améliorée et éclairage Chroma RGB personnalisable.',
    features: ['Switchs Optiques Analogiques', 'Taux de rapport 8000Hz', 'Éclairage Razer Chroma RGB', 'Repose-poignet magnétique'],
    colors: ['Noir'],
    price: 32000, countInStock: 10, rating: 4.8, numReviews: 102, isFeatured: true
  },
  {
    name: 'Logitech G815 LIGHTSYNC',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_2' }],
    brand: 'Logitech',
    category: 'Claviers Gaming',
    description: 'Clavier mécanique gaming ultra-plat avec switchs GL à faible déclenchement. Design premium en aluminium avec éclairage RVB LIGHTSYNC et touches multimédia dédiées.',
    features: ['Switchs GL Low Profile', 'Aluminium brossé', 'LIGHTSYNC RGB', 'Touches macro G dédiées'],
    colors: ['Noir'],
    price: 22000, promotionalPrice: 19500, countInStock: 8, rating: 4.6, numReviews: 78
  },
  {
    name: 'Corsair K100 RGB Optique',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_3' }],
    brand: 'Corsair',
    category: 'Claviers Gaming',
    description: 'Le clavier gaming le plus avancé de Corsair avec une molette iCUE AXON, un taux de rapport de 4000Hz et des switchs Corsair OPX optiques. Construction premium en acier.',
    features: ['Switchs OPX Optiques', 'Taux 4000Hz', 'Molette iCUE AXON', 'Châssis en acier inoxydable'],
    colors: ['Noir'],
    price: 35000, countInStock: 6, rating: 4.9, numReviews: 145, isFeatured: true
  },
  {
    name: 'SteelSeries Apex Pro TKL',
    images: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_4' }],
    brand: 'SteelSeries',
    category: 'Claviers Gaming',
    description: 'Clavier TKL compact avec des switchs magnétiques OmniPoint 2 à actuation réglable. Personnalisez chaque touche entre 0.1mm et 4mm d\'actuation.',
    features: ['Switchs OmniPoint 2.0', 'Actuation ajustable 0.1-4mm', 'OLED Smart Display', 'Format TKL compact'],
    colors: ['Noir'],
    price: 28000, promotionalPrice: 25000, countInStock: 14, rating: 4.7, numReviews: 211
  },
  {
    name: 'ASUS ROG Strix Scope II 96',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_5' }],
    brand: 'ASUS ROG',
    category: 'Claviers Gaming',
    description: 'Clavier gaming 96% compact sans fil avec switchs ROG NX Red. Connexion tri-mode (USB, 2.4GHz, Bluetooth) et batterie de 4000mAh pour un usage prolongé.',
    features: ['Switchs ROG NX Red', 'Tri-mode Wireless', 'Batterie 4000mAh', 'Format 96% compact'],
    colors: ['Noir', 'Blanc'],
    price: 24500, countInStock: 18, rating: 4.6, numReviews: 88
  },
  {
    name: 'Ducky One 3 TKL',
    images: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_6' }],
    brand: 'Ducky',
    category: 'Claviers Gaming',
    description: 'Clavier mécanique TKL haut de gamme avec hotswap pour changer vos switchs facilement. Layout TKL propre avec éclairage RGB à 8 zones.',
    features: ['Hotswap compatible', 'Switchs Cherry MX', 'RGB 8 zones', 'PCB double couche'],
    colors: ['Blanc', 'Noir', 'Bleu'],
    price: 19500, countInStock: 20, rating: 4.7, numReviews: 156
  },
  {
    name: 'Keychron Q1 Pro',
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_7' }],
    brand: 'Keychron',
    category: 'Claviers Gaming',
    description: 'Clavier mécanique 75% wireless en aluminium avec Gateron G Pro switches. Compatible Mac et Windows avec connexion Bluetooth 5.1 multi-device.',
    features: ['Coque aluminium CNC', 'Hotswap Gateron switches', 'Bluetooth 5.1 multi-device', '75% compact'],
    colors: ['Gris sidéral', 'Carbone'],
    price: 23000, promotionalPrice: 21000, countInStock: 25, rating: 4.8, numReviews: 342
  },
  {
    name: 'Wooting 60HE',
    images: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop', public_id: 'keyboard_8' }],
    brand: 'Wooting',
    category: 'Claviers Gaming',
    description: 'Clavier 60% révolutionnaire avec technologie Lekker analogique. Actuation réglable par touche et Rapid Trigger pour les joueurs FPS compétitifs.',
    features: ['Technologie Lekker Hall Effect', 'Rapid Trigger', 'Actuation réglable par touche', 'Format 60% ultra-compact'],
    colors: ['Noir'],
    price: 21000, countInStock: 8, rating: 4.9, numReviews: 267
  },

  // ===== CASQUES GAMING (7 products) =====
  {
    name: 'HyperX Cloud Alpha Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_1' }],
    brand: 'HyperX',
    category: 'Casques Gaming',
    description: 'Casque gaming sans fil avec son surround 7.1 virtuel Spatial Audio et une autonomie record de 300 heures. Mousse à mémoire de forme et arceau réglable pour un confort toute la journée.',
    features: ['300h autonomie', 'Son Surround 7.1 Spatial Audio', 'Sans fil 2.4GHz', 'Mousse à mémoire de forme'],
    colors: ['Noir', 'Rouge'],
    price: 22000, countInStock: 15, rating: 4.8, numReviews: 312, isFeatured: true, isPopular: true
  },
  {
    name: 'SteelSeries Arctis Nova Pro Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_2' }],
    brand: 'SteelSeries',
    category: 'Casques Gaming',
    description: 'Le casque gaming haut de gamme avec réduction de bruit active, double pile interchangeable et Nova Pro Acoustic. Compatible PC, PlayStation et Nintendo Switch.',
    features: ['Réduction de bruit active', 'Double pile interchangeable', 'Hi-Res Audio certifié', 'Multi-plateformes'],
    colors: ['Noir', 'Blanc'],
    price: 35000, promotionalPrice: 31000, countInStock: 5, rating: 4.9, numReviews: 156
  },
  {
    name: 'Razer BlackShark V2 Pro',
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_3' }],
    brand: 'Razer',
    category: 'Casques Gaming',
    description: 'Casque gaming sans fil avec les célèbres drivers TriForce Titanium 50mm. Micro détachable avec Razer HyperClear Cardioid pour une clarté vocale parfaite.',
    features: ['Drivers TriForce Titanium 50mm', 'Micro HyperClear Cardioid', '70h autonomie', 'Razer THX Spatial Audio'],
    colors: ['Noir', 'Blanc'],
    price: 26000, countInStock: 20, rating: 4.7, numReviews: 198
  },
  {
    name: 'Logitech G Pro X 2 Lightspeed',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_4' }],
    brand: 'Logitech',
    category: 'Casques Gaming',
    description: 'Casque des pros sans fil LIGHTSPEED, utilisé dans les plus grands tournois eSport. Drivers GRAPHENE de 50mm pour une fidélité sonore exceptionnelle.',
    features: ['Drivers GRAPHENE 50mm', 'LIGHTSPEED sans fil', 'Micro BLUE VO!CE', '50h autonomie'],
    colors: ['Noir'],
    price: 32000, promotionalPrice: 28500, countInStock: 10, rating: 4.8, numReviews: 223
  },
  {
    name: 'Corsair HS80 RGB Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_5' }],
    brand: 'Corsair',
    category: 'Casques Gaming',
    description: 'Casque gaming sans fil avec coussinets en mousse à mémoire de forme et son Dolby Atmos. Micro micro cardioid amovible et bouton de sourdine rapide.',
    features: ['Dolby Atmos', 'Coussinets mousse mémoire', 'Micro amovible', '20h autonomie'],
    colors: ['Blanc', 'Noir'],
    price: 18500, countInStock: 28, rating: 4.5, numReviews: 167
  },
  {
    name: 'Audio-Technica ATH-G1WL',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_6' }],
    brand: 'Audio-Technica',
    category: 'Casques Gaming',
    description: 'Casque gaming sans fil haut de gamme du spécialiste audio. Drivers 45mm de haute qualité, son stéréo Hi-Res et micro directionnel pour une qualité audio audiophile.',
    features: ['Drivers 45mm Hi-Res', 'Sans fil 2.4GHz', 'Micro directionnel', '15h autonomie'],
    colors: ['Noir'],
    price: 29000, countInStock: 7, rating: 4.6, numReviews: 54
  },
  {
    name: 'ASUS ROG Fusion II 500',
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_7' }],
    brand: 'ASUS ROG',
    category: 'Casques Gaming',
    description: 'Casque gaming filaire 7.1 surround avec éclairage AURA Sync RGB. Micro AIBeamforming avec suppression du bruit AI pour une clarté vocale optimale.',
    features: ['7.1 Surround USB', 'Éclairage AURA Sync', 'Micro AIBeamforming', 'Compatible PC/PS5/Switch'],
    colors: ['Noir'],
    price: 15000, promotionalPrice: 13500, countInStock: 35, rating: 4.4, numReviews: 89
  },

  // ===== ÉCRANS GAMING (6 products) =====
  {
    name: 'ASUS ROG Swift OLED PG27AQDP',
    images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c228c6e1be?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_1' }],
    brand: 'ASUS ROG',
    category: 'Écrans Gaming',
    description: 'Écran gaming OLED 27" QHD avec un taux de rafraîchissement de 240Hz et un temps de réponse de 0.03ms. Couleurs parfaites, noirs infinis et luminosité extrême pour une immersion totale.',
    features: ['OLED 27" QHD 2560x1440', '240Hz 0.03ms', 'DisplayHDR True Black 400', 'Compatible G-Sync / FreeSync'],
    colors: ['Noir'],
    price: 85000, countInStock: 3, rating: 4.9, numReviews: 67, isFeatured: true
  },
  {
    name: 'LG UltraGear 27GR95QE-B OLED',
    images: [{ url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_2' }],
    brand: 'LG',
    category: 'Écrans Gaming',
    description: 'Écran gaming OLED 27" QHD 240Hz ultra-rapide. Le premier écran gaming OLED de LG avec des couleurs vraies et un taux de rafraîchissement révolutionnaire.',
    features: ['OLED QHD 2560x1440', '240Hz / 0.03ms', 'VESA DisplayHDR 400', 'NVIDIA G-SYNC Compatible'],
    colors: ['Noir'],
    price: 72000, promotionalPrice: 65000, countInStock: 6, rating: 4.8, numReviews: 93
  },
  {
    name: 'Samsung Odyssey G9 OLED 49"',
    images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c228c6e1be?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_3' }],
    brand: 'Samsung',
    category: 'Écrans Gaming',
    description: 'L\'écran ultra-large légendaire en OLED 49" avec résolution 5120x1440 et 240Hz. Une immersion totale pour le gaming et la productivité grâce à sa courbure 1800R.',
    features: ['OLED 49" 5120x1440', '240Hz / 0.03ms', 'Courbure 1800R', 'G-Sync + FreeSync Premium Pro'],
    colors: ['Blanc'],
    price: 185000, countInStock: 2, rating: 4.9, numReviews: 41
  },
  {
    name: 'MSI MAG274QRF-QD 27"',
    images: [{ url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_4' }],
    brand: 'MSI',
    category: 'Écrans Gaming',
    description: 'Écran gaming IPS QHD 165Hz avec dalle Quantum Dot pour des couleurs riches. Excellent rapport qualité-prix pour le gaming compétitif en haute résolution.',
    features: ['IPS Quantum Dot 27" QHD', '165Hz / 1ms', 'sRGB 98%', 'FreeSync Premium'],
    colors: ['Noir'],
    price: 38000, promotionalPrice: 35000, countInStock: 15, rating: 4.6, numReviews: 112
  },
  {
    name: 'BenQ ZOWIE XL2546K 24.5"',
    images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c228c6e1be?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_5' }],
    brand: 'BenQ ZOWIE',
    category: 'Écrans Gaming',
    description: 'Écran gaming eSport 24.5" 240Hz TN préféré des pros. DyAc+ pour des images ultra-nettes en mouvement, Shield et XL Setting To Share pour la compétition.',
    features: ['TN 24.5" 240Hz', 'DyAc+ Motion Clarity', 'XL Setting To Share', 'Shield anti-distraction'],
    colors: ['Noir'],
    price: 52000, countInStock: 8, rating: 4.7, numReviews: 178
  },
  {
    name: 'Alienware AW3423DWF 34" QD-OLED',
    images: [{ url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2000&auto=format&fit=crop', public_id: 'monitor_6' }],
    brand: 'Alienware',
    category: 'Écrans Gaming',
    description: 'Écran gaming courbe 34" QD-OLED avec résolution UWQHD 3440x1440 à 165Hz. Couleurs époustouflantes avec Delta E < 2 et noirs absolus pour une immersion parfaite.',
    features: ['QD-OLED 34" 3440x1440', '165Hz / 0.1ms', 'FreeSync Premium Pro', 'AlienFX RGB'],
    colors: ['Noir'],
    price: 95000, promotionalPrice: 89000, countInStock: 4, rating: 4.9, numReviews: 58
  },

  // ===== MANETTES (5 products) =====
  {
    name: 'Xbox Elite Wireless Series 2',
    images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2000&auto=format&fit=crop', public_id: 'controller_1' }],
    brand: 'Microsoft',
    category: 'Manettes',
    description: 'La manette de jeu ultime avec plus de 30 façons de jouer et de personnaliser votre expérience. Palettes arrière réglables, sticks interchangeables et tension des sticks ajustable.',
    features: ['Sticks interchangeables', 'Palettes arrière', 'Tension sticks ajustable', '40h autonomie avec chargeur'],
    colors: ['Noir'],
    price: 18000, countInStock: 12, rating: 4.7, numReviews: 421, isPopular: true
  },
  {
    name: 'PlayStation DualSense Edge',
    images: [{ url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop', public_id: 'controller_2' }],
    brand: 'Sony',
    category: 'Manettes',
    description: 'Manette pro PlayStation 5 ultra-personnalisable avec sticks interchangeables, palettes arrière et profils sauvegardables. La manette officielle PS5 pour les joueurs compétitifs.',
    features: ['Sticks interchangeables', 'Palettes arrière remplaçables', 'Profils de touches', 'Retour haptique avancé'],
    colors: ['Blanc', 'Noir'],
    price: 22000, countInStock: 9, rating: 4.8, numReviews: 287, isFeatured: true
  },
  {
    name: 'Razer Wolverine V2 Chroma',
    images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2000&auto=format&fit=crop', public_id: 'controller_3' }],
    brand: 'Razer',
    category: 'Manettes',
    description: 'Manette Xbox filaire pro avec 6 boutons additionnels remappables, éclairage Chroma RGB et triggers Mecha-Tactile à retour tactile.',
    features: ['6 boutons additionnels', 'Triggers Mecha-Tactile', 'Éclairage Chroma RGB', 'Compatible PC/Xbox'],
    colors: ['Noir'],
    price: 16500, promotionalPrice: 14500, countInStock: 20, rating: 4.6, numReviews: 134
  },
  {
    name: 'PowerA Fusion Pro 3 Wired',
    images: [{ url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop', public_id: 'controller_4' }],
    brand: 'PowerA',
    category: 'Manettes',
    description: 'Manette Xbox filaire pro abordable avec 3 palettes arrière, sticks interchangeables et touchpad. Excellent rapport qualité-prix pour les joueurs compétitifs.',
    features: ['3 palettes arrière', 'Sticks interchangeables', 'Poignées ergonomiques', 'Câble detachable 3m'],
    colors: ['Noir', 'Blanc', 'Rouge'],
    price: 9500, countInStock: 35, rating: 4.4, numReviews: 203
  },
  {
    name: '8BitDo Pro 2 Wireless',
    images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2000&auto=format&fit=crop', public_id: 'controller_5' }],
    brand: '8BitDo',
    category: 'Manettes',
    description: 'Manette multi-plateforme sans fil compatible Switch, Android, PC et Raspberry Pi. Design rétro moderne avec palettes arrière, sticks ajustables et profils de touches.',
    features: ['Multi-plateforme Switch/PC/Android', 'Palettes arrière', 'Bluetooth + USB-C', 'Gyroscope 6 axes'],
    colors: ['Noir', 'Blanc', 'Violet'],
    price: 7500, promotionalPrice: 6800, countInStock: 45, rating: 4.5, numReviews: 312
  },

  // ===== TAPIS DE SOURIS (5 products) =====
  {
    name: 'SteelSeries QcK XXL',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mousepad_1' }],
    brand: 'SteelSeries',
    category: 'Tapis de Souris',
    description: 'Tapis de souris XXL à surface micro-texturée pour une précision optimale. Recouvre tout votre bureau pour accueillir la souris ET le clavier. Bords cousus anti-effilochage.',
    features: ['900x400x4mm XXL', 'Micro-texture gaming', 'Bords cousus', 'Base antidérapante en caoutchouc'],
    colors: ['Noir'],
    price: 4500, countInStock: 50, rating: 4.6, numReviews: 547
  },
  {
    name: 'Razer Strider Chroma XL',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mousepad_2' }],
    brand: 'Razer',
    category: 'Tapis de Souris',
    description: 'Tapis de souris hybride XL avec surface lisse/rapide et éclairage Chroma RGB à 19 zones. La surface réversible offre à la fois glisse rapide et contrôle précis.',
    features: ['Surface hybride réversible', 'Éclairage Chroma RGB 19 zones', '940x410mm XL', 'Anti-fray stitching'],
    colors: ['Noir'],
    price: 8500, promotionalPrice: 7200, countInStock: 28, rating: 4.7, numReviews: 189
  },
  {
    name: 'Corsair MM700 RGB XXL',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mousepad_3' }],
    brand: 'Corsair',
    category: 'Tapis de Souris',
    description: 'Tapis XXL avec éclairage RGB à 3 zones et surface de jeu à haute densité. Hub USB intégré avec 2 ports USB 3.0 et câble premium tressé.',
    features: ['RGB 3 zones iCUE', 'Hub USB 2 ports 3.0', '930x400mm XXL', 'Câble tressé premium'],
    colors: ['Noir'],
    price: 9500, countInStock: 20, rating: 4.5, numReviews: 142
  },
  {
    name: 'Logitech G840 XL',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mousepad_4' }],
    brand: 'Logitech',
    category: 'Tapis de Souris',
    description: 'Tapis gaming XL extra-large optimisé pour les souris gaming Logitech G à capteur optique. Surface uniforme gaming-grade et épaisseur de 3mm pour un maximum de confort.',
    features: ['900x400x3mm XL', 'Optimisé G-Series', 'Surface uniforme', 'Base caoutchouc naturel'],
    colors: ['Noir'],
    price: 5500, countInStock: 60, rating: 4.4, numReviews: 398
  },
  {
    name: 'Glorious 3XL Extended',
    images: [{ url: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=2000&auto=format&fit=crop', public_id: 'mousepad_5' }],
    brand: 'Glorious',
    category: 'Tapis de Souris',
    description: 'Tapis de souris XXL le plus grand du marché pour un bureau totalement couvert. Surface de glisse ultra-fine et base antidérapante en caoutchouc naturel premium.',
    features: ['1220x610mm 3XL Géant', 'Surface G-Trak ultra-lisse', 'Épaisseur 3mm', 'Bords cousus renforcés'],
    colors: ['Noir', 'Blanc'],
    price: 6500, promotionalPrice: 5800, countInStock: 40, rating: 4.6, numReviews: 221
  },

  // ===== CHAISES GAMING (4 products) =====
  {
    name: 'Secretlab TITAN Evo 2022',
    images: [{ url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2000&auto=format&fit=crop', public_id: 'chair_1' }],
    brand: 'Secretlab',
    category: 'Chaises Gaming',
    description: 'La chaise gaming primée, redessinée de fond en comble. Structure en acier renforcé, mousse à froid Cold Cure, accoudoirs 4D et mécanisme de bascule avancé pour un confort sans compromis.',
    features: ['Structure acier renforcé', 'Mousse Cold Cure', 'Accoudoirs 4D', 'Appuie-tête magnétique', 'Dossier NEO Hybrid Leatherette'],
    colors: ['Noir', 'Blanc', 'Rouge', 'Bleu'],
    price: 65000, promotionalPrice: 58000, countInStock: 7, rating: 4.9, numReviews: 1024, isFeatured: true, isPopular: true
  },
  {
    name: 'Herman Miller x Logitech G Embody',
    images: [{ url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2000&auto=format&fit=crop', public_id: 'chair_2' }],
    brand: 'Herman Miller',
    category: 'Chaises Gaming',
    description: 'La collaboration ultime entre Herman Miller et Logitech G. Chaise ergonomique de bureau premium adaptée au gaming avec technologie PostureFit SL et tissu respirant BalancedMesh.',
    features: ['Technologie PostureFit SL', 'Tissu BalancedMesh respirant', 'Bras 4D', 'Garantie 12 ans'],
    colors: ['Noir', 'Bleu'],
    price: 185000, countInStock: 2, rating: 4.9, numReviews: 156
  },
  {
    name: 'DXRacer Formula Series',
    images: [{ url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2000&auto=format&fit=crop', public_id: 'chair_3' }],
    brand: 'DXRacer',
    category: 'Chaises Gaming',
    description: 'Chaise gaming emblématique style baquet de course, pionnière du style gaming. Dossier haut, appui-tête et coussin lombaire inclus pour un support maximal.',
    features: ['Style baquet de course', 'Coussin lombaire et appuie-tête', 'Structure acier', 'Tissu PU Leather'],
    colors: ['Noir/Rouge', 'Noir/Bleu', 'Blanc/Noir'],
    price: 35000, promotionalPrice: 31000, countInStock: 15, rating: 4.3, numReviews: 789
  },
  {
    name: 'Noblechairs HERO Gaming Chair',
    images: [{ url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2000&auto=format&fit=crop', public_id: 'chair_4' }],
    brand: 'Noblechairs',
    category: 'Chaises Gaming',
    description: 'Chaise gaming premium avec revêtement Vegan PU ultra-doux, assise extra-large et réglage lombaire intégré. Conçue en Allemagne pour une qualité supérieure.',
    features: ['Vegan PU extra-doux', 'Assise extra-large', 'Réglage lombaire intégré', 'Accoudoirs 4D'],
    colors: ['Noir', 'Blanc', 'Noir/Or'],
    price: 52000, countInStock: 8, rating: 4.6, numReviews: 312
  },

  // ===== MICROPHONES (4 products) =====
  {
    name: 'Blue Yeti X Professional USB',
    images: [{ url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop', public_id: 'mic_1' }],
    brand: 'Blue',
    category: 'Microphones',
    description: 'Microphone USB professionnel avec 4 modes de directivité et monitoring en temps réel. Utilisé par des millions de streamers et créateurs de contenu dans le monde.',
    features: ['4 modes de directivité', 'Monitoring zéro latence', 'Éclairage LED', 'Connexion USB directe'],
    colors: ['Noir', 'Argent'],
    price: 18500, promotionalPrice: 16000, countInStock: 22, rating: 4.7, numReviews: 678
  },
  {
    name: 'HyperX QuadCast S RGB',
    images: [{ url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop', public_id: 'mic_2' }],
    brand: 'HyperX',
    category: 'Microphones',
    description: 'Microphone condensateur USB de streaming avec éclairage RGB et filtre anti-pop intégré. Quatre modes polaires pour s\'adapter à toutes les situations d\'enregistrement.',
    features: ['4 modes polaires', 'Éclairage RGB', 'Anti-pop intégré', 'Réglage gain instantané'],
    colors: ['Noir'],
    price: 14500, countInStock: 30, rating: 4.6, numReviews: 412
  },
  {
    name: 'Razer Seiren V3 Chroma',
    images: [{ url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop', public_id: 'mic_3' }],
    brand: 'Razer',
    category: 'Microphones',
    description: 'Microphone USB gaming avec éclairage Chroma RGB réactif au son et suppression du bruit AI en temps réel. Parfait pour le streaming et les appels en jeu.',
    features: ['Éclairage Chroma réactif son', 'Suppression bruit AI', 'Filtre anti-pop intégré', 'Compatible Synapse'],
    colors: ['Noir'],
    price: 16500, promotionalPrice: 14800, countInStock: 18, rating: 4.5, numReviews: 234
  },
  {
    name: 'Elgato Wave:3 Plus',
    images: [{ url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop', public_id: 'mic_4' }],
    brand: 'Elgato',
    category: 'Microphones',
    description: 'Microphone de streaming premium avec technologie Clipguard pour éviter la saturation. Mixeur logiciel Wave Link inclus pour contrôler toutes vos sources audio.',
    features: ['Technologie Clipguard anti-saturation', 'Logiciel Wave Link', 'Condensateur de studio', 'Montage clé de choc inclus'],
    colors: ['Noir', 'Blanc'],
    price: 19500, countInStock: 14, rating: 4.8, numReviews: 345
  },

  // ===== COMPOSANTS PC (8 products) =====
  {
    name: 'NVIDIA GeForce RTX 4090 FE',
    images: [{ url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2000&auto=format&fit=crop', public_id: 'gpu_1' }],
    brand: 'NVIDIA',
    category: 'Composants PC',
    description: 'La carte graphique la plus puissante de NVIDIA avec architecture Ada Lovelace. 24 Go de GDDR6X, DLSS 3 et ray tracing d\'un niveau jamais atteint. La référence absolue pour le gaming 4K.',
    features: ['24 Go GDDR6X', 'DLSS 3.0', 'Ray Tracing Ada Lovelace', '450W TDP'],
    colors: ['Noir'],
    price: 220000, countInStock: 2, rating: 4.9, numReviews: 189, isFeatured: true
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    images: [{ url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2000&auto=format&fit=crop', public_id: 'gpu_2' }],
    brand: 'AMD',
    category: 'Composants PC',
    description: 'La carte graphique phare d\'AMD avec architecture RDNA 3. 24 Go de GDDR6, FSR 3.0 et ray tracing amélioré pour des performances 4K exceptionnelles à un prix compétitif.',
    features: ['24 Go GDDR6', 'FSR 3.0 Fluid Motion', 'Architecture RDNA 3', '355W TDP'],
    colors: ['Noir/Rouge'],
    price: 185000, promotionalPrice: 170000, countInStock: 4, rating: 4.8, numReviews: 134
  },
  {
    name: 'Intel Core i9-14900K',
    images: [{ url: 'https://images.unsplash.com/photo-1555617981-dac3772ef4ca?q=80&w=2000&auto=format&fit=crop', public_id: 'cpu_1' }],
    brand: 'Intel',
    category: 'Composants PC',
    description: 'Le processeur gaming Intel le plus rapide avec 24 cœurs (8P+16E) jusqu\'à 6.0 GHz Boost. Architecte Hybrid pour exceller dans les jeux et les tâches créatives.',
    features: ['24 cœurs 32 threads', '6.0 GHz Boost max', 'Compatible DDR5/DDR4', 'Intel UHD 770 iGPU'],
    colors: [],
    price: 52000, countInStock: 10, rating: 4.8, numReviews: 267
  },
  {
    name: 'AMD Ryzen 9 7950X',
    images: [{ url: 'https://images.unsplash.com/photo-1555617981-dac3772ef4ca?q=80&w=2000&auto=format&fit=crop', public_id: 'cpu_2' }],
    brand: 'AMD',
    category: 'Composants PC',
    description: 'Processeur workstation/gaming AMD avec 16 cœurs Zen 4. Performances brutes inégalées pour le rendu 3D, la compilation et le gaming haut de gamme.',
    features: ['16 cœurs 32 threads', '5.7 GHz Boost', 'Architecture Zen 4 AM5', 'PCIe 5.0 + DDR5'],
    colors: [],
    price: 65000, promotionalPrice: 58000, countInStock: 8, rating: 4.9, numReviews: 178
  },
  {
    name: 'Corsair Vengeance DDR5 32Go 6000MHz',
    images: [{ url: 'https://images.unsplash.com/photo-1562155955-1cb2d73488d7?q=80&w=2000&auto=format&fit=crop', public_id: 'ram_1' }],
    brand: 'Corsair',
    category: 'Composants PC',
    description: 'Kit mémoire DDR5 haute performance 32 Go (2x16 Go) à 6000MHz. Latences XMP 3.0 optimisées, compatible Intel et AMD. RGB ICUE pour un look gaming premium.',
    features: ['DDR5 6000MHz CL36', 'Kit 2x16 Go', 'XMP 3.0 / EXPO', 'RGB iCUE'],
    colors: ['Noir', 'Blanc'],
    price: 18500, countInStock: 25, rating: 4.7, numReviews: 423
  },
  {
    name: 'Samsung 980 Pro NVMe SSD 2To',
    images: [{ url: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?q=80&w=2000&auto=format&fit=crop', public_id: 'ssd_1' }],
    brand: 'Samsung',
    category: 'Composants PC',
    description: 'SSD NVMe PCIe 4.0 ultra-rapide avec des vitesses de lecture séquentielles de 7000 MB/s. Le stockage ideal pour PS5 ou PC gaming avec des temps de chargement quasi-nuls.',
    features: ['PCIe 4.0 NVMe', '7000/5100 MB/s', 'Compatible PS5', '2 To capacité'],
    colors: [],
    price: 22000, promotionalPrice: 19500, countInStock: 30, rating: 4.8, numReviews: 612
  },
  {
    name: 'Corsair RM1000x SHIFT 80+ Gold',
    images: [{ url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2000&auto=format&fit=crop', public_id: 'psu_1' }],
    brand: 'Corsair',
    category: 'Composants PC',
    description: 'Alimentation gaming 1000W 80+ Gold modulaire avec câbles de connexion latérale SHIFT innovants. Ventilateur silencieux Zero RPM, parfait pour les systèmes gaming puissants.',
    features: ['1000W 80+ Gold', 'Entièrement modulaire', 'Zero RPM mode', 'ATX 3.0 PCIe 5.0'],
    colors: ['Noir'],
    price: 28500, countInStock: 12, rating: 4.7, numReviews: 234
  },
  {
    name: 'NZXT Kraken 360 AIO RGB',
    images: [{ url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2000&auto=format&fit=crop', public_id: 'cooling_1' }],
    brand: 'NZXT',
    category: 'Composants PC',
    description: 'Refroidisseur liquide tout-en-un 360mm avec pompe à affichage OLED intégré. Ventilateurs F120 RGB et compatibilité étendue avec toutes les plateformes Intel et AMD récentes.',
    features: ['Radiateur 360mm', 'Affichage OLED pompe', 'Ventilateurs F120 RGB', 'Compatible LGA1700/AM5'],
    colors: ['Noir', 'Blanc'],
    price: 24500, promotionalPrice: 22000, countInStock: 16, rating: 4.6, numReviews: 189
  },

  // ===== ACCESSOIRES GAMING DIVERS (5 products) =====
  {
    name: 'Elgato Stream Deck MK.2',
    images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c228c6e1be?q=80&w=2000&auto=format&fit=crop', public_id: 'streamdeck_1' }],
    brand: 'Elgato',
    category: 'Composants PC',
    description: 'Panneau de contrôle streaming avec 15 touches LCD personnalisables. Automatisez vos streams OBS, changez de scènes, lancez des médias et gérez Discord en un clic.',
    features: ['15 touches LCD personnalisables', 'Compatible OBS/Twitch/YouTube', 'Profils illimités', 'Plugin ecosystem'],
    colors: ['Noir', 'Blanc'],
    price: 16500, countInStock: 28, rating: 4.8, numReviews: 891
  },
  {
    name: 'Razer Kraken Kitty V2 Pro',
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_kitty' }],
    brand: 'Razer',
    category: 'Casques Gaming',
    description: 'Casque gaming unique avec oreilles de chat RGB rétractables pour les streamers. Drivers TriForce 50mm, micro HyperClear et oreilles réactives au son pour un look unique en stream.',
    features: ['Oreilles Kitty RGB rétractables', 'Drivers TriForce 50mm', 'Micro HyperClear', 'Éclairage réactif son'],
    colors: ['Noir', 'Blanc', 'Rose'],
    price: 20500, promotionalPrice: 18000, countInStock: 14, rating: 4.6, numReviews: 412
  },
  {
    name: 'SteelSeries Arctis Nova 7X',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop', public_id: 'headset_nova7x' }],
    brand: 'SteelSeries',
    category: 'Casques Gaming',
    description: 'Casque gaming sans fil multiplateforme compatible Xbox, PC, Mobile et Plus. Connexion simultanée sur 2 appareils, 38h autonomie et micro ClearCast Gen 2.',
    features: ['Multi-plateforme Xbox/PC/Mobile', 'Connexion simultanée 2 appareils', '38h autonomie', 'Micro ClearCast Gen 2'],
    colors: ['Noir', 'Blanc'],
    price: 19500, countInStock: 22, rating: 4.7, numReviews: 267
  },
  {
    name: 'Thermaltake Tower 500 Midi Tower',
    images: [{ url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2000&auto=format&fit=crop', public_id: 'case_1' }],
    brand: 'Thermaltake',
    category: 'Composants PC',
    description: 'Boîtier gaming tour panoramique avec paroi supérieure transparente et design vertical. Support pour radiateurs 360mm, 13 emplacements ventilateurs et excellent airflow.',
    features: ['Fenêtre supérieure panoramique', 'Support AIO 360mm', '13 emplacements ventilateurs', 'Format E-ATX compatible'],
    colors: ['Noir', 'Blanc'],
    price: 32000, countInStock: 8, rating: 4.7, numReviews: 134
  },
  {
    name: 'Govee RGBIC TV Backlight T2',
    images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c228c6e1be?q=80&w=2000&auto=format&fit=crop', public_id: 'ledstrip_1' }],
    brand: 'Govee',
    category: 'Composants PC',
    description: 'Kit de rétroéclairage TV RGBIC avec caméra de capture d\'écran et synchronisation des couleurs. Transformez vos sessions gaming en expérience immersive avec Alexa et Google Home.',
    features: ['Caméra sync couleurs TV', 'RGBIC multi-couleurs simultanées', 'Compatible Alexa/Google', 'Pour TV 55"-65"'],
    colors: ['Multicolore'],
    price: 8500, promotionalPrice: 7200, countInStock: 50, rating: 4.5, numReviews: 756
  },
];

export default products;
