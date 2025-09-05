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
    districts: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar', 'Malleshwaram', 'Rajajinagar', 'Basavanagudi', 'BTM Layout', 'HSR Layout', 'Marathahalli', 'Yelahanka', 'Banashankari', 'JP Nagar']
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
    const lat = city.lat + (Math.random() - 0.5) * 0.2;
    const lng = city.lng + (Math.random() - 0.5) * 0.2;
    
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
    if (Math.random() > (timeMultiplier * seasonalMultiplier * 0.3)) {
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
export const largeIndianCrimeData = generateIndianCrimeData(5000);

// Export for use in other components
export default largeIndianCrimeData;