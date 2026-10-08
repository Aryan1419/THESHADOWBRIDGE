export const CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Ahmedabad',
  'Hyderabad',
  'Bangalore',
  'Pune'
] as const;

export type ServedCity = typeof CITIES[number];

export const CITY_LOCALITIES: Record<string, string[]> = {
  'Mumbai': [
    'Andheri',
    'Bandra',
    'Borivali',
    'Chembur',
    'Dadar',
    'Ghatkopar',
    'Goregaon',
    'Juhu',
    'Kandivali',
    'Malad',
    'Mulund',
    'Powai',
    'Santacruz',
    'Vikhroli',
    'Worli',
    'Thane',
    'Navi Mumbai',
    'Vashi',
    'Kharghar',
    'Other (please specify)'
  ],
  'Hyderabad': [
    'Bachupally',
    'Gachibowli',
    'Kondapur',
    'Miyapur',
    'Kukatpally',
    'Nallakunta',
    'Jubilee Hills',
    'Banjara Hills',
    'Madhapur',
    'Hitec City',
    'Begumpet',
    'Secunderabad',
    'Uppal',
    'LB Nagar',
    'Himayatnagar',
    'Manikonda',
    'Ameerpet',
    'Other (please specify)'
  ],
  'Bangalore': [
    'Indiranagar',
    'Koramangala',
    'Whitefield',
    'HSR Layout',
    'Jayanagar',
    'JP Nagar',
    'Marathahalli',
    'Electronic City',
    'Yelahanka',
    'Rajajinagar',
    'Banashankari',
    'Bellandur',
    'Malleshwaram',
    'Sarjapur Road',
    'Hebbal',
    'BTM Layout',
    'Other (please specify)'
  ],
  'Delhi NCR': [
    'Gurgaon - DLF Phase 1-5',
    'Gurgaon - Cyber City / Golf Course Road',
    'Gurgaon - Sohna Road & Extension',
    'Noida - Sector 18 & Central Noida',
    'Noida - Sector 62 & Indirapuram',
    'Noida - Sector 137 & Express Way',
    'Greater Noida',
    'South Delhi - Vasant Kunj & Saket',
    'South Delhi - Hauz Khas & South Ext',
    'West Delhi - Dwarka & Janakpuri',
    'North Delhi - Rohini & Pitampura',
    'Central Delhi - CP & Karol Bagh',
    'East Delhi - Mayur Vihar & Laxmi Nagar',
    'Faridabad',
    'Ghaziabad - Vaishali & Vasundhara',
    'Other (please specify)'
  ],
  'Ahmedabad': [
    'SG Highway',
    'Satellite',
    'Bodakdev',
    'Prahlad Nagar',
    'Vastrapur',
    'Navrangpura',
    'Paldi',
    'Bopal',
    'Thaltej',
    'Maninagar',
    'Chandkheda',
    'Science City',
    'Gota',
    'Motera',
    'Ambawadi',
    'Other (please specify)'
  ],
  'Pune': [
    'Kothrud',
    'Baner',
    'Viman Nagar',
    'Koregaon Park',
    'Aundh',
    'Hinjewadi',
    'Wakad',
    'Pimple Saudagar',
    'Kalyani Nagar',
    'Hadapsar',
    'Magarpatta',
    'Kharadi',
    'Bavdhan',
    'Pashan',
    'Shivajinagar',
    'Other (please specify)'
  ]
};

// ─── NEARBY LOCALITY GROUPS ────────────────────────────────────────────
// Localities within the same group are considered "nearby" to each other
// for location-based shadow teacher matching alerts.

export const NEARBY_LOCALITY_GROUPS: Record<string, string[][]> = {
  'Mumbai': [
    ['Andheri', 'Juhu', 'Santacruz', 'Bandra', 'Goregaon', 'Malad', 'Kandivali', 'Borivali'], // Western suburbs
    ['Dadar', 'Ghatkopar', 'Chembur', 'Vikhroli', 'Mulund', 'Powai'],                         // Central / Eastern
    ['Worli', 'Dadar'],                                                                      // South
    ['Thane', 'Navi Mumbai', 'Vashi', 'Kharghar'],                                           // Thane & Navi Mumbai
  ],
  'Hyderabad': [
    ['Gachibowli', 'Kondapur', 'Madhapur', 'Hitec City', 'Manikonda'],       // West Hyd tech corridor
    ['Miyapur', 'Kukatpally', 'Bachupally'],                                  // Northwest Hyd
    ['Jubilee Hills', 'Banjara Hills', 'Ameerpet', 'Begumpet'],               // Central Hyd
    ['Nallakunta', 'Himayatnagar', 'Secunderabad'],                            // East-central Hyd
    ['Uppal', 'LB Nagar'],                                                     // Southeast Hyd
  ],
  'Bangalore': [
    ['Indiranagar', 'Koramangala', 'HSR Layout', 'BTM Layout'],               // East-South Blr
    ['Whitefield', 'Marathahalli', 'Bellandur', 'Sarjapur Road'],             // East Blr / ORR
    ['Jayanagar', 'JP Nagar', 'Banashankari'],                                 // South Blr
    ['Rajajinagar', 'Malleshwaram', 'Hebbal', 'Yelahanka'],                   // North-West Blr
    ['Electronic City'],                                                        // South peripheral
  ],
  'Delhi NCR': [
    ['Gurgaon - DLF Phase 1-5', 'Gurgaon - Cyber City / Golf Course Road', 'Gurgaon - Sohna Road & Extension'],
    ['Noida - Sector 18 & Central Noida', 'Noida - Sector 62 & Indirapuram', 'Noida - Sector 137 & Express Way', 'Greater Noida'],
    ['South Delhi - Vasant Kunj & Saket', 'South Delhi - Hauz Khas & South Ext'],
    ['West Delhi - Dwarka & Janakpuri', 'North Delhi - Rohini & Pitampura'],
    ['Central Delhi - CP & Karol Bagh', 'East Delhi - Mayur Vihar & Laxmi Nagar'],
    ['Faridabad'],
    ['Ghaziabad - Vaishali & Vasundhara'],
  ],
  'Ahmedabad': [
    ['SG Highway', 'Satellite', 'Bodakdev', 'Prahlad Nagar', 'Vastrapur', 'Thaltej'],
    ['Bopal', 'Ambawadi', 'Navrangpura', 'Paldi'],
    ['Chandkheda', 'Gota', 'Motera'],
    ['Science City', 'Maninagar'],
  ],
  'Pune': [
    ['Baner', 'Aundh', 'Pashan', 'Bavdhan'],
    ['Hinjewadi', 'Wakad', 'Pimple Saudagar'],
    ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Kharadi'],
    ['Hadapsar', 'Magarpatta'],
    ['Kothrud', 'Shivajinagar'],
  ],
};

// ─── SERVICE AVAILABILITY PER CITY ──────────────────────────────────────
export interface CityServiceAvailability {
  shadowTeacher: boolean;
  homeTutor: boolean;
  schoolCollaboration: boolean;
  inPersonTherapy: boolean;
  onlineTherapy: boolean; // PAN India
  onlineParentTraining: boolean; // PAN India
}

export const CITY_SERVICE_AVAILABILITY: Record<ServedCity, CityServiceAvailability> = {
  'Delhi NCR': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: true,
    onlineTherapy: true,
    onlineParentTraining: true,
  },
  'Mumbai': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: false, // Delhi NCR only
    onlineTherapy: true,
    onlineParentTraining: true,
  },
  'Ahmedabad': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: false,
    onlineTherapy: true,
    onlineParentTraining: true,
  },
  'Hyderabad': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: false,
    onlineTherapy: true,
    onlineParentTraining: true,
  },
  'Bangalore': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: false,
    onlineTherapy: true,
    onlineParentTraining: true,
  },
  'Pune': {
    shadowTeacher: true,
    homeTutor: true,
    schoolCollaboration: true,
    inPersonTherapy: false,
    onlineTherapy: true,
    onlineParentTraining: true,
  },
};

export function isServiceAvailableInCity(
  service: 'shadowTeacher' | 'homeTutor' | 'schoolCollaboration' | 'inPersonTherapy' | 'onlineTherapy' | 'onlineParentTraining',
  city: string
): boolean {
  const config = CITY_SERVICE_AVAILABILITY[city as ServedCity];
  if (!config) return false;
  return !!config[service];
}

// ─── HOMEPAGE CITY CARDS CONFIG ─────────────────────────────────────────
export interface CityCardData {
  name: ServedCity;
  skyline: string;
  desc: string;
  color: string;
}

export const HOMEPAGE_CITIES: CityCardData[] = [
  {
    name: "Delhi NCR",
    skyline: "🕌🏛️🏙️",
    desc: "Trusted Support for Your Child's Growth in Delhi NCR.",
    color: "from-secondary/10 to-secondary/30"
  },
  {
    name: "Mumbai",
    skyline: "🌊🏙️🏛️",
    desc: "Trusted Support for Your Child's Growth in Mumbai.",
    color: "from-secondary/10 to-secondary/30"
  },
  {
    name: "Ahmedabad",
    skyline: "🏛️🕌🏢",
    desc: "Trusted Support for Your Child's Growth in Ahmedabad.",
    color: "from-accent/10 to-accent/30"
  },
  {
    name: "Hyderabad",
    skyline: "🏰🏢🏬",
    desc: "Experienced & Verified Shadow Teachers in Hyderabad.",
    color: "from-secondary/10 to-secondary/30"
  },
  {
    name: "Bangalore",
    skyline: "🌳🏢🏫",
    desc: "Experienced & Verified Shadow Teachers and Tutors in Bangalore.",
    color: "from-accent/10 to-accent/30"
  },
  {
    name: "Pune",
    skyline: "🏰🏢🌳",
    desc: "Trusted Support for Your Child's Growth in Pune.",
    color: "from-secondary/10 to-secondary/30"
  }
];

/**
 * Find all localities in the same nearby group as the given locality.
 * Returns an array of nearby locality names (excluding the input itself),
 * or an empty array if the locality isn't in any defined group.
 */
export function findNearbyLocalities(city: string, locality: string): string[] {
  const groups = NEARBY_LOCALITY_GROUPS[city];
  if (!groups || !locality) return [];

  const normalised = locality.toLowerCase().trim();

  for (const group of groups) {
    const matchIndex = group.findIndex(loc => normalised.includes(loc.toLowerCase()) || loc.toLowerCase().includes(normalised));
    if (matchIndex !== -1) {
      return group.filter((_, i) => i !== matchIndex);
    }
  }

  return [];
}

/**
 * Check whether two localities are in the same nearby group for a given city.
 */
export function areNearbyLocalities(city: string, localityA: string, localityB: string): boolean {
  const groups = NEARBY_LOCALITY_GROUPS[city];
  if (!groups || !localityA || !localityB) return false;

  const normA = localityA.toLowerCase().trim();
  const normB = localityB.toLowerCase().trim();

  for (const group of groups) {
    const normGroup = group.map(loc => loc.toLowerCase());
    const matchA = normGroup.some(g => normA.includes(g) || g.includes(normA));
    const matchB = normGroup.some(g => normB.includes(g) || g.includes(normB));
    if (matchA && matchB) return true;
  }

  return false;
}
