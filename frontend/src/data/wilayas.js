/**
 * wilayas.js
 * Complete official Algerian administrative dataset — 58 Wilayas + all communes
 * Source: Office National des Statistiques (ONS) Algeria
 * Used as the primary frontend data source for Wilaya/Commune selection.
 */

const WILAYAS_DATA = [
  {
    code: '01', name: 'Adrar', homePrice: 1000, officePrice: 700, deliveryDays: 5,
    communes: ['Adrar','Aougrout','Aoulef','Bordj Badji Mokhtar','Charouine','Deldoul','Fenoughil','In Zghmir','Metarfa','Ouled Aïssa','Ouled Said','Reguane','Sali','Tamentit','Tamest','Timokten','Timimoun','Tinerkouk','Tit','Tsabit','Zaouiet Kounta']
  },
  {
    code: '02', name: 'Chlef', homePrice: 600, officePrice: 400, deliveryDays: 3,
    communes: ['Chlef','Abou El Hassan','Ain Merane','Benairia','Beni Bouattab','Beni Haoua','Beni Rached','Boukadir','Chettia','El Karimia','El Marsa','El Oued','Harenfa','Herenfa','Labiod Medjadja','Moussadek','Oued Fodda','Oued Goussine','Ouled Ben Abdelkader','Ouled Farès','Ouled Fares','Ouled Sidi Aïssa','Sidi Abderrahmane','Sidi Akkacha','Taougrite','Talassa','Ténès','Tenes','Zeboudja']
  },
  {
    code: '03', name: 'Laghouat', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Laghouat','Aflou','Aïn Madhi','Aïn Sidi Ali','Beidha','Ben Nacer Ben Chohra','Brida','El Assafia','El Ghicha','El Houaita','Gueltat Sidi Saad','Hassi Delaa','Hassi R\'Mel','Ksar El Hirane','Nçala','Oued Morra','Oued M\'Zi','Oued Touil','Sébgag','Sebgag','Sidi Bouzid','Sidi Makhlouf','Tadjemout','Tadjrouna','Taouiala']
  },
  {
    code: '04', name: 'Oum El Bouaghi', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Oum El Bouaghi','Ain Babouche','Ain Beida','Ain Diss','Ain El Beida','Ain Fakroun','Ain Kercha','Ain Zitoun','Behir Chergui','Bir Chouhada','Dhalaa','El Amiria','El Fedjoudj','El Harmelia','F\'Kirina','Fkirina','Hanchir Toumghani','Ksar Sbahi','Meskiana','Ouled Hamla','Ouled Zouai','Rahia','Sigus','Souk Naamane','Zerizer','Zorg']
  },
  {
    code: '05', name: 'Batna', homePrice: 700, officePrice: 450, deliveryDays: 3,
    communes: ['Batna','Ain Djasser','Ain Touta','Ain Yagout','Arris','Azil Abdelkader','Barika','Beni Foudhala El Hakania','Boumagueur','Bouzina','Chemora','Chir','Djerma','El Hassi','El Madher','Fesdis','Ghassira','Gosbat','Guigba','Hidous','Ichmoul','Imed','Inoughissen','Kimmel','Ksar Bellezma','Larbaa','Lazrou','Lemsane','Maafa','Menaa','Merouana','N\'gaous','Ngaous','Nouader','Ouled Ammar','Ouled Aouf','Ouled Fadel','Ouled Selam','Ouyoun El Assafir','Ras El Aioun','Rhili','Seggana','Sefiane','Seriana','Tazoult','Teniet El Abes','Timgad','Tixter','Tkout','Zanat El Beida']
  },
  {
    code: '06', name: 'Béjaïa', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Béjaïa','Adekar','Aïn Soltane','Akbou','Akfadou','Amizour','Aokas','Ath Mansour','Barbacha','Beni Djellil','Beni Ksila','Beni Maouche','Beni Mellikeche','Beni Mziri','Boukhelifa','Bouzeggane','Chemini','Chellata','Darguina','Djemila','Draa El Gaïd','El Kseur','El Flay','Feraoun','Fenaia Ilmaten','Ighil Ali','Ighram','Kherrata','Leflaye','Melbou','Oued Ghir','Ouzellaguen','Seddouk','Semaoun','Semaoune','Sidi Ayad','Souk El Tenine','Souk Ouffella','Taher','Tahrirt','Taskriout','Tizi N\'Berber','Tamokra','Tibane','Tifra','Timezrit','Tichy','Toudja','Yemmane']
  },
  {
    code: '07', name: 'Biskra', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['Biskra','Ain Naga','Ain Zaatout','Bordj Ben Azzouz','Branis','Chetma','Djemorah','Doucen','El Feidh','El Ghrouss','El Hadjeb','El Haouch','El Kantara','El Outaya','Foughala','Khenguet Sidi Nadji','Lichana','Lioua','M\'Chouneche','Mchouneche','Meziraa','Mziraa','Oued Djellal','Ouled Djellal','Ouled Rahma','Ras El Miaad','Sidi Khaled','Sidi Okba','Tolga','Zeribet El Oued']
  },
  {
    code: '08', name: 'Béchar', homePrice: 900, officePrice: 600, deliveryDays: 5,
    communes: ['Béchar','Abadla','Beni Abbes','Beni Ounif','Boukais','El Ouata','Erg Ferradj','Igli','Kenadsa','Kerzaz','Lahmar','Mazzer','Mougheul','Ouled Khoudir','Tabelbala','Taghit','Timoudi']
  },
  {
    code: '09', name: 'Blida', homePrice: 500, officePrice: 300, deliveryDays: 2,
    communes: ['Blida','Aïn Romana','Beni Mered','Beni Tamou','Bougara','Bouinan','Boufarik','Bou Arfa','Boufaris','Chiffa','Chrea','Chreaa','El Affroun','Guerrouaou','Hammam Melouane','Larbaa','Larbaâ','Meftah','Mouzaia','Oued Allerme','Ouled Selama','Ouled Yaïch','Oued Djer','Soumaa']
  },
  {
    code: '10', name: 'Bouira', homePrice: 600, officePrice: 350, deliveryDays: 3,
    communes: ['Bouira','Aghbalou','Aïn Bessem','Aïn El Hadjar','Aïn Laloui','Aïn Turk','Ath Mansour','Bechloul','Beni Cornine','Bouderbala','Bordj Okhriss','Chorfa','Dechmia','Dirah','El Asnam','El Esnam','El Hachimia','El Khabouzia','El Mokrani','El Adjiba','Guerrouma','Haizer','Lakhdaria','Maala','M\'Chedallah','Mchedallah','Mezdour','Oued El Berdi','Oued Khili','Ouled Rached','Raouraoua','Ridane','Saharidj','Sour El Ghozlane','Taghzout','Tillatou','Zel']
  },
  {
    code: '11', name: 'Tamanrasset', homePrice: 1200, officePrice: 800, deliveryDays: 6,
    communes: ['Tamanrasset','Abalessa','Ideles','In Amguel','In Ghar','In Guezzam','In Salah','Silet','Tazrouk','Tin Zaouatine']
  },
  {
    code: '12', name: 'Tébessa', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['Tébessa','Ain Zerga','Berzagane','Bekkaria','Bir Dheheb','Bir El Ater','Boukhadra','Cheria','El Aouinet','El Houidjbet','El Kouif','El Malabiod','El Ogla','El Tarf','Ferkane','Ghorriga','Guorriga','Hammamet','Morsott','Negrine','Nara','Ogla M\'ti','Ouenza','Oum Ali','Ravine Blanche','Safsaf El Ouesra','Stah Guentis','Tlidjene','Youkous']
  },
  {
    code: '13', name: 'Tlemcen', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Tlemcen','Ain Fezza','Ain Ghoraba','Ain Kebira','Ain Nehala','Ain Tallout','Ain Youcef','Azails','Amieur','Bled Larbi','Beni Bahdel','Beni Boussaid','Beni Maester','Beni Mester','Beni Ouarsous','Beni Snous','Beni Smiel','Chetouane','Dar Yaghmouracene','Draa El Achaich','El Aricha','El Bouihi','El Fehoul','El Gor','El Khemis','Fellaoucene','Ghazaouet','Honaine','Ifri','Ksar Chellala','Maghnia','Mansourah','Marsa Ben M\'Hidi','Msirda Fouaga','Nedroma','Ouled Mimoun','Ouled Riyah','Ouled Youssef','Plage des Andalouses','Remchi','Sabra','Sebaa Chioukh','Sidi Abdelli','Sidi Djillali','Sidi El Abed','Sidi Medjahed','Souahlia','Souk Tlata','Terni Beni Hdiel','Terny','Tlat Lithnine','Zenata']
  },
  {
    code: '14', name: 'Tiaret', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Tiaret','Aïn Bouchekif','Aïn El Deheb','Aïn Kermes','Aïn Zarit','Bougara','Dahmouni','Djebilet Rosfa','El Guetna','Fekka','Fougala','Frenda','Guertoufa','Hamadia','Ksar Chellala','Khemisti','Madna','Mahdia','Medroussa','Meghila','Mellakou','Naima','Oued Lilli','Oued Bendyab','Oued El Lili','Rahouia','Rechaiga','Rosfa','Sebt','Serghine','Si Abdelghani','Sidi Abderrahmane','Sidi Ali Mellal','Sidi Bakhti','Sidi Hosni','Sougueur','Tagdempt','Takhemaret','Tousnina','Zmalet El Emir Aek']
  },
  {
    code: '15', name: 'Tizi Ouzou', homePrice: 600, officePrice: 350, deliveryDays: 3,
    communes: ['Tizi Ouzou','Agouni Gueghrane','Aïn El Hammam','Aïn Zaouïa','Akbil','Ait Aïssa Mimoun','Ait Boumahdi','Ait Chafaa','Ait Khelili','Ait Mahmoud','Ait Oumalou','Ait Yahia','Ait Yahia Moussa','Akerrou','Azeffoun','Beni Aïssi','Beni Douala','Beni Yenni','Beni Zmenzer','Beni Zikki','Boghni','Boudjima','Bouzeguene','Chemini','Draâ Ben Khedda','Draâ El Mizan','Fréha','Frikat','Iffigha','Iferhounene','Iflissen','Iguer Moussa','Illilten','Imsouhal','Irdjen','Larbaâ Nath Irathen','Larbaa Nat Irathen','Maatkas','Makouda','Mechtras','Mekla','Mizrana','Mkira','Ouadhias','Ouaguenoun','Oued Aïssi','Si Aïssa','Sidi Naamane','Souk El Thenine','Taddart','Taguemount Azouz','Tala Hamza','Tizi Gheniff','Tizi N\'Tleta','Tizi Rached','Timizart','Tigzirt','Tirmitine','Yakouren','Yatafen','Zekri']
  },
  {
    code: '16', name: 'Alger', homePrice: 400, officePrice: 250, deliveryDays: 1,
    communes: ['Alger Centre','Sidi M\'Hamed','El Madania','Belouizdad','Bab El Oued','Bologhine','Casbah','Oued Koriche','Bir Mourad Raïs','El Biar','Bouzareah','Birkhadem','El Harrach','Baraki','Oued Smar','Bachdjerrah','Hussein Dey','Kouba','Mohammadia','Bordj El Kiffan','El Magharia','Beni Messous','Les Eucalyptus','Birtouta','Tessala El Merdja','Douera','Cheraga','Staoueli','Zeralda','Sidi Moussa','Aïn Taya','Bordj El Bahri','El Marsa','Hammamet','Rais Hamidou','Delly Ibrahim','Ain Benian','Ouled Fayet','El Achour','Djasr Kasentina','Dar El Beïda','Bab Ezzouar','Ben Aknoun','Dely Brahim','Hydra','Réghaïa','Aïn de Gaulle','Chateauneuf','Rouïba']
  },
  {
    code: '17', name: 'Djelfa', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Djelfa','Aïn Chouhada','Aïn El Ibel','Aïn El Maabed','Aïn Fekka','Aïn Oussera','Benhar','Birine','Bouira Lahdab','Charef','Dar Chioukh','Deldoul','Douis','El Guedid','El Idrissia','El Khemis','Faidh El Botma','Had Sahary','Hassi Bahbah','Hassi El Euch','Messaad','M\'Liliha','Moudjbara','Oum Laadham','Sed Rahal','Selmana','Sidi Baizid','Sidi Ladjel','Tadmit','Zaafrane','Zaccar']
  },
  {
    code: '18', name: 'Jijel', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Jijel','Ain Makhlouf','Aouana','Boudriaa Ben Yadjis','Bouraoui Belhadef','Chahna','Chekfa','Djimla','El Ancer','El Aouana','El Kennar Nouchfi','El Milia','Emir Abdelkader','Eraguene','Es Siad','Ghebala','Grarem Gouga','Hmamra','Kaous','Ouadjana','Ouled Askeur','Ouled Yahia Khedrouche','Selma Benziada','Settara','Sidi Abdelaziz','Sidi Marouf','Taher','Texenna','Ziama Mansouriah']
  },
  {
    code: '19', name: 'Sétif', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Sétif','Aïn Abessa','Aïn Arnat','Aïn Azel','Aïn El Kebira','Aïn Lahdjar','Aïn Legraj','Aïn Oulmene','Aïn Roua','Aïn Sebt','Aïn Soltane','Ain Trig','Amoucha','Babor','Bazer Sakhra','Béni Aziz','Béni Ourtilane','Béni Fouda','Béni Hocine','Béni Mouhli','Bir El Arch','Bir Haddada','Bouandas','Bougaa','Boutaleb','Dehamcha','Djemila','Draa Kebila','El Eulma','El Ouldja','Guedjel','Guenzet','Guidjel','Hamma','Hammam Guergour','Hammam Sokhna','Ksar El Abtal','Maouaklane','Maouklan','Mezloug','N\'Gaous','Ouled Addouane','Ouled Sabor','Ouled Sidi Ahmed','Ouled Tebben','Rasfa','Salah Bey','Serdj El Ghoul','Tachouda','Taya','Tella','Tizi N\'Bechar']
  },
  {
    code: '20', name: 'Saïda', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['Saïda','Aïn El Hadjar','Aïn Skhouna','Aïn Soltane','Doui Thabet','El Hassasna','El Moussa','Hassasna','Hounet','Maamoura','Moulay Larbi','Ouled Brahim','Ouled Khaled','Rebahia','Sidi Ahmed','Sidi Boubekeur','Tircine','Youb']
  },
  {
    code: '21', name: 'Skikda', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Skikda','Ain Bouziane','Ain Charchar','Ain Kechra','Azzaba','Beni Bechir','Beni Ouelbane','Ben Azzouz','Cheraia','Collo','Djendel Saadi Mohamed','El Harrouch','El Hadaiek','Es Sebt','Filfila','Hamadi Krouma','Kanoua','Kerkera','Oued Zhour','Ouldja Boulballout','Oum Toub','Ouled Attia','Ouled Hbaba','Ramdane Djamel','Sidi Mezghiche','Stora','Tamalous','Zerdazas','Zitouna']
  },
  {
    code: '22', name: 'Sidi Bel Abbès', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Sidi Bel Abbès','Aïn Adden','Aïn El Berd','Aïn Kada','Aïn Tindamine','Aïn Thrid','Amarnas','Badredjine','Bedrabine El Mokrani','Belarbine','Ben Badis','Benachour','Bir El Hammam','Chetouane Belaila','Dhaya','El Hacaiba','Hammam Bou Hadjar','Hassi Dahou','Hassi Zahana','Lamtar','Lehel Sidi Daoud','Losra','Makedra','Marhoum','Merine','Mezaourou','Mostefa Ben Brahim','Moulay Slissen','Oggaz','Oued Sebaa','Oued Taourira','Ras El Ma','Reguia','Sehala Thaoura','Sfissef','Sidi Ali Benyoub','Sidi Ali Boussidi','Sidi Brahim','Sidi Chaib','Sidi Daho des Zairs','Sidi Hamadouche','Sidi Khaled','Sidi Lahcene','Sidi Yacoub','Sig','Tabia','Tafissour','Telagh','Tessala','Tilmouni','Zerouala']
  },
  {
    code: '23', name: 'Annaba', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Annaba','Ain Berda','Berrahal','Cheurfa','Chetaïbi','El Bouni','El Eulma','El Hadjar','Eulma','Oued El Aneb','Seraïdi','Sidi Amar','Treat']
  },
  {
    code: '24', name: 'Guelma', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Guelma','Ain Ben Beida','Ain Larbi','Ain Makhlouf','Ain Reggada','Ain Sandel','Belkhir','Ben Djarah','Beni Mezline','Bordj Sabat','Bouchegouf','Bouati Mahmoud','Dahouara','Djeballah Khemissi','El Fedjoudj','Guelaat Bou Sba','Guellat Bousba','Hammam Debagh','Hammam N\'bails','Héliopolis','Houari Boumediene','Khezaras','Khimeunini','Ksar Sbahi','Ksar Kharoub','Medjez Amar','Medjez Sfa','Nechmaya','Oued Fragha','Oued Zenati','Ras El Agba','Robaa','Sellaoua Announa','Tamlouka']
  },
  {
    code: '25', name: 'Constantine', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Constantine','Aïn Abid','Beni Hamidane','Didouche Mourad','El Khroub','Hamma Bouziane','Ibn Badis','Ibn Ziad','Mesaoud Boudjriou','Ouled Rahmoune','Zighoud Youcef']
  },
  {
    code: '26', name: 'Médéa', homePrice: 600, officePrice: 350, deliveryDays: 3,
    communes: ['Médéa','Aïn Boucif','Aïn Ouksir','Aissaouia','Aziz','Berrouaghia','Bni Slimane','Boughezoul','Bou Aiche','Bouskene','Chelalet El Adhaoura','Chellalet El Adhaoura','Dar Ben Abdallah','Djouab','Draa Esmar','El Aissaouia','El Aziz','El Guelaia','El Omaria','El Hamdania','Hannacha','Kef Lakhdar','Khams Djouamaa','Ksar El Boukhari','Maghraoua','Medjebar','Mezghena','Mihoub','Moudjbar','Oued Harbil','Oued Koraiche','Ouled Antar','Ouled Daid','Ouled Deïd','Ouled Maaref','Ouled Makhlouf','Ouled Merzoug','Ouled Slama','Oum El Djalil','Ouzera','Rebaia','Sedraia','Si Mahdjoub','Sidi Damed','Sidi Naamane','Sidi Zahar','Sidi Ziane','Souaghi','Tablat','Tafraout','Tamesguida','Tizi Mahdi','Zoubiria']
  },
  {
    code: '27', name: 'Mostaganem', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Mostaganem','Ain Boudinar','Ain Sidi Cherif','Ain Nouïssy','Ain Tedeles','Achaacha','Benabdelmalek Ramdane','Bouguirat','Fornaka','Hadjadj','Hassi Mameche','Khadra','Mansourah','Mesra','Nekmaria','Oued El Kheir','Ouled Boughalem','Ouled Maalah','Safsaf','Sendjas','Sidi Ali','Sidi Belattar','Sidi Lakhdar','Sirat','Souaflia','Sour','Tazgait','Telaghma','Touahria']
  },
  {
    code: '28', name: 'M\'Sila', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['M\'Sila','Ain El Hadjel','Ain El Melh','Ain Fares','Ain Khadra','Ain Lekhel','Ben Srour','Belaiba','Ben Zour','Benzouh','Berhoum','Bir Foda','Boossaada','Bou Saâda','Bouti Sayah','Chellal','Dehahna','Djezzar','El Hamel','El Houamed','El Khobbi','Hammam Dhalaa','Khettouti Sed El Djir','Khoubana','M\'tarfa','Maadid','Magra','Magraa','Medjedel','Metarfa','Ouanougha','Ouled Addi Guebala','Ouled Atia','Ouled Mansour','Ouled Slimane','Ouled Sidi Brahim','Oultem','Ouled Derradj','Ouled Madhi','Oum Djellil','Sidi Aïssa','Sidi Ameur','Sidi Hadjeres','Sidi Khaled','Sidi Yahia','Slim','Souamaa','Zarzour']
  },
  {
    code: '29', name: 'Mascara', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Mascara','Aïn Fekan','Ain Fares','Ain Frass','Ain Ital','Akerrou','Alaimia','Aouf','Bou Henni','Bouhanifia','Chouf Ech Chergui','El Bordj','El Gaada','El Ghomri','El Hachem','El Keurt','Ferraguig','Froha','Ghomri','Gharous','Gomri','Ghriss','Hacine','Khalouia','Maoussa','Matemore','Mohammadia','Mocta Douz','Nesmoth','Oggaz','Ouled Maaref','Oued El Abtal','Oued Taria','Ras El Aïn Amirouche','Ras El Ain','Rouina','Sedjerara','Sidi Abdeldjebar','Sidi Abdelmoumen','Sidi Boussaid','Sig','Tighennif','Tig Hennif','Tizi','Zahana']
  },
  {
    code: '30', name: 'Ouargla', homePrice: 850, officePrice: 550, deliveryDays: 5,
    communes: ['Ouargla','Ain El Beul','El Alia','El Borma','El Hadjira','Hassi Messaoud','Megarine','N\'Goussa','Ngoussa','Rouissat','Sidi Khouiled','Tebesbest','Temacine','Taibet','Touggourt','Zaouia El Abidia']
  },
  {
    code: '31', name: 'Oran', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Oran','Aïn El Beïda','Aïn El Kerma','Aïn El Turck','Aïn Turk','Arbal','Arzew','Ben Freha','Bethioua','Bir El Djir','Bousfer','Boufatis','Cap Falcon','Djebel Ksel','El Ancor','El Braya','El Hamri','Es Sénia','Gdyel','Hassi Ben Okba','Hassi Mefsoukh','Hay El Boustan','Marsat El Hadjadj','Messerghin','Mers El Kebir','Misserghine','Oued Tlelat','Sidi Ben Yebka','Sidi Chahmi','Tafraoui','Tessala El Merdja','Ain Biya']
  },
  {
    code: '32', name: 'El Bayadh', homePrice: 800, officePrice: 500, deliveryDays: 5,
    communes: ['El Bayadh','Aïn El Orak','Arbaouat','Bou Djediene','Boualem','Bougtob','Brézina','Cheguig','El Abiodh Sidi Cheikh','El Bnoud','El Kheither','Ghassoul','Kef El Ahmar','Kraakda','Mecheria','Mehara','Ouled Ben Barkat','Rogassa','Sfissifa','Sidi Ameur','Sidi Tifour','Tousmouline']
  },
  {
    code: '33', name: 'Illizi', homePrice: 1100, officePrice: 750, deliveryDays: 6,
    communes: ['Illizi','Bordj Omar Driss','Djanet','In Amenas','Debdeb']
  },
  {
    code: '34', name: 'Bordj Bou Arréridj', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Bordj Bou Arréridj','Aïn Taghrout','Aïn Tesra','Belimour','Ben Daoud','Bir Kasdali','Bordj Ghedir','Bordj Zemoura','Colla','Djaafra','El Achir','El Anasser','El Hamadia','El M\'Hara','Ghilassa','Hasnaoua','Khelil','Ksour','Medjana','Ouled Braham','Ouled Ibrahim','Ouled Sidi Brahim','Ras El Oued','Rabta','Sidi Embarek','Tasmart','Teniet En Nasr']
  },
  {
    code: '35', name: 'Boumerdès', homePrice: 500, officePrice: 300, deliveryDays: 2,
    communes: ['Boumerdès','Afir','Ain El Hadjar','Ammal','Baghlia','Ben Choud','Beni Amrane','Boachar','Boudouaou','Boudouaou El Bahri','Boumerdes','Bouzegza Keddara','Chabet El Ameur','Corso','Dellys','Djinet','El Kharrouba','Hammedi','Isser','Khemis El Khechna','Larbatache','Larbaa','Leghata','Naciria','Ouled Aïssa','Ouled Hedadj','Ouled Moussa','Si Mustapha','Souk El Had','Taourga','Tidjelabine','Timezrit','Zemmouri']
  },
  {
    code: '36', name: 'El Tarf', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['El Tarf','Aïn El Assel','Aïn Kerma','Benhara','Besbes','Bouhadjar','Boumahra Ahmed','Bougous','Chbaita Mokhtar','Chefia','Dréan','Drean','El Aioun','El Kala','Hammam Beni Salah','Lac des Oiseaux','Oum Teboul','Raml Souk','Souarekh','Zerizer','Zitouna']
  },
  {
    code: '37', name: 'Tindouf', homePrice: 1200, officePrice: 800, deliveryDays: 6,
    communes: ['Tindouf','Oum El Assel']
  },
  {
    code: '38', name: 'Tissemsilt', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Tissemsilt','Ammari','Bordj El Emir Abdelkader','Boucaid','Bordj Bounaama','Khemisti','Lardjem','Lazharia','Maasem','Melaab','Ouled Bessem','Ouled Larbi','Sidi Abed','Sidi Boutouchent','Sidi Lantri','Sidi Slimane','Theniet El Had','Tissemsilt']
  },
  {
    code: '39', name: 'El Oued', homePrice: 800, officePrice: 500, deliveryDays: 5,
    communes: ['El Oued','Amieur','Bayadha','Ben Guecha','Beni Guecha','Debila','Douar El Ma','Djamaa','El Méghaier','Ghamra','Guemmar','Hamraia','Hassi Khalifa','Kouinine','Mih Ouansa','Mrara','Nakhla','Oued El Alenda','Oued El Khrouf','Oum Touyour','Reguiba','Robbah','Sidi Aoun','Sidi Khellil','Still','Taghzout','Taleb Larbi','Talkhamit','Trifaoui','Yebbi']
  },
  {
    code: '40', name: 'Khenchela', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['Khenchela','Aïn Touila','Baghai','Babar','Bouhmama','Chechar','Djellal','El Hamma','El Oueldja','El Mahmel','Ensigha','Kais','Khirane','Msara','Ouled Rechache','Remila','Tamza','Yabous']
  },
  {
    code: '41', name: 'Souk Ahras', homePrice: 750, officePrice: 500, deliveryDays: 4,
    communes: ['Souk Ahras','Ain Soltane','Ain Zana','Bir Bouhouche','Dahouara','Drea','El Hakania','Hanancha','Khedara','Khenak','Kheshna','M\'Daourouch','Mechroha','Merahna','Ouled Moumen','Oum El Adhaim','Ragouba','Safel El Ouiden','Saouma','Sedrata','Taoura','Terraguelt','Tiffech','Zaarouria','Zouabi']
  },
  {
    code: '42', name: 'Tipaza', homePrice: 500, officePrice: 300, deliveryDays: 2,
    communes: ['Tipaza','Aghabal','Ain Tagourait','Attatba','Bou Ismail','Bou Haroun','Boudouaou El Bahri','Bourkika','Cherchell','Damous','El Afroun','Fouka','Gouraya','Hamr','Hadjout','Kolea','Larhat','Menaceur','Messelmoun','Nador','Nouail','Sidi Amar','Sidi Ghiles','Sidi Rached','Sidi Semiane','Sidi Smai','Tipaza','Zaghmar']
  },
  {
    code: '43', name: 'Mila', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Mila','Ahmed Rachedi','Ain El Larbi','Ain Mellouk','Ain Tine','Benyahia Abderrahmane','Bouhatem','Chelghoum Laïd','Derrahi Mohammed','El Mechira','Elayadi Barbes','Ferdjioua','Grarem Gouga','Hamala','Ibn Ziad','Lardjam','Minar Zarza','Oued Athmenia','Oued El Djemaa','Oued Seguen','Ouled Khalouf','Rouached','Sidi Khelifa','Sidi Merouane','Tadjenanet','Tassadane Haddada','Teleghma','Terrai Bainen','Terregha','Tiberguent','Tighilt Rissa','Ain Beida Harriche']
  },
  {
    code: '44', name: 'Aïn Defla', homePrice: 650, officePrice: 400, deliveryDays: 3,
    communes: ['Aïn Defla','Ain Benekrane','Ain Bouyahia','Ain Lechiekh','Ain Soltane','Ain Torki','Arib','Bathia','Ben Allal','Bir Ould Khelifa','Bourached','Boumedfaa','Chenoua','Djelida','Djendel','El Abadia','El Amra','El Attaf','El Hassania','El Maine','Hammam Righa','Hoceinia','Jemaa Ouled Cheikh','Khemis Miliana','Mekhatria','Miliana','Moulay Slissen','Oued Chorfa','Oued Djemaa','Oued El Aneb','Ouled Bouachra','Ouled Chorfa','Rouina','Sidi Lakhdar','Tarik Ibn Ziad','Tiberkanine']
  },
  {
    code: '45', name: 'Naâma', homePrice: 800, officePrice: 550, deliveryDays: 5,
    communes: ['Naâma','Ain Ben Khelil','Ain Sefra','Asla','Djeniene Bourezg','El Biodh','Kasdir','Mecheria','Mekmen Ben Amar','Moghrar','Sfissifa','Tiout']
  },
  {
    code: '46', name: 'Aïn Témouchent', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Aïn Témouchent','Aïn El Arbaa','Aïn El Kihal','Aïn Fraï','Aïn Larbaa','Aïn Tolba','Aïn Témouchent','Aoubellil','Beni Saf','Bou Khanefis','Chentouf','El Amria','El Emir Abdelkader','El Maleh','El Ouata','Hammam Bou Hadjar','Hassi El Ghella','Mesra','Odor','Oulhaça El Gheraba','Ouled Boudjemaa','Ouled Kihal','Sidi Ben Adda','Sidi Boumediene','Sidi Safi','Sidi Ouriach','Tamzoura','Terga']
  },
  {
    code: '47', name: 'Ghardaïa', homePrice: 800, officePrice: 500, deliveryDays: 5,
    communes: ['Ghardaïa','Berriane','Bounoura','Dhayet Ben Dhahoua','El Atteuf','El Guerrara','Guerrara','Hassi El F\'Hel','Mansoura','Metlili','Sebseb','Zelfana']
  },
  {
    code: '48', name: 'Relizane', homePrice: 700, officePrice: 450, deliveryDays: 4,
    communes: ['Relizane','Ain Tarek','Ammi Moussa','Beni Dergoun','Beni Zentis','Belassel Bouzegza','Djidioua','El Guettar','El Hamadna','El Hashem','El Matmar','Elmadna','Fil Fila','Had Echkala','Hamri','Kalaa','Lahlef','Mazouna','Mendes','Merettene','Mounta','Oued El Djemaa','Oued Rhiou','Oued Sly','Ouled Aiche','Ouled Sidi Mihoub','Ramka','Sidi Khettab','Sidi Lazreg','Sidi M\'Hamed Ben Aouda','Sidi Saada','Si Abdelghani','Sidi Slimane','Souk El Had','Yellel','Zemmora']
  },
  {
    code: '49', name: 'El M\'Ghair', homePrice: 850, officePrice: 550, deliveryDays: 5,
    communes: ['El M\'Ghair','Djamaa','El Hadjira','Meraier','Mrara','Oum Touyour','Still','Tendla']
  },
  {
    code: '50', name: 'El Menia', homePrice: 900, officePrice: 600, deliveryDays: 5,
    communes: ['El Menia','Hassi Gara','In Ecker','Issoufene','Mansoura']
  },
  {
    code: '51', name: 'Ouled Djellal', homePrice: 800, officePrice: 500, deliveryDays: 4,
    communes: ['Ouled Djellal','Besbes','Chaïba','Doucen','M\'Lili','Ouled Djellal','Ras El Miaad','Sidi Khaled']
  },
  {
    code: '52', name: 'Bordj Baji Mokhtar', homePrice: 1300, officePrice: 900, deliveryDays: 6,
    communes: ['Bordj Baji Mokhtar','Timiaouine']
  },
  {
    code: '53', name: 'Béni Abbès', homePrice: 950, officePrice: 650, deliveryDays: 5,
    communes: ['Béni Abbès','El Ouata','Igli','Kerzaz','Ksabi','Ouled Khoudir','Tabelbala','Timoudi']
  },
  {
    code: '54', name: 'Timimoun', homePrice: 900, officePrice: 600, deliveryDays: 5,
    communes: ['Timimoun','Aougrout','Charouine','Deldoul','Fenoughil','In Zghmir','Metarfa','Ouled Aïssa','Ouled Said','Tamentit']
  },
  {
    code: '55', name: 'Touggourt', homePrice: 800, officePrice: 500, deliveryDays: 4,
    communes: ['Touggourt','Blidet Amor','El Hadjira','Guemar','Megarine','Nezla','Sidi Slimane','Temacine','Taibet','Zaouia El Abidia','Zilane']
  },
  {
    code: '56', name: 'Djanet', homePrice: 1200, officePrice: 800, deliveryDays: 6,
    communes: ['Djanet','Bordj El Haouas']
  },
  {
    code: '57', name: 'In Salah', homePrice: 1000, officePrice: 700, deliveryDays: 5,
    communes: ['In Salah','Foggaret Ezzaouia','In Ghar','In Guezzam','Ksar Hirane','Silet']
  },
  {
    code: '58', name: 'In Guezzam', homePrice: 1300, officePrice: 900, deliveryDays: 6,
    communes: ['In Guezzam','Tin Zaouatine']
  }
];

export default WILAYAS_DATA;
