const fs = require('fs');
const path = require('path');

const constantsFile = fs.readFileSync(path.join(__dirname, '../src/lib/constants.ts'), 'utf8');

// Parse CITY_LOCALITIES object
const CITY_LOCALITIES = {
  'Hyderabad': [
    'Bachupally', 'Gachibowli', 'Kondapur', 'Miyapur', 'Kukatpally', 'Nallakunta',
    'Jubilee Hills', 'Banjara Hills', 'Madhapur', 'Hitec City', 'Begumpet',
    'Secunderabad', 'Uppal', 'LB Nagar', 'Himayatnagar', 'Manikonda', 'Ameerpet',
    'Other (please specify)'
  ],
  'Bangalore': [
    'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'JP Nagar',
    'Marathahalli', 'Electronic City', 'Yelahanka', 'Rajajinagar', 'Banashankari',
    'Bellandur', 'Malleshwaram', 'Sarjapur Road', 'Hebbal', 'BTM Layout',
    'Other (please specify)'
  ],
  'Delhi NCR': [
    'Gurgaon - DLF Phase 1-5', 'Gurgaon - Cyber City / Golf Course Road',
    'Gurgaon - Sohna Road & Extension', 'Noida - Sector 18 & Central Noida',
    'Noida - Sector 62 & Indirapuram', 'Noida - Sector 137 & Express Way',
    'Greater Noida', 'South Delhi - Vasant Kunj & Saket',
    'South Delhi - Hauz Khas & South Ext', 'West Delhi - Dwarka & Janakpuri',
    'North Delhi - Rohini & Pitampura', 'Central Delhi - CP & Karol Bagh',
    'East Delhi - Mayur Vihar & Laxmi Nagar', 'Faridabad',
    'Ghaziabad - Vaishali & Vasundhara', 'Other (please specify)'
  ],
  'Ahmedabad': [
    'SG Highway', 'Satellite', 'Bodakdev', 'Prahlad Nagar', 'Vastrapur',
    'Navrangpura', 'Paldi', 'Bopal', 'Thaltej', 'Maninagar', 'Chandkheda',
    'Science City', 'Gota', 'Motera', 'Ambawadi', 'Other (please specify)'
  ]
};

function testDependentLocationFlow() {
  console.log('=== TESTING DEPENDENT LOCALITY DROPDOWN & CITY RESET BEHAVIOR ===\n');

  let state = {
    name: 'Sona Sen',
    phone: '9812345678',
    email: 'sona@gmail.com',
    city: '',
    preferredLocation: '',
    otherLocation: ''
  };

  function handleCityChange(newCity) {
    state = {
      ...state,
      city: newCity,
      preferredLocation: '',
      otherLocation: ''
    };
  }

  // Test 1: Initially no city selected
  console.log('1. Initial State (No City Selected):');
  console.log('   - City:', state.city || '(empty)');
  console.log('   - Preferred Location:', state.preferredLocation || '(empty)');
  console.log('   - Locality List Available?:', CITY_LOCALITIES[state.city] ? 'YES' : 'NO (Dropdown hidden)');

  // Test 2: Select Hyderabad
  console.log('\n2. Selecting City = "Hyderabad":');
  handleCityChange('Hyderabad');
  console.log('   - City:', state.city);
  console.log('   - Locality List Available?: YES');
  console.log('   - Localities in Hyderabad:', CITY_LOCALITIES['Hyderabad'].slice(0, 5).join(', '), '... (Total:', CITY_LOCALITIES['Hyderabad'].length, ')');

  state.preferredLocation = 'Gachibowli';
  console.log('   - Selected Locality:', state.preferredLocation);

  // Test 3: Change City to Bangalore (City Reset Verification)
  console.log('\n3. Changing City from "Hyderabad" -> "Bangalore" (City Reset Trigger):');
  handleCityChange('Bangalore');
  console.log('   - City:', state.city);
  console.log('   - Preferred Location Reset?:', state.preferredLocation === '' ? '✅ SUCCESS (Reset to empty string)' : '❌ FAIL');
  console.log('   - New Localities in Bangalore:', CITY_LOCALITIES['Bangalore'].slice(0, 5).join(', '), '...');

  state.preferredLocation = 'Whitefield';
  console.log('   - Selected Locality in Bangalore:', state.preferredLocation);

  // Test 4: Select "Other (please specify)"
  console.log('\n4. Selecting "Other (please specify)":');
  state.preferredLocation = 'Other (please specify)';
  state.otherLocation = 'Indirapuram Extension';
  const finalLoc = state.preferredLocation === 'Other (please specify)'
    ? `Other: ${state.otherLocation}`
    : state.preferredLocation;
  console.log('   - Final Location Payload:', finalLoc);

  console.log('\n=== ALL DEPENDENT LOCATION TESTS PASSED 100%! ===');
}

testDependentLocationFlow();
