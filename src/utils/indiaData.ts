
export interface District {
  name: string;
  lat: number;
  lng: number;
}

export interface State {
  name: string;
  districts: District[];
  lat: number;
  lng: number;
}

// Expanded list of cities/districts for Indian states
export const indiaStates: State[] = [
  {
    name: "Delhi",
    lat: 28.7041,
    lng: 77.1025,
    districts: [
      { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
      { name: "North Delhi", lat: 28.7041, lng: 77.1025 },
      { name: "South Delhi", lat: 28.5244, lng: 77.1855 },
      { name: "East Delhi", lat: 28.6279, lng: 77.2895 },
      { name: "West Delhi", lat: 28.6663, lng: 77.0386 },
      { name: "Central Delhi", lat: 28.6508, lng: 77.2373 },
      { name: "Shahdara", lat: 28.6848, lng: 77.2855 },
      { name: "Dwarka", lat: 28.5921, lng: 77.0460 },
      { name: "Rohini", lat: 28.7410, lng: 77.1177 },
      { name: "Karol Bagh", lat: 28.6514, lng: 77.1907 }
    ]
  },
  {
    name: "Maharashtra",
    lat: 19.7515,
    lng: 75.7139,
    districts: [
      { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
      { name: "Pune", lat: 18.5204, lng: 73.8567 },
      { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
      { name: "Nashik", lat: 20.0059, lng: 73.7912 },
      { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
      { name: "Solapur", lat: 17.6599, lng: 75.9064 },
      { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
      { name: "Thane", lat: 19.2183, lng: 72.9781 },
      { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297 },
      { name: "Amravati", lat: 20.9320, lng: 77.7523 }
    ]
  },
  {
    name: "Tamil Nadu",
    lat: 11.1271,
    lng: 78.6569,
    districts: [
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
      { name: "Madurai", lat: 9.9252, lng: 78.1198 },
      { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
      { name: "Salem", lat: 11.6643, lng: 78.1460 },
      { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
      { name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
      { name: "Vellore", lat: 12.9165, lng: 79.1325 },
      { name: "Erode", lat: 11.3410, lng: 77.7172 },
      { name: "Thoothukudi", lat: 8.7642, lng: 78.1348 }
    ]
  },
  {
    name: "Karnataka",
    lat: 15.3173,
    lng: 75.7139,
    districts: [
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
      { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
      { name: "Hubballi-Dharwad", lat: 15.3647, lng: 75.1240 },
      { name: "Mangaluru", lat: 12.9141, lng: 74.8560 },
      { name: "Belagavi", lat: 15.8497, lng: 74.4977 },
      { name: "Kalaburagi", lat: 17.3297, lng: 76.8343 },
      { name: "Davanagere", lat: 14.4644, lng: 75.9218 },
      { name: "Ballari", lat: 15.1394, lng: 76.9214 },
      { name: "Vijayapura", lat: 16.8302, lng: 75.7100 },
      { name: "Shivamogga", lat: 13.9299, lng: 75.5681 }
    ]
  },
  {
    name: "Gujarat",
    lat: 22.2587,
    lng: 71.1924,
    districts: [
      { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
      { name: "Surat", lat: 21.1702, lng: 72.8311 },
      { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
      { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
      { name: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
      { name: "Jamnagar", lat: 22.4707, lng: 70.0577 },
      { name: "Junagadh", lat: 21.5222, lng: 70.4579 },
      { name: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
      { name: "Anand", lat: 22.5569, lng: 72.9627 },
      { name: "Navsari", lat: 20.9467, lng: 72.9520 }
    ]
  },
  {
    name: "West Bengal",
    lat: 22.9868,
    lng: 87.8550,
    districts: [
      { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
      { name: "Howrah", lat: 22.5958, lng: 88.2636 },
      { name: "Durgapur", lat: 23.5204, lng: 87.3119 },
      { name: "Asansol", lat: 23.6739, lng: 86.9524 },
      { name: "Siliguri", lat: 26.7271, lng: 88.3953 },
      { name: "Burdwan", lat: 23.2324, lng: 87.8614 },
      { name: "Malda", lat: 25.0220, lng: 88.1425 },
      { name: "Kharagpur", lat: 22.3303, lng: 87.3236 },
      { name: "Darjeeling", lat: 27.0411, lng: 88.2659 },
      { name: "Jalpaiguri", lat: 26.5195, lng: 88.7273 }
    ]
  },
  {
    name: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    districts: [
      { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
      { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
      { name: "Agra", lat: 27.1767, lng: 78.0081 },
      { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
      { name: "Prayagraj", lat: 25.4358, lng: 81.8463 },
      { name: "Meerut", lat: 28.9845, lng: 77.7064 },
      { name: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
      { name: "Noida", lat: 28.5355, lng: 77.3910 },
      { name: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
      { name: "Bareilly", lat: 28.3670, lng: 79.4304 }
    ]
  },
  {
    name: "Rajasthan",
    lat: 27.0238,
    lng: 74.2179,
    districts: [
      { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
      { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
      { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
      { name: "Kota", lat: 25.2138, lng: 75.8648 },
      { name: "Ajmer", lat: 26.4499, lng: 74.6399 },
      { name: "Bikaner", lat: 28.0229, lng: 73.3119 },
      { name: "Alwar", lat: 27.5529, lng: 76.6346 },
      { name: "Bharatpur", lat: 27.2155, lng: 77.4938 },
      { name: "Bhilwara", lat: 25.3407, lng: 74.6313 },
      { name: "Sikar", lat: 27.6094, lng: 75.1398 }
    ]
  },
  {
    name: "Andhra Pradesh",
    lat: 15.9129,
    lng: 79.7400,
    districts: [
      { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
      { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
      { name: "Guntur", lat: 16.3067, lng: 80.4365 },
      { name: "Nellore", lat: 14.4426, lng: 79.9865 },
      { name: "Kurnool", lat: 15.8281, lng: 78.0373 },
      { name: "Rajahmundry", lat: 16.9853, lng: 81.7838 },
      { name: "Kakinada", lat: 16.9332, lng: 82.2380 },
      { name: "Tirupati", lat: 13.6288, lng: 79.4192 },
      { name: "Anantapur", lat: 14.6819, lng: 77.6006 },
      { name: "Eluru", lat: 16.7107, lng: 81.0952 }
    ]
  },
  {
    name: "Telangana",
    lat: 18.1124,
    lng: 79.0193,
    districts: [
      { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
      { name: "Warangal", lat: 17.9689, lng: 79.5941 },
      { name: "Nizamabad", lat: 18.6725, lng: 78.0940 },
      { name: "Karimnagar", lat: 18.4392, lng: 79.1292 },
      { name: "Khammam", lat: 17.2473, lng: 80.1514 },
      { name: "Secunderabad", lat: 17.4399, lng: 78.4983 },
      { name: "Mahbubnagar", lat: 16.7417, lng: 78.0042 },
      { name: "Nalgonda", lat: 17.0575, lng: 79.2684 },
      { name: "Adilabad", lat: 19.6640, lng: 78.5320 },
      { name: "Siddipet", lat: 18.1051, lng: 78.8526 }
    ]
  },
  {
    name: "Bihar",
    lat: 25.0961,
    lng: 85.3131,
    districts: [
      { name: "Patna", lat: 25.5941, lng: 85.1376 },
      { name: "Gaya", lat: 24.7914, lng: 84.9994 },
      { name: "Muzaffarpur", lat: 26.1209, lng: 85.3647 },
      { name: "Bhagalpur", lat: 25.2425, lng: 87.0076 },
      { name: "Darbhanga", lat: 26.1542, lng: 85.8918 },
      { name: "Purnia", lat: 25.7771, lng: 87.4753 },
      { name: "Arrah", lat: 25.5564, lng: 84.6603 },
      { name: "Katihar", lat: 25.5392, lng: 87.5719 },
      { name: "Munger", lat: 25.3762, lng: 86.4737 },
      { name: "Chapra", lat: 25.7814, lng: 84.7280 }
    ]
  },
  {
    name: "Madhya Pradesh",
    lat: 22.9734,
    lng: 78.6569,
    districts: [
      { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
      { name: "Indore", lat: 22.7196, lng: 75.8577 },
      { name: "Jabalpur", lat: 23.1815, lng: 79.9864 },
      { name: "Gwalior", lat: 26.2183, lng: 78.1828 },
      { name: "Ujjain", lat: 23.1765, lng: 75.7885 },
      { name: "Sagar", lat: 23.8388, lng: 78.7378 },
      { name: "Dewas", lat: 22.9675, lng: 76.0534 },
      { name: "Ratlam", lat: 23.3315, lng: 75.0367 },
      { name: "Satna", lat: 24.6005, lng: 80.8322 },
      { name: "Rewa", lat: 24.5362, lng: 81.3037 }
    ]
  },
  {
    name: "Punjab",
    lat: 31.1471,
    lng: 75.3412,
    districts: [
      { name: "Ludhiana", lat: 30.9010, lng: 75.8573 },
      { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
      { name: "Jalandhar", lat: 31.3260, lng: 75.5762 },
      { name: "Patiala", lat: 30.3398, lng: 76.3869 },
      { name: "Bathinda", lat: 30.2110, lng: 74.9455 },
      { name: "Mohali", lat: 30.7046, lng: 76.7179 },
      { name: "Pathankot", lat: 32.2710, lng: 75.6526 },
      { name: "Hoshiarpur", lat: 31.5273, lng: 75.9115 },
      { name: "Moga", lat: 30.8163, lng: 75.1717 },
      { name: "Firozpur", lat: 30.9250, lng: 74.6188 }
    ]
  },
  {
    name: "Haryana",
    lat: 29.0588,
    lng: 76.0856,
    districts: [
      { name: "Gurugram", lat: 28.4595, lng: 77.0266 },
      { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
      { name: "Hisar", lat: 29.1492, lng: 75.7217 },
      { name: "Panipat", lat: 29.3909, lng: 76.9635 },
      { name: "Ambala", lat: 30.3752, lng: 76.7821 },
      { name: "Karnal", lat: 29.6857, lng: 76.9905 },
      { name: "Rohtak", lat: 28.8955, lng: 76.6066 },
      { name: "Sonipat", lat: 29.0000, lng: 77.0167 },
      { name: "Panchkula", lat: 30.6942, lng: 76.8606 },
      { name: "Yamunanagar", lat: 30.1290, lng: 77.2674 }
    ]
  }
];

export const getAllDistricts = (): District[] => {
  return indiaStates.flatMap(state => 
    state.districts.map(district => ({
      ...district,
      name: `${district.name}, ${state.name}`
    }))
  );
};

export const getStateByName = (name: string): State | undefined => {
  return indiaStates.find(state => state.name === name);
};

export const getDistrictByName = (name: string): District | undefined => {
  const allDistricts = getAllDistricts();
  return allDistricts.find(district => district.name === name);
};

// Get a district by state name and district name
export const getDistrictByStateAndName = (stateName: string, districtName: string): District | undefined => {
  const state = getStateByName(stateName);
  if (!state) return undefined;
  
  return state.districts.find(district => district.name === districtName);
};

// Get all states names
export const getAllStateNames = (): string[] => {
  return indiaStates.map(state => state.name);
};

// Get state center location
export const getStateCenter = (stateName: string): Location | undefined => {
  const state = getStateByName(stateName);
  if (!state) return undefined;
  
  return {
    lat: state.lat,
    lng: state.lng,
    name: state.name
  };
};

// Type import for the function above
import { Location } from '@/types';
