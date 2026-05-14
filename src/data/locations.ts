export interface City {
  name: string;
  state: string;
  lat: number;
}

export const CITIES: City[] = [
  // Northeast
  { name: 'Boston',       state: 'MA', lat: 42.4 },
  { name: 'New York',     state: 'NY', lat: 40.7 },
  { name: 'Philadelphia', state: 'PA', lat: 40.0 },
  { name: 'Pittsburgh',   state: 'PA', lat: 40.4 },
  { name: 'Buffalo',      state: 'NY', lat: 42.9 },
  // Southeast
  { name: 'Miami',        state: 'FL', lat: 25.8 },
  { name: 'Orlando',      state: 'FL', lat: 28.5 },
  { name: 'Atlanta',      state: 'GA', lat: 33.7 },
  { name: 'Charlotte',    state: 'NC', lat: 35.2 },
  { name: 'Nashville',    state: 'TN', lat: 36.2 },
  { name: 'Memphis',      state: 'TN', lat: 35.1 },
  // Midwest
  { name: 'Chicago',      state: 'IL', lat: 41.9 },
  { name: 'Detroit',      state: 'MI', lat: 42.3 },
  { name: 'Minneapolis',  state: 'MN', lat: 44.9 },
  { name: 'Columbus',     state: 'OH', lat: 40.0 },
  { name: 'Kansas City',  state: 'MO', lat: 39.1 },
  { name: 'St. Louis',    state: 'MO', lat: 38.6 },
  // South
  { name: 'Dallas',       state: 'TX', lat: 32.8 },
  { name: 'Houston',      state: 'TX', lat: 29.8 },
  { name: 'San Antonio',  state: 'TX', lat: 29.4 },
  { name: 'New Orleans',  state: 'LA', lat: 30.0 },
  { name: 'Oklahoma City',state: 'OK', lat: 35.5 },
  // Mountain / West
  { name: 'Denver',       state: 'CO', lat: 39.7 },
  { name: 'Salt Lake City',state:'UT', lat: 40.8 },
  { name: 'Phoenix',      state: 'AZ', lat: 33.4 },
  { name: 'Tucson',       state: 'AZ', lat: 32.2 },
  { name: 'Las Vegas',    state: 'NV', lat: 36.2 },
  { name: 'Albuquerque',  state: 'NM', lat: 35.1 },
  // Pacific Northwest
  { name: 'Seattle',      state: 'WA', lat: 47.6 },
  { name: 'Portland',     state: 'OR', lat: 45.5 },
  { name: 'Spokane',      state: 'WA', lat: 47.7 },
  // California
  { name: 'Los Angeles',  state: 'CA', lat: 34.1 },
  { name: 'San Francisco',state: 'CA', lat: 37.8 },
  { name: 'Sacramento',   state: 'CA', lat: 38.6 },
  { name: 'San Diego',    state: 'CA', lat: 32.7 },
  // Alaska / Hawaii
  { name: 'Anchorage',    state: 'AK', lat: 61.2 },
  { name: 'Honolulu',     state: 'HI', lat: 21.3 },
];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
