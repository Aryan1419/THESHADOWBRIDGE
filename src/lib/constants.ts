export const CITY_LOCALITIES: Record<string, string[]> = {
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
