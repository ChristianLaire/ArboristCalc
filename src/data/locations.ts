export interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCity(lat: number, lon: number): City {
  return CITIES.reduce((best, c) => {
    return haversineKm(lat, lon, c.lat, c.lon) < haversineKm(lat, lon, best.lat, best.lon) ? c : best;
  }, CITIES[0]);
}

export const CITIES: City[] = [
  // ── Alabama ──
  { name: 'Birmingham',     state: 'AL', lat: 33.52,  lon: -86.80  },
  { name: 'Huntsville',     state: 'AL', lat: 34.73,  lon: -86.59  },
  { name: 'Mobile',         state: 'AL', lat: 30.69,  lon: -88.04  },
  { name: 'Montgomery',     state: 'AL', lat: 32.38,  lon: -86.31  },
  { name: 'Tuscaloosa',     state: 'AL', lat: 33.21,  lon: -87.57  },
  // ── Alaska ──
  { name: 'Anchorage',      state: 'AK', lat: 61.22,  lon: -149.90 },
  { name: 'Fairbanks',      state: 'AK', lat: 64.84,  lon: -147.72 },
  { name: 'Juneau',         state: 'AK', lat: 58.30,  lon: -134.42 },
  { name: 'Sitka',          state: 'AK', lat: 57.05,  lon: -135.33 },
  // ── Arizona ──
  { name: 'Flagstaff',      state: 'AZ', lat: 35.20,  lon: -111.65 },
  { name: 'Mesa',           state: 'AZ', lat: 33.42,  lon: -111.83 },
  { name: 'Phoenix',        state: 'AZ', lat: 33.45,  lon: -112.07 },
  { name: 'Scottsdale',     state: 'AZ', lat: 33.49,  lon: -111.93 },
  { name: 'Sedona',         state: 'AZ', lat: 34.87,  lon: -111.76 },
  { name: 'Tucson',         state: 'AZ', lat: 32.22,  lon: -110.93 },
  { name: 'Yuma',           state: 'AZ', lat: 32.69,  lon: -114.63 },
  // ── Arkansas ──
  { name: 'Fayetteville',   state: 'AR', lat: 36.07,  lon: -94.16  },
  { name: 'Fort Smith',     state: 'AR', lat: 35.39,  lon: -94.42  },
  { name: 'Little Rock',    state: 'AR', lat: 34.75,  lon: -92.29  },
  // ── California ──
  { name: 'Bakersfield',    state: 'CA', lat: 35.37,  lon: -119.02 },
  { name: 'Eureka',         state: 'CA', lat: 40.80,  lon: -124.16 },
  { name: 'Fresno',         state: 'CA', lat: 36.74,  lon: -119.79 },
  { name: 'Los Angeles',    state: 'CA', lat: 34.05,  lon: -118.24 },
  { name: 'Monterey',       state: 'CA', lat: 36.60,  lon: -121.89 },
  { name: 'Palm Springs',   state: 'CA', lat: 33.83,  lon: -116.54 },
  { name: 'Redding',        state: 'CA', lat: 40.59,  lon: -122.39 },
  { name: 'Sacramento',     state: 'CA', lat: 38.58,  lon: -121.49 },
  { name: 'San Diego',      state: 'CA', lat: 32.72,  lon: -117.16 },
  { name: 'San Francisco',  state: 'CA', lat: 37.77,  lon: -122.42 },
  { name: 'San Jose',       state: 'CA', lat: 37.34,  lon: -121.89 },
  { name: 'Santa Barbara',  state: 'CA', lat: 34.42,  lon: -119.70 },
  { name: 'South Lake Tahoe',state:'CA', lat: 38.94,  lon: -119.98 },
  // ── Colorado ──
  { name: 'Boulder',        state: 'CO', lat: 40.01,  lon: -105.27 },
  { name: 'Colorado Springs',state:'CO', lat: 38.83,  lon: -104.82 },
  { name: 'Denver',         state: 'CO', lat: 39.74,  lon: -104.98 },
  { name: 'Fort Collins',   state: 'CO', lat: 40.59,  lon: -105.08 },
  { name: 'Grand Junction', state: 'CO', lat: 39.06,  lon: -108.55 },
  { name: 'Pueblo',         state: 'CO', lat: 38.25,  lon: -104.61 },
  { name: 'Steamboat Springs',state:'CO',lat: 40.48,  lon: -106.83 },
  // ── Connecticut ──
  { name: 'Bridgeport',     state: 'CT', lat: 41.18,  lon: -73.19  },
  { name: 'Hartford',       state: 'CT', lat: 41.76,  lon: -72.68  },
  { name: 'New Haven',      state: 'CT', lat: 41.30,  lon: -72.92  },
  { name: 'Waterbury',      state: 'CT', lat: 41.56,  lon: -73.04  },
  // ── Delaware ──
  { name: 'Dover',          state: 'DE', lat: 39.16,  lon: -75.52  },
  { name: 'Wilmington',     state: 'DE', lat: 39.74,  lon: -75.55  },
  // ── Florida ──
  { name: 'Fort Lauderdale',state: 'FL', lat: 26.12,  lon: -80.14  },
  { name: 'Gainesville',    state: 'FL', lat: 29.65,  lon: -82.33  },
  { name: 'Jacksonville',   state: 'FL', lat: 30.33,  lon: -81.66  },
  { name: 'Key West',       state: 'FL', lat: 24.56,  lon: -81.78  },
  { name: 'Miami',          state: 'FL', lat: 25.77,  lon: -80.19  },
  { name: 'Naples',         state: 'FL', lat: 26.14,  lon: -81.79  },
  { name: 'Orlando',        state: 'FL', lat: 28.54,  lon: -81.38  },
  { name: 'Pensacola',      state: 'FL', lat: 30.42,  lon: -87.22  },
  { name: 'Tallahassee',    state: 'FL', lat: 30.44,  lon: -84.28  },
  { name: 'Tampa',          state: 'FL', lat: 27.95,  lon: -82.46  },
  // ── Georgia ──
  { name: 'Atlanta',        state: 'GA', lat: 33.75,  lon: -84.39  },
  { name: 'Augusta',        state: 'GA', lat: 33.47,  lon: -82.01  },
  { name: 'Columbus',       state: 'GA', lat: 32.46,  lon: -84.99  },
  { name: 'Macon',          state: 'GA', lat: 32.84,  lon: -83.62  },
  { name: 'Savannah',       state: 'GA', lat: 32.08,  lon: -81.09  },
  // ── Hawaii ──
  { name: 'Hilo',           state: 'HI', lat: 19.70,  lon: -155.09 },
  { name: 'Honolulu',       state: 'HI', lat: 21.31,  lon: -157.86 },
  { name: 'Kailua-Kona',    state: 'HI', lat: 19.64,  lon: -155.99 },
  // ── Idaho ──
  { name: 'Boise',          state: 'ID', lat: 43.62,  lon: -116.20 },
  { name: "Coeur d'Alene",  state: 'ID', lat: 47.68,  lon: -116.78 },
  { name: 'Idaho Falls',    state: 'ID', lat: 43.49,  lon: -112.03 },
  { name: 'Pocatello',      state: 'ID', lat: 42.87,  lon: -112.45 },
  { name: 'Twin Falls',     state: 'ID', lat: 42.56,  lon: -114.46 },
  // ── Illinois ──
  { name: 'Chicago',        state: 'IL', lat: 41.88,  lon: -87.63  },
  { name: 'Peoria',         state: 'IL', lat: 40.69,  lon: -89.59  },
  { name: 'Rockford',       state: 'IL', lat: 42.27,  lon: -89.09  },
  { name: 'Springfield',    state: 'IL', lat: 39.80,  lon: -89.65  },
  // ── Indiana ──
  { name: 'Evansville',     state: 'IN', lat: 37.97,  lon: -87.56  },
  { name: 'Fort Wayne',     state: 'IN', lat: 41.13,  lon: -85.13  },
  { name: 'Indianapolis',   state: 'IN', lat: 39.77,  lon: -86.16  },
  { name: 'South Bend',     state: 'IN', lat: 41.68,  lon: -86.25  },
  // ── Iowa ──
  { name: 'Cedar Rapids',   state: 'IA', lat: 42.01,  lon: -91.64  },
  { name: 'Davenport',      state: 'IA', lat: 41.52,  lon: -90.58  },
  { name: 'Des Moines',     state: 'IA', lat: 41.59,  lon: -93.62  },
  { name: 'Sioux City',     state: 'IA', lat: 42.50,  lon: -96.40  },
  // ── Kansas ──
  { name: 'Kansas City',    state: 'KS', lat: 39.11,  lon: -94.63  },
  { name: 'Salina',         state: 'KS', lat: 38.84,  lon: -97.61  },
  { name: 'Topeka',         state: 'KS', lat: 39.05,  lon: -95.68  },
  { name: 'Wichita',        state: 'KS', lat: 37.69,  lon: -97.34  },
  // ── Kentucky ──
  { name: 'Bowling Green',  state: 'KY', lat: 36.99,  lon: -86.44  },
  { name: 'Lexington',      state: 'KY', lat: 38.05,  lon: -84.50  },
  { name: 'Louisville',     state: 'KY', lat: 38.25,  lon: -85.76  },
  // ── Louisiana ──
  { name: 'Baton Rouge',    state: 'LA', lat: 30.44,  lon: -91.19  },
  { name: 'Lafayette',      state: 'LA', lat: 30.22,  lon: -92.02  },
  { name: 'New Orleans',    state: 'LA', lat: 29.95,  lon: -90.07  },
  { name: 'Shreveport',     state: 'LA', lat: 32.52,  lon: -93.75  },
  // ── Maine ──
  { name: 'Augusta',        state: 'ME', lat: 44.31,  lon: -69.78  },
  { name: 'Bangor',         state: 'ME', lat: 44.80,  lon: -68.78  },
  { name: 'Portland',       state: 'ME', lat: 43.66,  lon: -70.26  },
  // ── Maryland ──
  { name: 'Annapolis',      state: 'MD', lat: 38.98,  lon: -76.49  },
  { name: 'Baltimore',      state: 'MD', lat: 39.29,  lon: -76.61  },
  // ── Massachusetts ──
  { name: 'Boston',         state: 'MA', lat: 42.36,  lon: -71.06  },
  { name: 'Lowell',         state: 'MA', lat: 42.64,  lon: -71.31  },
  { name: 'Springfield',    state: 'MA', lat: 42.10,  lon: -72.59  },
  { name: 'Worcester',      state: 'MA', lat: 42.27,  lon: -71.80  },
  // ── Michigan ──
  { name: 'Ann Arbor',      state: 'MI', lat: 42.28,  lon: -83.74  },
  { name: 'Detroit',        state: 'MI', lat: 42.33,  lon: -83.05  },
  { name: 'Flint',          state: 'MI', lat: 43.01,  lon: -83.69  },
  { name: 'Grand Rapids',   state: 'MI', lat: 42.96,  lon: -85.67  },
  { name: 'Lansing',        state: 'MI', lat: 42.73,  lon: -84.56  },
  { name: 'Marquette',      state: 'MI', lat: 46.54,  lon: -87.40  },
  { name: 'Traverse City',  state: 'MI', lat: 44.76,  lon: -85.62  },
  // ── Minnesota ──
  { name: 'Duluth',         state: 'MN', lat: 46.79,  lon: -92.09  },
  { name: 'Minneapolis',    state: 'MN', lat: 44.98,  lon: -93.27  },
  { name: 'Rochester',      state: 'MN', lat: 44.02,  lon: -92.48  },
  { name: 'St. Cloud',      state: 'MN', lat: 45.56,  lon: -94.16  },
  // ── Mississippi ──
  { name: 'Biloxi',         state: 'MS', lat: 30.40,  lon: -88.88  },
  { name: 'Hattiesburg',    state: 'MS', lat: 31.33,  lon: -89.29  },
  { name: 'Jackson',        state: 'MS', lat: 32.30,  lon: -90.18  },
  { name: 'Tupelo',         state: 'MS', lat: 34.26,  lon: -88.70  },
  // ── Missouri ──
  { name: 'Columbia',       state: 'MO', lat: 38.95,  lon: -92.33  },
  { name: 'Kansas City',    state: 'MO', lat: 39.10,  lon: -94.58  },
  { name: 'Springfield',    state: 'MO', lat: 37.21,  lon: -93.29  },
  { name: 'St. Louis',      state: 'MO', lat: 38.63,  lon: -90.20  },
  // ── Montana ──
  { name: 'Billings',       state: 'MT', lat: 45.78,  lon: -108.50 },
  { name: 'Bozeman',        state: 'MT', lat: 45.68,  lon: -111.04 },
  { name: 'Great Falls',    state: 'MT', lat: 47.50,  lon: -111.30 },
  { name: 'Helena',         state: 'MT', lat: 46.60,  lon: -112.02 },
  { name: 'Missoula',       state: 'MT', lat: 46.87,  lon: -114.02 },
  // ── Nebraska ──
  { name: 'Grand Island',   state: 'NE', lat: 40.93,  lon: -98.34  },
  { name: 'Lincoln',        state: 'NE', lat: 40.81,  lon: -96.70  },
  { name: 'Omaha',          state: 'NE', lat: 41.26,  lon: -95.94  },
  // ── Nevada ──
  { name: 'Carson City',    state: 'NV', lat: 39.16,  lon: -119.77 },
  { name: 'Henderson',      state: 'NV', lat: 36.04,  lon: -114.98 },
  { name: 'Las Vegas',      state: 'NV', lat: 36.17,  lon: -115.14 },
  { name: 'Reno',           state: 'NV', lat: 39.53,  lon: -119.82 },
  // ── New Hampshire ──
  { name: 'Concord',        state: 'NH', lat: 43.21,  lon: -71.54  },
  { name: 'Manchester',     state: 'NH', lat: 43.00,  lon: -71.46  },
  { name: 'Nashua',         state: 'NH', lat: 42.77,  lon: -71.47  },
  // ── New Jersey ──
  { name: 'Atlantic City',  state: 'NJ', lat: 39.36,  lon: -74.42  },
  { name: 'Jersey City',    state: 'NJ', lat: 40.72,  lon: -74.07  },
  { name: 'Newark',         state: 'NJ', lat: 40.74,  lon: -74.18  },
  { name: 'Trenton',        state: 'NJ', lat: 40.22,  lon: -74.76  },
  // ── New Mexico ──
  { name: 'Albuquerque',    state: 'NM', lat: 35.08,  lon: -106.65 },
  { name: 'Las Cruces',     state: 'NM', lat: 32.31,  lon: -106.78 },
  { name: 'Roswell',        state: 'NM', lat: 33.39,  lon: -104.52 },
  { name: 'Santa Fe',       state: 'NM', lat: 35.69,  lon: -105.94 },
  // ── New York ──
  { name: 'Albany',         state: 'NY', lat: 42.65,  lon: -73.75  },
  { name: 'Buffalo',        state: 'NY', lat: 42.88,  lon: -78.88  },
  { name: 'New York',       state: 'NY', lat: 40.71,  lon: -74.01  },
  { name: 'Rochester',      state: 'NY', lat: 43.16,  lon: -77.61  },
  { name: 'Syracuse',       state: 'NY', lat: 43.05,  lon: -76.14  },
  // ── North Carolina ──
  { name: 'Asheville',      state: 'NC', lat: 35.57,  lon: -82.55  },
  { name: 'Charlotte',      state: 'NC', lat: 35.22,  lon: -80.84  },
  { name: 'Durham',         state: 'NC', lat: 35.99,  lon: -78.90  },
  { name: 'Greensboro',     state: 'NC', lat: 36.07,  lon: -79.79  },
  { name: 'Raleigh',        state: 'NC', lat: 35.78,  lon: -78.64  },
  { name: 'Wilmington',     state: 'NC', lat: 34.23,  lon: -77.95  },
  // ── North Dakota ──
  { name: 'Bismarck',       state: 'ND', lat: 46.81,  lon: -100.78 },
  { name: 'Fargo',          state: 'ND', lat: 46.88,  lon: -96.79  },
  { name: 'Grand Forks',    state: 'ND', lat: 47.92,  lon: -97.03  },
  // ── Ohio ──
  { name: 'Akron',          state: 'OH', lat: 41.08,  lon: -81.52  },
  { name: 'Cincinnati',     state: 'OH', lat: 39.10,  lon: -84.51  },
  { name: 'Cleveland',      state: 'OH', lat: 41.50,  lon: -81.69  },
  { name: 'Columbus',       state: 'OH', lat: 39.96,  lon: -82.99  },
  { name: 'Dayton',         state: 'OH', lat: 39.76,  lon: -84.19  },
  { name: 'Toledo',         state: 'OH', lat: 41.66,  lon: -83.56  },
  // ── Oklahoma ──
  { name: 'Norman',         state: 'OK', lat: 35.22,  lon: -97.44  },
  { name: 'Oklahoma City',  state: 'OK', lat: 35.47,  lon: -97.52  },
  { name: 'Tulsa',          state: 'OK', lat: 36.15,  lon: -95.99  },
  // ── Oregon ──
  { name: 'Bend',           state: 'OR', lat: 44.06,  lon: -121.31 },
  { name: 'Eugene',         state: 'OR', lat: 44.05,  lon: -123.09 },
  { name: 'Medford',        state: 'OR', lat: 42.33,  lon: -122.87 },
  { name: 'Portland',       state: 'OR', lat: 45.52,  lon: -122.68 },
  { name: 'Salem',          state: 'OR', lat: 44.94,  lon: -123.03 },
  // ── Pennsylvania ──
  { name: 'Allentown',      state: 'PA', lat: 40.60,  lon: -75.49  },
  { name: 'Erie',           state: 'PA', lat: 42.13,  lon: -80.09  },
  { name: 'Harrisburg',     state: 'PA', lat: 40.27,  lon: -76.89  },
  { name: 'Philadelphia',   state: 'PA', lat: 39.95,  lon: -75.17  },
  { name: 'Pittsburgh',     state: 'PA', lat: 40.44,  lon: -79.99  },
  // ── Rhode Island ──
  { name: 'Providence',     state: 'RI', lat: 41.82,  lon: -71.42  },
  // ── South Carolina ──
  { name: 'Charleston',     state: 'SC', lat: 32.78,  lon: -79.94  },
  { name: 'Columbia',       state: 'SC', lat: 34.00,  lon: -81.03  },
  { name: 'Greenville',     state: 'SC', lat: 34.85,  lon: -82.40  },
  { name: 'Myrtle Beach',   state: 'SC', lat: 33.69,  lon: -78.89  },
  // ── South Dakota ──
  { name: 'Aberdeen',       state: 'SD', lat: 45.46,  lon: -98.48  },
  { name: 'Rapid City',     state: 'SD', lat: 44.08,  lon: -103.23 },
  { name: 'Sioux Falls',    state: 'SD', lat: 43.54,  lon: -96.73  },
  // ── Tennessee ──
  { name: 'Chattanooga',    state: 'TN', lat: 35.05,  lon: -85.31  },
  { name: 'Jackson',        state: 'TN', lat: 35.61,  lon: -88.81  },
  { name: 'Knoxville',      state: 'TN', lat: 35.96,  lon: -83.92  },
  { name: 'Memphis',        state: 'TN', lat: 35.15,  lon: -90.05  },
  { name: 'Nashville',      state: 'TN', lat: 36.17,  lon: -86.78  },
  // ── Texas ──
  { name: 'Abilene',        state: 'TX', lat: 32.45,  lon: -99.73  },
  { name: 'Amarillo',       state: 'TX', lat: 35.22,  lon: -101.83 },
  { name: 'Austin',         state: 'TX', lat: 30.27,  lon: -97.74  },
  { name: 'Corpus Christi', state: 'TX', lat: 27.80,  lon: -97.40  },
  { name: 'Dallas',         state: 'TX', lat: 32.78,  lon: -96.80  },
  { name: 'El Paso',        state: 'TX', lat: 31.76,  lon: -106.49 },
  { name: 'Fort Worth',     state: 'TX', lat: 32.73,  lon: -97.29  },
  { name: 'Houston',        state: 'TX', lat: 29.76,  lon: -95.37  },
  { name: 'Lubbock',        state: 'TX', lat: 33.58,  lon: -101.85 },
  { name: 'San Antonio',    state: 'TX', lat: 29.42,  lon: -98.49  },
  { name: 'Waco',           state: 'TX', lat: 31.55,  lon: -97.15  },
  // ── Utah ──
  { name: 'Moab',           state: 'UT', lat: 38.57,  lon: -109.55 },
  { name: 'Ogden',          state: 'UT', lat: 41.22,  lon: -111.97 },
  { name: 'Provo',          state: 'UT', lat: 40.23,  lon: -111.66 },
  { name: 'Salt Lake City', state: 'UT', lat: 40.76,  lon: -111.89 },
  { name: 'St. George',     state: 'UT', lat: 37.10,  lon: -113.58 },
  // ── Vermont ──
  { name: 'Burlington',     state: 'VT', lat: 44.48,  lon: -73.21  },
  { name: 'Montpelier',     state: 'VT', lat: 44.27,  lon: -72.57  },
  // ── Virginia ──
  { name: 'Charlottesville',state: 'VA', lat: 38.03,  lon: -78.48  },
  { name: 'Norfolk',        state: 'VA', lat: 36.89,  lon: -76.26  },
  { name: 'Richmond',       state: 'VA', lat: 37.54,  lon: -77.43  },
  { name: 'Roanoke',        state: 'VA', lat: 37.27,  lon: -79.94  },
  { name: 'Virginia Beach', state: 'VA', lat: 36.85,  lon: -75.97  },
  // ── Washington ──
  { name: 'Bellingham',     state: 'WA', lat: 48.75,  lon: -122.48 },
  { name: 'Olympia',        state: 'WA', lat: 47.04,  lon: -122.90 },
  { name: 'Seattle',        state: 'WA', lat: 47.61,  lon: -122.33 },
  { name: 'Spokane',        state: 'WA', lat: 47.66,  lon: -117.43 },
  { name: 'Tacoma',         state: 'WA', lat: 47.25,  lon: -122.44 },
  { name: 'Yakima',         state: 'WA', lat: 46.60,  lon: -120.51 },
  // ── Washington D.C. ──
  { name: 'Washington',     state: 'DC', lat: 38.91,  lon: -77.04  },
  // ── West Virginia ──
  { name: 'Charleston',     state: 'WV', lat: 38.35,  lon: -81.63  },
  { name: 'Huntington',     state: 'WV', lat: 38.41,  lon: -82.44  },
  { name: 'Morgantown',     state: 'WV', lat: 39.63,  lon: -79.96  },
  // ── Wisconsin ──
  { name: 'Green Bay',      state: 'WI', lat: 44.52,  lon: -88.02  },
  { name: 'Madison',        state: 'WI', lat: 43.07,  lon: -89.40  },
  { name: 'Milwaukee',      state: 'WI', lat: 43.04,  lon: -87.91  },
  { name: 'Wausau',         state: 'WI', lat: 44.96,  lon: -89.63  },
  // ── Wyoming ──
  { name: 'Casper',         state: 'WY', lat: 42.87,  lon: -106.30 },
  { name: 'Cheyenne',       state: 'WY', lat: 41.13,  lon: -104.82 },
  { name: 'Jackson',        state: 'WY', lat: 43.48,  lon: -110.76 },
  { name: 'Laramie',        state: 'WY', lat: 41.31,  lon: -105.59 },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
