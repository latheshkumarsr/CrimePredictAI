import { CrimeData } from '../types';

// Indian cities with their coordinates and districts
const indianCities = [
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    districts: ['Andheri', 'Bandra', 'Borivali', 'Colaba', 'Dadar', 'Goregaon', 'Juhu', 'Kurla', 'Malad', 'Powai', 'Santacruz', 'Thane', 'Vashi', 'Worli']
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    districts: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Nehru Place', 'Rajouri Garden', 'Saket', 'Vasant Kunj', 'Dwarka', 'Rohini', 'Janakpuri', 'Laxmi Nagar', 'Mayur Vihar', 'Pitampura', 'Preet Vihar']
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    districts: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar', 'Malleshwaram', 'Rajajinagar', 'Basavanagudi', 'BTM Layout', 'HSR Layout', 'Marathahalli', 'Yelahanka', 'Banashankari', 'JP Nagar', 'Hebbal', 'Sarjapur', 'Bellandur', 'Bommanahalli', 'Ramamurthy Nagar', 'CV Raman Nagar', 'KR Puram', 'Mahadevapura', 'Rajarajeshwari Nagar', 'Kengeri', 'Nagarbhavi', 'Vijayanagar', 'Rajaji Nagar', 'Seshadripuram', 'Shivaji Nagar', 'Richmond Town', 'Frazer Town', 'Cox Town', 'Cunningham Road', 'Brigade Road', 'Commercial Street', 'Chickpet', 'KR Market', 'Lalbagh', 'Wilson Garden', 'Langford Town', 'Shanti Nagar', 'Koramangala 1st Block', 'Koramangala 4th Block', 'Koramangala 5th Block', 'Koramangala 6th Block', 'Koramangala 7th Block', 'Koramangala 8th Block', 'BTM 1st Stage', 'BTM 2nd Stage', 'JP Nagar 1st Phase', 'JP Nagar 2nd Phase', 'JP Nagar 3rd Phase', 'JP Nagar 4th Phase', 'JP Nagar 5th Phase', 'JP Nagar 6th Phase', 'JP Nagar 7th Phase', 'JP Nagar 8th Phase', 'Banashankari 1st Stage', 'Banashankari 2nd Stage', 'Banashankari 3rd Stage', 'Girinagar', 'Kathriguppe', 'Konanakunte', 'Uttarahalli', 'Subramanyapura', 'Talaghattapura', 'Kanakapura Road', 'Bannerghatta Road', 'Hosur Road', 'Old Airport Road', 'New Airport Road', 'Outer Ring Road', 'Magadi Road', 'Tumkur Road', 'Bellary Road', 'Old Madras Road', 'Kammanahalli', 'Kalyan Nagar', 'RT Nagar', 'Sadashiva Nagar', 'Dollars Colony', 'HBR Layout', 'Banaswadi', 'Horamavu', 'Hennur', 'Thanisandra', 'Jakkur', 'Sahakara Nagar', 'Gangamma Circle', 'Mekhri Circle', 'Cauvery Theatre', 'Shivajinagar Bus Stand', 'Majestic', 'City Railway Station', 'Cantonment Railway Station', 'Yeshwantpur', 'Peenya', 'Jalahalli', 'Mathikere', 'Malleswaram 18th Cross', 'Malleswaram 8th Cross', 'Rajajinagar 1st Block', 'Rajajinagar 2nd Block', 'Rajajinagar 3rd Block', 'Rajajinagar 4th Block', 'Rajajinagar 5th Block', 'Rajajinagar 6th Block', 'Basaveshwaranagar', 'Kamakshipalya', 'Mahalakshmi Layout', 'Chord Road', 'Prakash Nagar', 'Lakshmi Devi Nagar', 'Srinagar', 'Papanna Layout', 'Nandini Layout', 'RPC Layout', 'Ideal Homes Township', 'ISRO Layout', 'Dollars Colony', 'New Thippasandra', 'Old Thippasandra', 'HAL Airport', 'Domlur', 'Ejipura', 'Vivek Nagar', 'Jeevan Bima Nagar', 'HAL 2nd Stage', 'HAL 3rd Stage', 'Kodihalli', 'Murphy Town', 'Richards Town', 'Pulakeshi Nagar', 'DJ Halli', 'Shivaji Nagar', 'Bharathi Nagar', 'Pottery Town', 'Cantonment', 'Ulsoor', 'MG Road', 'Brigade Road', 'Church Street', 'St. Marks Road', 'Residency Road', 'Museum Road', 'Kasturba Road', 'Lavelle Road', 'Infantry Road', 'Cubbon Park', 'Vidhana Soudha', 'High Court', 'GPO', 'Town Hall', 'KR Circle', 'Minerva Circle', 'Hudson Circle', 'Domlur Flyover', 'Silk Board', 'BTM Water Tank', 'Jayadeva Hospital', 'Bannerghatta National Park', 'Nice Road', 'Kanakapura', 'Ramanagara', 'Channapatna', 'Mandya Road', 'Mysore Road', 'Kengeri Satellite Town', 'Bidadi', 'Rajarajeshwari Medical College', 'Global Village Tech Park', 'International Tech Park', 'Bagmane Tech Park', 'Prestige Tech Park', 'RMZ Infinity', 'Cessna Business Park', 'Embassy Golf Links', 'UB City Mall', 'Forum Mall', 'Garuda Mall', 'Mantri Square', 'Phoenix MarketCity', 'Orion Mall', 'GT World Mall', 'Esteem Mall', 'Central Mall', 'Gopalan Mall', 'Elements Mall', 'Nexus Mall', 'The Forum Value Mall', 'Lulu Mall']
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    districts: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Chrompet', 'Mylapore', 'Nungambakkam', 'Egmore', 'Guindy', 'Porur', 'OMR', 'Sholinganallur', 'Perungudi']
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    districts: ['Park Street', 'Salt Lake', 'Howrah', 'Ballygunge', 'Alipore', 'Gariahat', 'Esplanade', 'Sealdah', 'Dumdum', 'Barasat', 'Jadavpur', 'Tollygunge', 'New Town', 'Rajarhat']
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    districts: ['Banjara Hills', 'Jubilee Hills', 'Secunderabad', 'Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur', 'Begumpet', 'Abids', 'Kukatpally', 'Miyapur', 'Uppal', 'LB Nagar', 'Dilsukhnagar']
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    districts: ['Koregaon Park', 'Baner', 'Wakad', 'Hinjewadi', 'Kothrud', 'Deccan', 'Camp', 'Viman Nagar', 'Hadapsar', 'Magarpatta', 'Aundh', 'Pimpri', 'Chinchwad', 'Katraj']
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    districts: ['Navrangpura', 'Vastrapur', 'Satellite', 'Bopal', 'Prahlad Nagar', 'CG Road', 'Maninagar', 'Ghatlodia', 'Chandkheda', 'Nikol', 'Naroda', 'Isanpur', 'Vastral', 'Sarkhej']
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    districts: ['Pink City', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Civil Lines', 'Bani Park', 'Raja Park', 'Sodala', 'Jhotwara', 'Sanganer', 'Bagru', 'Chomu']
  },
  {
    name: 'Surat',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    districts: ['Adajan', 'Vesu', 'Althan', 'Piplod', 'Rander', 'Katargam', 'Varachha', 'Nanpura', 'Athwa', 'Citylight', 'Ghod Dod Road', 'Ring Road', 'Udhna', 'Magdalla']
  },
  // Additional Karnataka Cities
  {
    name: 'Mysore',
    state: 'Karnataka',
    lat: 12.2958,
    lng: 76.6394,
    districts: ['Saraswathipuram', 'Kuvempunagar', 'Vijayanagar', 'Hebbal', 'Gokulam', 'Jayalakshmipuram', 'Bogadi', 'Srirampura', 'Nazarbad', 'Devaraja Mohalla', 'Chamarajapuram', 'Krishnamurthypuram', 'Yadavagiri', 'Ramakrishnanagar', 'VV Mohalla', 'Lakshmipuram', 'Tilak Nagar', 'Siddarthanagar', 'Dattagalli', 'Rajivnagar', 'Hootagalli', 'Hinkal', 'Metagalli', 'JP Nagar', 'Kergalli', 'Bannimantap', 'Vidyaranyapuram', 'Bogadi 2nd Stage', 'Bogadi 3rd Stage', 'Kuvempunagar Extension']
  },
  {
    name: 'Hubli',
    state: 'Karnataka',
    lat: 15.3647,
    lng: 75.1240,
    districts: ['Vidyanagar', 'Keshwapur', 'Gokul Road', 'Deshpande Nagar', 'Akshay Park', 'Navanagar', 'Unkal', 'Hosur', 'Rayapur', 'Tarihal', 'Kusugal', 'Amargol', 'Shirur Park', 'Keshwapur Extension', 'Vidyanagar Extension', 'CBT', 'Old Hubli', 'Lakamanhalli', 'Tolankere', 'Gabbur', 'Karwar Road', 'Pune-Bangalore Highway', 'BRTS Road', 'Jubilee Circle', 'Nehru Nagar', 'Gandhi Nagar', 'Subhash Nagar', 'Indira Nagar', 'Rajendra Nagar', 'Shantinagar']
  },
  {
    name: 'Dharwad',
    state: 'Karnataka',
    lat: 15.4589,
    lng: 75.0078,
    districts: ['Saptapur', 'Malmaddi', 'Navalur', 'Kelgeri', 'Vidyagiri', 'Sattur', 'Managuli', 'Hosayalapur', 'Kundgol Road', 'Hubballi Road', 'Court Circle', 'Jubilee Circle', 'SDM College', 'Karnataka University', 'Karnatak Arts College', 'SDMCET', 'KLE University', 'Lakamanahalli', 'Rayapur Extension', 'Vidyanagar Colony', 'Teachers Colony', 'Judges Colony', 'Police Colony', 'Railway Colony', 'APMC Yard', 'Bus Stand Area', 'Market Area', 'Gandhi Nagar', 'Nehru Nagar', 'Ambedkar Nagar']
  },
  {
    name: 'Mangalore',
    state: 'Karnataka',
    lat: 12.9141,
    lng: 74.8560,
    districts: ['Hampankatta', 'Lalbagh', 'Kodialbail', 'Kadri', 'Pandeshwar', 'Yeyyadi', 'Kottara', 'Bejai', 'Kankanady', 'Urva', 'Jeppu', 'Balmatta', 'Dongerkery', 'Shivbagh', 'Attavar', 'Bendoorwell', 'Maroli', 'Pumpwell', 'Thokkottu', 'Ullal', 'Deralakatte', 'Konaje', 'Bajpe', 'Mulky', 'Surathkal', 'Mukka', 'Kateel', 'Moodbidri', 'Karkala', 'Udupi Road', 'BC Road', 'Bantwal', 'Puttur Road', 'Kasaragod Road', 'NITK Surathkal', 'Manipal', 'Malpe', 'Kaup', 'Brahmavar', 'Kundapura']
  },
  {
    name: 'Belgaum',
    state: 'Karnataka',
    lat: 15.8497,
    lng: 74.4977,
    districts: ['Camp', 'Tilakwadi', 'Shahapur', 'Hindwadi', 'Vadgaon', 'Kakati', 'Angol', 'Machhe', 'Udyambag', 'Rajendra Nagar', 'Nehru Nagar', 'Gandhi Nagar', 'Shivaji Nagar', 'Ambedkar Nagar', 'Indira Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar', 'Saraswati Nagar', 'Vidya Nagar', 'Shanti Nagar', 'Prabhu Nagar', 'Guru Nagar', 'Bharat Nagar', 'Hindustan Nagar', 'Maratha Colony']
  },
  {
    name: 'Gulbarga',
    state: 'Karnataka',
    lat: 17.3297,
    lng: 76.8343,
    districts: ['Super Market', 'Jewargi Road', 'Humnabad Road', 'Aland Road', 'Sedam Road', 'Afzalpur Road', 'Chincholi Road', 'Shahabad Road', 'Yadgir Road', 'Raichur Road', 'Station Road', 'College Road', 'Hospital Road', 'Court Road', 'Gandhi Nagar', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Shivaji Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar', 'Saraswati Nagar', 'Vidya Nagar', 'Shanti Nagar']
  },
  {
    name: 'Davangere',
    state: 'Karnataka',
    lat: 14.4644,
    lng: 75.9218,
    districts: ['PJ Extension', 'Shivaji Nagar', 'Bapuji Nagar', 'Vidyanagar', 'Shamanur Road', 'Harihara Road', 'Channagiri Road', 'Honnali Road', 'Jagalur Road', 'Mayakonda', 'Lokikere Road', 'Anaji Peth', 'Kondajji', 'Bethur', 'Kundur', 'Sante Bennur', 'Hadadi Road', 'Tarikere Road', 'Shimoga Road', 'Chitradurga Road', 'Gandhi Nagar', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar']
  },
  {
    name: 'Bellary',
    state: 'Karnataka',
    lat: 15.1394,
    lng: 76.9214,
    districts: ['Cantonment', 'Gandhi Nagar', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Shivaji Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar', 'Saraswati Nagar', 'Vidya Nagar', 'Shanti Nagar', 'Prabhu Nagar', 'Guru Nagar', 'Bharat Nagar', 'Hindustan Nagar', 'Maratha Colony', 'Rampura', 'Kurugodu Road', 'Hospet Road', 'Sandur Road', 'Siruguppa Road', 'Kudligi Road', 'Hagaribommanahalli Road', 'Tekkalakote Road']
  },
  {
    name: 'Bijapur',
    state: 'Karnataka',
    lat: 16.8302,
    lng: 75.7100,
    districts: ['Station Road', 'MG Road', 'Gandhi Chowk', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Shivaji Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar', 'Saraswati Nagar', 'Vidya Nagar', 'Shanti Nagar', 'Prabhu Nagar', 'Guru Nagar', 'Bharat Nagar', 'Hindustan Nagar', 'Maratha Colony', 'Indi Road', 'Sindgi Road', 'Basavana Bagewadi Road', 'Muddebihal Road', 'Bagalkot Road', 'Jamkhandi Road', 'Almatti Road']
  },
  {
    name: 'Shimoga',
    state: 'Karnataka',
    lat: 13.9299,
    lng: 75.5681,
    districts: ['Kuvempu Nagar', 'Vidyanagar', 'Gandhi Bazaar', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Shivaji Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Vijay Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar', 'Saraswati Nagar', 'Vidya Nagar', 'Shanti Nagar', 'Prabhu Nagar', 'Guru Nagar', 'Bharat Nagar', 'Hindustan Nagar', 'Maratha Colony', 'Bhadravathi Road', 'Thirthahalli Road', 'Sagar Road', 'Hosanagar Road', 'Soraba Road', 'Shikaripura Road', 'Channagiri Road']
  },
  // Additional Major Indian Cities
  {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    districts: ['Hazratganj', 'Aminabad', 'Chowk', 'Gomti Nagar', 'Indira Nagar', 'Aliganj', 'Mahanagar', 'Rajajipuram', 'Jankipuram', 'Vikas Nagar', 'Ashiyana', 'Chinhat', 'Faizabad Road', 'Hardoi Road', 'Sitapur Road', 'Kanpur Road', 'Rae Bareli Road', 'IIM Road', 'Shaheed Path', 'Kursi Road', 'Amausi', 'Bakshi Ka Talab', 'Mohanlalganj', 'Malihabad', 'Kakori', 'Gosainganj', 'Sarojini Nagar', 'Lalbagh', 'Hussainganj', 'Nakhas']
  },
  {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    lat: 26.4499,
    lng: 80.3319,
    districts: ['Civil Lines', 'Mall Road', 'The Mall', 'Swaroop Nagar', 'Govind Nagar', 'Kidwai Nagar', 'Harsh Nagar', 'Kalyanpur', 'Panki', 'Chakeri', 'Barra', 'Shyam Nagar', 'Fazalganj', 'Nawabganj', 'Babupurwa', 'Naubasta', 'Rawatpur', 'Jajmau', 'Sisamau', 'Colonelganj', 'Gwaltoli', 'Beconganj', 'Parade', 'Cantonment', 'Arya Nagar', 'Tilak Nagar', 'Kaushalpuri', 'Yashoda Nagar', 'Vikas Nagar', 'Indira Nagar']
  },
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.1458,
    lng: 79.0882,
    districts: ['Sitabuldi', 'Sadar', 'Dharampeth', 'Civil Lines', 'Ramdaspeth', 'Mahal', 'Gandhibagh', 'Nandanvan', 'Pratap Nagar', 'Trimurti Nagar', 'Manish Nagar', 'Shankar Nagar', 'Bajaj Nagar', 'Narendra Nagar', 'Khamla', 'Manewada', 'Besa', 'Wadi', 'Koradi Road', 'Kamptee Road', 'Amravati Road', 'Wardha Road', 'Katol Road', 'Umred Road', 'Hingna Road', 'Butibori', 'MIDC', 'Hingna', 'Parseoni', 'Kamptee']
  },
  {
    name: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
    districts: ['Rajwada', 'Sarafa Bazaar', 'Chappan Dukan', 'Palasia', 'Vijay Nagar', 'Scheme No 54', 'AB Road', 'MG Road', 'Sapna Sangeeta Road', 'New Palasia', 'Bhawarkuan', 'Rau', 'Dewas Naka', 'Khandwa Road', 'Ujjain Road', 'Agra Bombay Road', 'Ring Road', 'Super Corridor', 'Bhopal Road', 'Gumasta Nagar', 'Tilak Nagar', 'Pardesipura', 'Lasudia Mori', 'Aerodrome Road', 'Kanadiya Road', 'Simrol', 'Sanwer Road', 'Khajrana', 'Rajendra Nagar', 'Annapurna Road']
  },
  {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    lat: 23.2599,
    lng: 77.4126,
    districts: ['New Market', 'MP Nagar', 'TT Nagar', 'Arera Colony', 'Shahpura', 'Kolar Road', 'Habibganj', 'Hoshangabad Road', 'Berasia Road', 'Raisen Road', 'Sehore Road', 'Vidisha Road', 'Gwalior Road', 'Indore Road', 'BHEL', 'Bairagarh', 'Bagh Sewania', 'Shyamla Hills', 'Boat Club', 'VIP Road', 'Link Road', 'Bittan Market', 'Chuna Bhatti', 'Govindpura', 'Jahangirabad', 'Itwara', 'Peer Gate', 'Hamidia Road', 'Sultania Road', 'Danish Kunj']
  },
  {
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
    districts: ['Dwaraka Nagar', 'MVP Colony', 'Siripuram', 'Lawsons Bay Colony', 'Beach Road', 'RK Beach', 'Jagadamba Centre', 'CMR Central', 'Gajuwaka', 'Madhurawada', 'Rushikonda', 'Bheemunipatnam', 'Anakapalle', 'Pendurthi', 'Sabbavaram', 'Pedagantyada', 'Seethammadhara', 'Akkayyapalem', 'Malkapuram', 'Marripalem', 'Allipuram', 'Gopalapatnam', 'Maddilapalem', 'Kancharapalem', 'Kurmannapalem', 'Asilmetta', 'Old Town', 'One Town', 'Two Town', 'Three Town']
  },
  {
    name: 'Vadodara',
    state: 'Gujarat',
    lat: 22.3072,
    lng: 73.1812,
    districts: ['Alkapuri', 'Fatehgunj', 'Sayajigunj', 'Karelibaug', 'Manjalpur', 'Gotri', 'Vasna', 'Waghodia Road', 'Makarpura', 'Gorwa', 'Subhanpura', 'Nizampura', 'Akota', 'Sama', 'Harni', 'Tarsali', 'Bapod', 'Tandalja', 'Productivity Road', 'VIP Road', 'RC Dutt Road', 'Jetalpur Road', 'Padra Road', 'Dabhoi Road', 'Halol Road', 'Kalol Road', 'Savli Road', 'Chhani Road', 'Manjusar', 'Nandesari']
  },
  {
    name: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1767,
    lng: 78.0081,
    districts: ['Taj Ganj', 'Sadar Bazaar', 'Civil Lines', 'Kamla Nagar', 'Dayalbagh', 'Sikandra', 'Fatehabad Road', 'Mathura Road', 'Delhi Gate', 'Shah Ganj', 'Loha Mandi', 'Belanganj', 'Nunhai', 'Khandari', 'Rakabganj', 'Tajganj', 'Hing Ki Mandi', 'Kinari Bazaar', 'Rawatpara', 'Mantola', 'Purani Mandi', 'Johri Bazaar', 'Chatta Bazaar', 'Gwalior Road', 'Firozabad Road', 'Etmadpur', 'Runkata', 'Artoni', 'Kiraoli', 'Bah']
  },
  {
    name: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    districts: ['College Road', 'MG Road', 'Gangapur Road', 'Panchavati', 'Nashik Road', 'Deolali', 'Pathardi Phata', 'Adgaon', 'Ambad', 'Satpur', 'MIDC', 'Sinnar', 'Dindori', 'Kalwan', 'Igatpuri', 'Trimbakeshwar', 'Yeola', 'Niphad', 'Malegaon', 'Baglan', 'Chandwad', 'Nandgaon', 'Kalwan', 'Surgana', 'Peint', 'Deola', 'Baglan', 'Malegaon', 'Sinnar', 'Dindori']
  },
  {
    name: 'Faridabad',
    state: 'Haryana',
    lat: 28.4089,
    lng: 77.3178,
    districts: ['Sector 15', 'Sector 16', 'Sector 17', 'Sector 21', 'NIT', 'Old Faridabad', 'New Industrial Township', 'Ballabgarh', 'Tigaon', 'Palwal Road', 'Mathura Road', 'Surajkund', 'Badkhal', 'Anangpur', 'Pali', 'Hodal Road', 'Sohna Road', 'Gurgaon Road', 'Delhi Border', 'Badarpur Border', 'Neelam Chowk', 'YMCA Chowk', 'Ajronda Chowk', 'Bata Chowk', 'Railway Station', 'Bus Stand', 'Civil Hospital', 'District Court', 'Collectorate', 'Police Lines']
  },
  {
    name: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6692,
    lng: 77.4538,
    districts: ['Raj Nagar', 'Vaishali', 'Indirapuram', 'Vasundhara', 'Kaushambi', 'Crossings Republik', 'Loni', 'Muradnagar', 'Modi Nagar', 'Hapur Road', 'Meerut Road', 'Delhi Road', 'Bulandshahr Road', 'GT Road', 'NH 24', 'Sahibabad', 'Govindpuram', 'Vijay Nagar', 'Shastri Nagar', 'Gandhi Nagar', 'Nehru Nagar', 'Indira Nagar', 'Rajiv Nagar', 'Ambedkar Nagar', 'Subhash Nagar', 'Ashok Nagar', 'Hanuman Nagar', 'Ram Nagar', 'Sita Nagar', 'Lakshmi Nagar']
  },
  {
    name: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9010,
    lng: 75.8573,
    districts: ['Civil Lines', 'Model Town', 'Sarabha Nagar', 'BRS Nagar', 'Dugri', 'Pakhowal Road', 'Ferozepur Road', 'GT Road', 'Chandigarh Road', 'Malerkotla Road', 'Jagraon Road', 'Raikot Road', 'Samrala Road', 'Khanna Road', 'Doraha', 'Machhiwara', 'Sidhwan Bet', 'Jalandhar Bypass', 'Salem Tabri', 'Haibowal', 'Tibba', 'Jodhewal', 'Barewal', 'Hambran Road', 'Industrial Area A', 'Industrial Area B', 'Industrial Area C', 'Focal Point', 'Dhandari Kalan', 'Miller Ganj']
  },
  {
    name: 'Kochi',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    districts: ['Ernakulam', 'Fort Kochi', 'Mattancherry', 'Marine Drive', 'MG Road', 'Panampilly Nagar', 'Kadavanthra', 'Kaloor', 'Palarivattom', 'Edapally', 'Kakkanad', 'Infopark', 'Aluva', 'Perumbavoor', 'Angamaly', 'Muvattupuzha', 'Kothamangalam', 'Thodupuzha', 'Kottayam Road', 'Alappuzha Road', 'Thrissur Road', 'Salem Road', 'Coimbatore Road', 'Munnar Road', 'Kumily Road', 'Thekkady Road', 'Idukki Road', 'Vagamon Road', 'Kuttikanam', 'Peermade']
  },
  {
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    lat: 11.0168,
    lng: 76.9558,
    districts: ['RS Puram', 'Race Course', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Vadavalli', 'Singanallur', 'Kuniamuthur', 'Thudiyalur', 'Kalapatti', 'Saravanampatty', 'Kuniyamuthur', 'Pollachi Road', 'Palakkad Road', 'Trichy Road', 'Salem Road', 'Mettupalayam Road', 'Avinashi Road', 'Sathy Road', 'Annur Road', 'Madukkarai', 'Ettimadai', 'Coimbatore North', 'Coimbatore South', 'Podanur', 'Irugur', 'Perur', 'Sulur', 'Neelambur', 'Ramanathapuram']
  },
  {
    name: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9252,
    lng: 78.1198,
    districts: ['Meenakshi Amman Temple', 'Anna Nagar', 'KK Nagar', 'SS Colony', 'Vilangudi', 'Thiruparankundram', 'Avaniyapuram', 'Pasumalai', 'Sellur', 'Goripalayam', 'Town Hall', 'Periyar Bus Stand', 'Railway Junction', 'Mattuthavani', 'Teppakulam', 'Tallakulam', 'Othakadai', 'Nagamalai', 'Koodal Nagar', 'Arapalayam', 'Bypass Road', 'Dindigul Road', 'Trichy Road', 'Sivaganga Road', 'Ramnad Road', 'Theni Road', 'Virudhunagar Road', 'Tirunelveli Road', 'Kanyakumari Road', 'Ramanathapuram Road']
  },
  {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    districts: ['Dashashwamedh Ghat', 'Assi Ghat', 'Manikarnika Ghat', 'Godowlia', 'Lahurabir', 'Sigra', 'Lanka', 'BHU', 'Sarnath', 'Ramnagar', 'Chaukaghat', 'Chetganj', 'Mahmoorganj', 'Kotwali', 'Bhelupur', 'Shivpur', 'Rohania', 'Babatpur', 'Cholapur', 'Harhua', 'Phulpur', 'Pindra', 'Mirzamurad', 'Sewapuri', 'Arajiline', 'Cantt', 'DLW', 'Diesel Locomotive Works', 'Manduadih', 'Mughal Sarai']
  },
  {
    name: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 28.9845,
    lng: 77.7064,
    districts: ['Civil Lines', 'Cantonment', 'Sadar Bazaar', 'Brahmpuri', 'Shastri Nagar', 'Lalkurti', 'Pallavpuram', 'Shatabdi Nagar', 'Ganga Nagar', 'Jagriti Vihar', 'Partapur', 'Lisari Gate', 'Delhi Gate', 'Hapur Road', 'Roorkee Road', 'Muzaffarnagar Road', 'Garh Road', 'Baghpat Road', 'Sardhana Road', 'Modipuram', 'Mawana Road', 'Hastinapur Road', 'Parikshitgarh', 'Daurala', 'Kharkhauda', 'Jani Khurd', 'Kharkhoda', 'Sarurpur Khurd', 'Rajpura', 'Khatauli']
  },
  {
    name: 'Rajkot',
    state: 'Gujarat',
    lat: 22.3039,
    lng: 70.8022,
    districts: ['Race Course', 'Kalawad Road', 'Gondal Road', 'Morbi Road', 'Jamnagar Road', 'Bhavnagar Road', 'University Road', 'Yagnik Road', 'Jawahar Road', 'Kasturba Road', 'Limda Chowk', 'Jubilee Garden', 'Rajkumar College', 'Saurashtra University', 'Aji Dam', 'Nyari Dam', 'Lalpari Lake', 'Randarda', 'Mavdi', 'Kuvadva', 'Metoda', 'Shapar', 'Veraval', 'Lodhika', 'Paddhari', 'Jasdan', 'Kotda Sangani', 'Upleta', 'Dhoraji', 'Jetpur']
  },
  {
    name: 'Kalyan-Dombivli',
    state: 'Maharashtra',
    lat: 19.2403,
    lng: 73.1305,
    districts: ['Kalyan East', 'Kalyan West', 'Dombivli East', 'Dombivli West', 'Titwala', 'Khadavli', 'Mohone', 'Ambernath', 'Badlapur', 'Vangani', 'Shelu', 'Neral', 'Karjat', 'Khopoli', 'Pen', 'Alibag Road', 'Panvel Road', 'Thane Road', 'Mumbai Road', 'Nashik Road', 'Pune Road', 'Aurangabad Road', 'Ahmednagar Road', 'Kolhapur Road', 'Satara Road', 'Sangli Road', 'Solapur Road', 'Latur Road', 'Nanded Road', 'Parbhani Road']
  },
  {
    name: 'Vasai-Virar',
    state: 'Maharashtra',
    lat: 19.4914,
    lng: 72.8054,
    districts: ['Vasai East', 'Vasai West', 'Virar East', 'Virar West', 'Nalasopara East', 'Nalasopara West', 'Nallasopara', 'Naigaon', 'Boisar', 'Tarapur', 'Palghar', 'Dahanu', 'Bordi', 'Gholvad', 'Kelva', 'Mahim', 'Arnala', 'Shirgaon', 'Satpati', 'Murbe', 'Chinchani', 'Manor', 'Wada', 'Jawhar', 'Mokhada', 'Vikramgad', 'Talasari', 'Vangaon', 'Safale', 'Umbergaon']
  }
];

// Indian-specific crime types with realistic distribution
const indianCrimeTypes = [
  { type: 'Theft', weight: 25, severity: ['Low', 'Medium', 'High'] },
  { type: 'Burglary', weight: 18, severity: ['Medium', 'High'] },
  { type: 'Chain Snatching', weight: 15, severity: ['Medium', 'High'] },
  { type: 'Mobile Phone Theft', weight: 12, severity: ['Low', 'Medium'] },
  { type: 'Vehicle Theft', weight: 10, severity: ['High', 'Critical'] },
  { type: 'Domestic Violence', weight: 8, severity: ['High', 'Critical'] },
  { type: 'Fraud/Cheating', weight: 7, severity: ['Medium', 'High'] },
  { type: 'Assault', weight: 5, severity: ['High', 'Critical'] },
  { type: 'Cybercrime', weight: 4, severity: ['Medium', 'High'] },
  { type: 'Dowry Harassment', weight: 3, severity: ['High', 'Critical'] },
  { type: 'Drug Peddling', weight: 2, severity: ['High', 'Critical'] },
  { type: 'Kidnapping', weight: 1, severity: ['Critical'] }
];

// Indian street names and landmarks
const indianStreetNames = [
  'MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road', 'Church Street',
  'Park Street', 'Camac Street', 'AJC Bose Road', 'Rashbehari Avenue', 'Gariahat Road',
  'Linking Road', 'Hill Road', 'SV Road', 'LBS Marg', 'Western Express Highway',
  'Anna Salai', 'GST Road', 'ECR', 'OMR', 'Poonamallee High Road',
  'Rajpath', 'Janpath', 'Karol Bagh', 'CP', 'Khan Market',
  'FC Road', 'JM Road', 'Bund Garden Road', 'Koregaon Park', 'MG Road Pune',
  'CG Road', 'SG Highway', 'Ashram Road', 'Relief Road', 'Law Garden',
  'MI Road', 'Tonk Road', 'JLN Marg', 'Ajmer Road', 'Sikar Road'
];

// Generate weighted random crime type
const getWeightedCrimeType = () => {
  const totalWeight = indianCrimeTypes.reduce((sum, crime) => sum + crime.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const crime of indianCrimeTypes) {
    random -= crime.weight;
    if (random <= 0) {
      const severity = crime.severity[Math.floor(Math.random() * crime.severity.length)] as 'Low' | 'Medium' | 'High' | 'Critical';
      return { type: crime.type, severity };
    }
  }
  
  return { type: 'Theft', severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical' };
};

// Generate time-based crime patterns (Indian context)
const getTimeBasedProbability = (hour: number, crimeType: string) => {
  // Different crime types have different time patterns in India
  if (crimeType === 'Chain Snatching' || crimeType === 'Mobile Phone Theft') {
    // Peak during evening rush hours and early morning
    if (hour >= 7 && hour <= 10) return 1.5; // Morning rush
    if (hour >= 18 && hour <= 21) return 2.0; // Evening rush
    if (hour >= 22 || hour <= 5) return 0.3; // Late night/early morning
  }
  
  if (crimeType === 'Burglary') {
    // Peak during day when people are at work
    if (hour >= 10 && hour <= 16) return 1.8;
    if (hour >= 22 || hour <= 6) return 1.2;
  }
  
  if (crimeType === 'Cybercrime' || crimeType === 'Fraud/Cheating') {
    // More during business hours
    if (hour >= 9 && hour <= 18) return 1.5;
  }
  
  if (crimeType === 'Vehicle Theft') {
    // Peak during night
    if (hour >= 22 || hour <= 5) return 2.0;
    if (hour >= 18 && hour <= 21) return 1.3;
  }
  
  return 1.0; // Base probability
};

// Generate seasonal patterns
const getSeasonalMultiplier = (month: number, crimeType: string) => {
  // Festival seasons (Oct-Nov, Mar-Apr) see different crime patterns
  if (month >= 9 && month <= 11) { // Oct-Dec (Festival season)
    if (crimeType === 'Theft' || crimeType === 'Chain Snatching') return 1.3;
    if (crimeType === 'Burglary') return 0.8; // People stay home more
  }
  
  if (month >= 2 && month <= 4) { // Mar-May (Summer)
    if (crimeType === 'Domestic Violence') return 1.2; // Heat stress
    if (crimeType === 'Assault') return 1.1;
  }
  
  if (month >= 5 && month <= 8) { // Jun-Sep (Monsoon)
    if (crimeType === 'Vehicle Theft') return 0.7; // Less movement
    if (crimeType === 'Chain Snatching') return 0.8;
  }
  
  return 1.0;
};

// Generate comprehensive Indian crime dataset
export const generateIndianCrimeData = (count: number = 5000): CrimeData[] => {
  const crimes: CrimeData[] = [];
  const statuses: Array<'Open' | 'Under Investigation' | 'Closed' | 'Cold Case'> = ['Open', 'Under Investigation', 'Closed', 'Cold Case'];
  
  for (let i = 0; i < count; i++) {
    // Select random city
    const city = indianCities[Math.floor(Math.random() * indianCities.length)];
    const district = city.districts[Math.floor(Math.random() * city.districts.length)];
    
    // Generate coordinates within city bounds (±0.1 degree variation)
    const lat = city.lat + (Math.random() - 0.5) * 0.1;
    const lng = city.lng + (Math.random() - 0.5) * 0.1;
    
    // Generate realistic timestamp (last 2 years with seasonal patterns)
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    const randomTime = new Date(twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime()));
    
    // Get crime type and severity
    const { type, severity } = getWeightedCrimeType();
    
    // Apply time-based probability
    const hour = randomTime.getHours();
    const timeMultiplier = getTimeBasedProbability(hour, type);
    
    // Apply seasonal multiplier
    const month = randomTime.getMonth();
    const seasonalMultiplier = getSeasonalMultiplier(month, type);
    
    // Skip this iteration if probability is too low (creates realistic distribution)
    if (Math.random() > (timeMultiplier * seasonalMultiplier * 0.4)) {
      continue;
    }
    
    // Generate address
    const streetName = indianStreetNames[Math.floor(Math.random() * indianStreetNames.length)];
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    const address = `${houseNumber}, ${streetName}, ${district}, ${city.name}`;
    
    // Generate status based on crime type and time
    let status: 'Open' | 'Under Investigation' | 'Closed' | 'Cold Case';
    const daysSinceIncident = (now.getTime() - randomTime.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceIncident < 7) {
      status = Math.random() > 0.3 ? 'Open' : 'Under Investigation';
    } else if (daysSinceIncident < 30) {
      status = Math.random() > 0.5 ? 'Under Investigation' : 'Closed';
    } else if (daysSinceIncident < 365) {
      status = Math.random() > 0.7 ? 'Closed' : 'Cold Case';
    } else {
      status = Math.random() > 0.8 ? 'Closed' : 'Cold Case';
    }
    
    // Generate description
    const descriptions = {
      'Theft': `${type} reported at ${district}. Items stolen from ${Math.random() > 0.5 ? 'residence' : 'shop'}.`,
      'Chain Snatching': `Gold chain snatched by ${Math.random() > 0.5 ? 'bike-borne' : 'pedestrian'} miscreants in ${district}.`,
      'Mobile Phone Theft': `Mobile phone theft reported in ${district} area during ${hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'} hours.`,
      'Vehicle Theft': `${Math.random() > 0.5 ? 'Two-wheeler' : 'Four-wheeler'} theft reported from ${district} parking area.`,
      'Burglary': `House breaking and theft reported in ${district} residential area.`,
      'Domestic Violence': `Domestic violence case reported in ${district}. Victim provided medical assistance.`,
      'Fraud/Cheating': `Financial fraud case involving ${Math.random() > 0.5 ? 'online transaction' : 'fake documents'} reported in ${district}.`,
      'Assault': `Physical assault case reported in ${district}. ${Math.random() > 0.5 ? 'Victim hospitalized' : 'Minor injuries reported'}.`,
      'Cybercrime': `Cybercrime case involving ${Math.random() > 0.5 ? 'online fraud' : 'identity theft'} reported from ${district}.`,
      'Dowry Harassment': `Dowry harassment case reported in ${district}. Legal action initiated.`,
      'Drug Peddling': `Drug peddling case reported in ${district}. ${Math.floor(Math.random() * 5) + 1} persons arrested.`,
      'Kidnapping': `Kidnapping case reported in ${district}. Search operation launched.`
    };
    
    const crime: CrimeData = {
      id: `indian-crime-${i + 1}`,
      type,
      location: {
        lat,
        lng,
        address,
        district: `${district}, ${city.name}, ${city.state}`
      },
      timestamp: randomTime,
      severity,
      status,
      description: descriptions[type as keyof typeof descriptions] || `${type} incident reported in ${district} area.`
    };
    
    crimes.push(crime);
  }
  
  return crimes;
};

// Generate large Indian dataset
export const largeIndianCrimeData = generateIndianCrimeData(8000);

// Export for use in other components
export default largeIndianCrimeData;