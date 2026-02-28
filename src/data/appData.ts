// ===== TYPES =====
export type Category = 'food' | 'sightseeing' | 'entertainment' | 'nightlife' | 'shopping' | 'sports' | 'photo';
export type PriceRange = 'free' | '$' | '$$' | '$$$' | '$$$$';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'any';
export type Status = 'upcoming' | 'done' | 'skipped';

export interface Place {
  id: string;
  name: string;
  category: Category;
  price: PriceRange;
  description: string;
  notes?: string;
  address: string;
  lat: number;
  lng: number;
  hours?: string;
  duration?: string;
  neighborhood: string;
  recommendedBy?: string;
  bestTimeSlot: TimeSlot;
}

export interface ItineraryItem {
  placeId: string;
  timeSlot: TimeSlot;
  time?: string;
  notes?: string;
}

export interface DayPlan {
  date: string;
  dayLabel: string;
  title: string;
  subtitle?: string;
  items: ItineraryItem[];
}

export interface Flight {
  passenger: string;
  direction: 'outbound' | 'return';
  legs: FlightLeg[];
}

export interface FlightLeg {
  flight: string;
  route: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  seat: string;
  aircraft: string;
  date: string;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  description: string;
  icon: string;
}

// ===== CATEGORY CONFIG =====
export const categoryConfig: Record<Category, { icon: string; label: string; color: string }> = {
  food: { icon: '🍕', label: 'Food & Drink', color: '#E8590C' },
  sightseeing: { icon: '🗽', label: 'Sightseeing', color: '#2B8A3E' },
  entertainment: { icon: '🎭', label: 'Entertainment', color: '#7048E8' },
  nightlife: { icon: '🌃', label: 'Nightlife', color: '#862E9C' },
  shopping: { icon: '🛍️', label: 'Shopping', color: '#D6336C' },
  sports: { icon: '🏟️', label: 'Sports', color: '#1971C2' },
  photo: { icon: '📸', label: 'Photo Spots', color: '#E67700' },
};

// ===== PLACES =====
export const places: Place[] = [
  // Sister 1 recommendations
  { id: 'elsewhere', name: 'Elsewhere', category: 'nightlife', price: '$$', description: 'Multi-level live music venue with rooftop and dance floors. One of Brooklyn\'s best nightlife spots.', address: '599 Johnson Ave, Brooklyn, NY 11237', lat: 40.7088, lng: -73.9220, hours: 'Thu-Sun, doors 8PM+', duration: '2-3 hours', neighborhood: 'Bushwick', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'chelsea-market', name: 'Chelsea Market', category: 'food', price: '$$', description: 'Iconic indoor food hall in a former Nabisco factory. Dozens of vendors — seafood, tacos, baked goods, everything.', address: '75 9th Ave, New York, NY 10011', lat: 40.7425, lng: -74.0061, hours: 'Mon-Sat 7AM-9PM, Sun 8AM-8PM', duration: '1-2 hours', neighborhood: 'Chelsea', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'la-caverna', name: 'La Caverna', category: 'nightlife', price: '$', description: 'Underground cave-themed bar and lounge. Dark, moody, great cocktails and live music.', address: '122 Rivington St, New York, NY 10002', lat: 40.7201, lng: -73.9886, hours: 'Daily 5PM-4AM', duration: '1-2 hours', neighborhood: 'Lower East Side', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'dumbo', name: 'DUMBO Waterfront', category: 'photo', price: 'free', description: 'Brooklyn waterfront neighborhood with iconic Manhattan Bridge views. Classic NYC photo spot — the cobblestone street with the bridge framed between brick buildings.', address: 'Washington St & Water St, Brooklyn, NY 11201', lat: 40.7033, lng: -73.9894, hours: 'Always open', duration: '45 min', neighborhood: 'DUMBO', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'rubirosa', name: 'Rubirosa', category: 'food', price: '$$$', description: 'Italian-American restaurant famous for its thin-crust tie-dye vodka pizza. Always packed — go early or expect a wait.', notes: 'Order the tie dye pizza!', address: '235 Mulberry St, New York, NY 10012', lat: 40.7230, lng: -73.9958, hours: 'Daily 11:30AM-11PM', duration: '1-1.5 hours', neighborhood: 'Nolita', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'ground-zero', name: '9/11 Memorial & Museum', category: 'sightseeing', price: '$$', description: 'Powerful memorial at the World Trade Center site. The reflecting pools sit in the footprints of the original towers. Museum requires tickets.', address: '180 Greenwich St, New York, NY 10007', lat: 40.7115, lng: -74.0134, hours: 'Memorial: daily 8AM-8PM. Museum: Wed-Mon 9AM-7PM', duration: '2-3 hours', neighborhood: 'Financial District', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'carrie-bradshaw', name: 'Carrie Bradshaw\'s Apartment', category: 'photo', price: 'free', description: 'The brownstone stoop from Sex and the City. Exterior only — it\'s a real person\'s home, be respectful.', address: '66 Perry St, New York, NY 10014', lat: 40.7352, lng: -74.0042, hours: 'Always (exterior)', duration: '10 min', neighborhood: 'West Village', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'tompkins-bagels', name: 'Tompkins Square Bagels', category: 'food', price: '$', description: 'Serious contender for NYC\'s best bagels. Hand-rolled, kettle-boiled, loaded with cream cheese. Go early to avoid the line.', address: '165 Avenue A, New York, NY 10009', lat: 40.7280, lng: -73.9815, hours: 'Daily 6:30AM-5PM', duration: '30 min', neighborhood: 'East Village', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'king-dumplings', name: 'King Dumplings', category: 'food', price: '$', description: 'Absurdly cheap, absurdly good pork dumplings. $3.50 for a bag of 8. Cash only. No frills, maximum flavor.', notes: '$3.50 dumplings!', address: '19 Allen St, New York, NY 10002', lat: 40.7157, lng: -73.9906, hours: 'Daily 9AM-9PM', duration: '20 min', neighborhood: 'Chinatown/LES', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'limosneros', name: 'Limosneros', category: 'food', price: '$$', description: 'Upscale Mexican with incredible moles and tacos. March 17 is Taco Tuesday — perfect timing with St. Patrick\'s Day!', notes: 'Taco Tuesday on March 17!', address: '45 W 29th St, New York, NY 10001', lat: 40.7459, lng: -73.9891, hours: 'Mon-Sat 5PM-11PM', duration: '1.5 hours', neighborhood: 'NoMad', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'shu-jiao', name: 'Shu Jiao Fu Zhou', category: 'food', price: '$', description: 'Tiny, authentic Fuzhou spot known for their peanut noodles and hand-pulled dumplings. Cash only, hole-in-the-wall vibes.', notes: 'Get the pinda (peanut) noodles!', address: '295 Grand St, New York, NY 10002', lat: 40.7181, lng: -73.9935, hours: 'Daily 8AM-8:30PM', duration: '30 min', neighborhood: 'Chinatown', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'central-park-cafe', name: 'Central Park Café (Le Pain Quotidien)', category: 'food', price: '$$', description: 'European-style café right inside Central Park. Great for a civilized coffee and pastry after walking the park.', address: 'Central Park, near 69th St entrance', lat: 40.7701, lng: -73.9719, hours: 'Daily 7AM-7PM', duration: '30-45 min', neighborhood: 'Upper West Side', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'wo-hop', name: 'Wo Hop', category: 'food', price: '$$', description: 'Legendary Chinatown restaurant in a basement, open since 1938. Classic Chinese-American fare at its finest.', notes: 'Crunchy honey chicken & eggplant garlic!', address: '17 Mott St, New York, NY 10013', lat: 40.7148, lng: -73.9997, hours: 'Daily 10:30AM-Late (often til 4AM)', duration: '1 hour', neighborhood: 'Chinatown', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'doyers-st', name: 'Doyers Street', category: 'photo', price: 'free', description: 'The famous "Bloody Angle" — a sharp bend on one of NYC\'s oldest streets. Rich with Chinatown history. Atmospheric and photogenic.', address: 'Doyers St, New York, NY 10013', lat: 40.7140, lng: -73.9982, hours: 'Always open', duration: '15 min', neighborhood: 'Chinatown', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'fiaschetteria', name: 'Fiaschetteria Pistoia', category: 'food', price: '$$$', description: 'Intimate Italian spot with outstanding handmade pasta. Their cacio e pepe is the star — simple, perfectly executed.', notes: 'Must-try cacio e pepe!', address: '114 Kenmare St, New York, NY 10012', lat: 40.7232, lng: -73.9969, hours: 'Tue-Sun 5:30PM-10:30PM, Closed Mon', duration: '1.5 hours', neighborhood: 'Nolita', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'comedy-cellar', name: 'Comedy Cellar', category: 'entertainment', price: '$$$', description: 'NYC\'s most famous comedy club. Legendary surprise drop-ins (Dave Chappelle, Amy Schumer, Chris Rock). Book in advance — sells out fast!', notes: 'Book tickets in advance!', address: '117 MacDougal St, New York, NY 10012', lat: 40.7303, lng: -74.0003, hours: 'Shows nightly, check schedule', duration: '1.5-2 hours', neighborhood: 'Greenwich Village', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'urban-jungle', name: 'Urban Jungle', category: 'shopping', price: '$', description: 'Massive vintage/thrift store in Bushwick. Great for unique finds — denim, leather jackets, retro sportswear.', address: '118 Knickerbocker Ave, Brooklyn, NY 11237', lat: 40.6986, lng: -73.9195, hours: 'Daily 11AM-8PM', duration: '1 hour', neighborhood: 'Bushwick', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'broadway-tkts', name: 'TKTS Booth (Broadway Tickets)', category: 'entertainment', price: '$$$', description: 'Same-day discount Broadway tickets (up to 50% off). The booth under the red stairs at Times Square. Go to the South Street Seaport location for shorter lines.', notes: 'Be there at 9:15 for best selection!', address: 'Father Duffy Square, Broadway & 47th St', lat: 40.7580, lng: -73.9855, hours: 'Mon-Sat 3PM-8PM, Wed/Sat 10AM-2PM, Sun 11AM-7PM', duration: '30-60 min wait', neighborhood: 'Midtown', recommendedBy: 'Sister 1', bestTimeSlot: 'afternoon' },
  { id: 'roosevelt-tramway', name: 'Roosevelt Island Tramway', category: 'sightseeing', price: 'free', description: 'Aerial tramway that glides over the East River between Manhattan and Roosevelt Island. Feels like a gondola ride through the skyline. Spectacular at sunset.', notes: 'Go at sunset! Free with MetroCard/OMNY', address: '59th St & 2nd Ave, New York, NY 10022', lat: 40.7613, lng: -73.9645, hours: 'Sun-Thu 6AM-2AM, Fri-Sat 6AM-3:30AM', duration: '30 min round trip', neighborhood: 'Upper East Side', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'angelina-bakery', name: 'Angelina Bakery', category: 'food', price: '$', description: 'Famous for their pistachio croissant — flaky, buttery, filled with real pistachio cream. The Times Square location is perfect for a sweet treat while sightseeing.', notes: 'Pistachio croissant!', address: '1564 Broadway, New York, NY 10036', lat: 40.7590, lng: -73.9845, hours: 'Daily 7AM-12AM', duration: '15 min', neighborhood: 'Times Square', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'waldorf-astoria', name: 'Waldorf Astoria (Gossip Girl)', category: 'photo', price: 'free', description: 'The iconic hotel that served as Blair Waldorf\'s home in Gossip Girl. Pop into the stunning lobby for photos.', address: '301 Park Ave, New York, NY 10022', lat: 40.7565, lng: -73.9733, hours: 'Under renovation — check if lobby accessible', duration: '15 min', neighborhood: 'Midtown East', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'lotte-palace', name: 'Lotte New York Palace', category: 'photo', price: 'free', description: 'Serena van der Woodsen\'s "home" from Gossip Girl. The grand Villard Houses courtyard is the famous backdrop.', address: '455 Madison Ave, New York, NY 10022', lat: 40.7580, lng: -73.9739, hours: 'Exterior always, lobby during hotel hours', duration: '15 min', neighborhood: 'Midtown East', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'little-island', name: 'Little Island', category: 'sightseeing', price: 'free', description: 'A futuristic floating park built on tulip-shaped pillars in the Hudson River. Stunning views, gardens, and performance spaces.', address: 'Pier 55, Hudson River Park, NY 10014', lat: 40.7421, lng: -74.0100, hours: 'Daily 6AM-midnight (Mar)', duration: '45 min', neighborhood: 'Meatpacking', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'central-park', name: 'Central Park', category: 'sightseeing', price: 'free', description: '843 acres of green in the heart of Manhattan. Don\'t try to see it all — focus on Bethesda Fountain, Bow Bridge, Strawberry Fields, and the Ramble.', address: 'Central Park, New York, NY', lat: 40.7829, lng: -73.9654, hours: 'Daily 6AM-1AM', duration: '2-3 hours', neighborhood: 'Central Park', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'times-square', name: 'Times Square', category: 'sightseeing', price: 'free', description: 'The crossroads of the world. Overwhelming, neon-drenched, touristy, and absolutely a must-see for first-timers. Best at night when the signs really pop.', address: 'Times Square, Manhattan, NY 10036', lat: 40.7580, lng: -73.9855, hours: 'Always', duration: '30-60 min', neighborhood: 'Midtown', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'joes-pizza', name: 'Joe\'s Pizza', category: 'food', price: '$', description: 'Classic NYC slice joint since 1975. Thin, crispy, perfectly charred. No-frills counter service — fold it and eat it on the sidewalk like a real New Yorker.', address: '7 Carmine St, New York, NY 10014', lat: 40.7306, lng: -74.0022, hours: 'Daily 10AM-4AM', duration: '15 min', neighborhood: 'Greenwich Village', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'the-met', name: 'The Metropolitan Museum of Art', category: 'sightseeing', price: '$$', description: 'One of the world\'s greatest art museums. You could spend days here, but 2-3 hours hitting the highlights is plenty. Don\'t miss the Egyptian Temple of Dendur and the rooftop.', address: '1000 5th Ave, New York, NY 10028', lat: 40.7794, lng: -73.9632, hours: 'Sun-Tue,Thu 10AM-5PM, Fri-Sat 10AM-9PM, Closed Wed', duration: '2-3 hours', neighborhood: 'Upper East Side', recommendedBy: 'Sister 1', bestTimeSlot: 'afternoon' },
  { id: 'grand-central', name: 'Grand Central Terminal', category: 'sightseeing', price: 'free', description: 'Stunning Beaux-Arts train station. Look up at the painted ceiling of constellations, find the whispering gallery, and soak in the grandeur.', address: '89 E 42nd St, New York, NY 10017', lat: 40.7527, lng: -73.9772, hours: 'Daily 5:15AM-2AM', duration: '30-45 min', neighborhood: 'Midtown', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  { id: 'brooklyn-bridge', name: 'Brooklyn Bridge Walk', category: 'sightseeing', price: 'free', description: 'Walk across one of the world\'s most iconic bridges. Start from the Manhattan side, end in Brooklyn/DUMBO for food and photos. About 1 mile, 30-40 min walk.', address: 'Brooklyn Bridge, New York, NY', lat: 40.7061, lng: -73.9969, hours: 'Always open', duration: '45 min', neighborhood: 'Lower Manhattan', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'mao-mao', name: 'Mao Mao', category: 'food', price: '$$', description: 'Popular Thai restaurant with bold flavors and great cocktails.', address: '145 Orchard St, New York, NY 10002', lat: 40.7194, lng: -73.9892, hours: 'Daily 11:30AM-11PM', duration: '1 hour', neighborhood: 'Lower East Side', recommendedBy: 'Sister 1', bestTimeSlot: 'evening' },
  { id: 'joe-juice', name: 'Joe & The Juice', category: 'food', price: '$', description: 'Danish chain beloved for their fresh juices, shakes, and sandwiches. The Tunacado (tuna + avocado) is a cult classic.', notes: 'Get the Tunacado!', address: 'Multiple locations across Manhattan', lat: 40.7425, lng: -73.9910, hours: 'Daily 7AM-9PM', duration: '20 min', neighborhood: 'Various', recommendedBy: 'Sister 1', bestTimeSlot: 'morning' },
  { id: 'friends-apt', name: 'Friends Apartment Building', category: 'photo', price: 'free', description: 'The exterior of the building used as Monica & Rachel\'s apartment in Friends. Just a quick photo op.', address: '90 Bedford St, New York, NY 10014', lat: 40.7323, lng: -74.0034, hours: 'Always (exterior)', duration: '10 min', neighborhood: 'West Village', recommendedBy: 'Sister 1', bestTimeSlot: 'any' },
  // Sister 2 recommendations
  { id: 'summit-one', name: 'Summit One Vanderbilt', category: 'sightseeing', price: '$$$', description: 'Immersive observation experience with mirrored rooms, glass floors, and open-air terraces 1,000+ feet above Manhattan. Absolutely go at sunset.', notes: 'Go at sunset! Glass floors are incredible.', address: '45 E 42nd St, New York, NY 10017', lat: 40.7531, lng: -73.9786, hours: 'Sun-Thu 9AM-10PM, Fri-Sat 9AM-11PM', duration: '1.5-2 hours', neighborhood: 'Midtown', recommendedBy: 'Sister 2', bestTimeSlot: 'evening' },
  { id: 'staten-island-ferry', name: 'Staten Island Ferry', category: 'sightseeing', price: 'free', description: 'Free 25-minute ferry ride with jaw-dropping views of the Statue of Liberty, Ellis Island, and the Manhattan skyline. NYC\'s best free attraction.', address: 'Whitehall Terminal, 4 Whitehall St, NY 10004', lat: 40.7013, lng: -74.0131, hours: 'Ferries every 15-30 min, 24/7', duration: '50 min round trip', neighborhood: 'Financial District', recommendedBy: 'Sister 2', bestTimeSlot: 'afternoon' },
  { id: 'high-line', name: 'The High Line', category: 'sightseeing', price: 'free', description: 'Elevated park built on an old rail line. 1.45 miles of gardens, art, and city views. Start at Gansevoort St and walk north to Hudson Yards.', notes: 'Saturday or Sunday morning, less crowded', address: 'Gansevoort St & Washington St, NY 10014', lat: 40.7390, lng: -74.0085, hours: 'Daily 7AM-10PM', duration: '1-1.5 hours', neighborhood: 'Chelsea/Meatpacking', recommendedBy: 'Sister 2', bestTimeSlot: 'morning' },
  { id: 'mcdonalds-ts', name: 'McDonald\'s Times Square', category: 'food', price: '$', description: 'The most extra McDonald\'s in existence. Giant neon signs, multiple floors, and the full tourist experience. Grab an ice cream for the novelty.', address: '1528 Broadway, New York, NY 10036', lat: 40.7583, lng: -73.9862, hours: 'Daily 6AM-3AM', duration: '15 min', neighborhood: 'Times Square', recommendedBy: 'Sister 2', bestTimeSlot: 'evening' },
  { id: 'mcsorleys', name: 'McSorley\'s Old Ale House', category: 'nightlife', price: '$', description: 'NYC\'s oldest bar, established 1854. Only serves two beers: light and dark (and they come two at a time). Will be absolutely electric on St. Patrick\'s Day.', notes: 'Go on St. Patrick\'s Day for the full experience!', address: '15 E 7th St, New York, NY 10003', lat: 40.7282, lng: -73.9905, hours: 'Mon-Sat 11AM-1AM, Sun 12PM-1AM', duration: '1 hour', neighborhood: 'East Village', recommendedBy: 'Sister 2', bestTimeSlot: 'evening' },
  // Ters's picks
  { id: 'faiccos', name: 'Faicco\'s Italian Specialties', category: 'food', price: '$', description: 'Legendary since 1900. Monster Italian hero sandwiches, fresh mozzarella, arancini rice balls. One of the oldest and best delis in the US. Takeout only.', notes: '⭐ HIGHLY RECOMMENDED. Eat in Washington Sq Park. Closed Mondays!', address: '260 Bleecker St, New York, NY 10014', lat: 40.7315, lng: -74.0033, hours: 'Tue-Sat 9AM-6PM, Sun 9AM-3PM. CLOSED MON', duration: '30 min', neighborhood: 'Greenwich Village', recommendedBy: 'Ters', bestTimeSlot: 'morning' },
  { id: 'ess-a-bagel', name: 'Ess-a-Bagel', category: 'food', price: '$', description: 'Voted NYC\'s best bagel for 40+ years. Hand-rolled, kettle-boiled, baked on premises. Massive, chewy, crispy. Multiple locations.', notes: 'Closest to hotel: 324 1st Ave (Gramercy)', address: '324 1st Ave, New York, NY 10009', lat: 40.7324, lng: -73.9818, hours: 'Daily 6AM-5PM', duration: '20 min', neighborhood: 'Gramercy/East Village', recommendedBy: 'Ters', bestTimeSlot: 'morning' },
  // Additional essential places
  { id: 'st-patricks-parade', name: 'St. Patrick\'s Day Parade', category: 'sightseeing', price: 'free', description: 'World\'s largest St. Patrick\'s Day parade! Up 5th Ave. Pop in for 15-20 min of the atmosphere, don\'t try to camp out.', notes: 'March 17, 11AM-5PM along 5th Ave', address: '5th Avenue (44th-79th St), New York', lat: 40.7580, lng: -73.9780, hours: 'March 17, 11AM-5PM', duration: '15-20 min', neighborhood: 'Midtown', recommendedBy: 'Sister 2', bestTimeSlot: 'afternoon' },
  { id: 'governors-island', name: 'Governors Island Ferry', category: 'sightseeing', price: 'free', description: 'Beautiful island park in the harbor. Note: typically seasonal (May-Oct), may NOT be open in mid-March. Verify before going!', notes: '⚠️ Check if open in mid-March — usually seasonal!', address: '10 South St, New York, NY 10004', lat: 40.6892, lng: -74.0166, hours: 'Seasonal — typically May-Oct', duration: '2-3 hours', neighborhood: 'Financial District', recommendedBy: 'Sister 1', bestTimeSlot: 'afternoon' },
  { id: 'wall-st', name: 'Wall Street & Charging Bull', category: 'sightseeing', price: 'free', description: 'The financial heart of the world. See the iconic Charging Bull statue, the NYSE building, and Federal Hall.', address: 'Wall Street, New York, NY 10005', lat: 40.7068, lng: -74.0090, hours: 'Always (outdoor)', duration: '30 min', neighborhood: 'Financial District', recommendedBy: 'App', bestTimeSlot: 'morning' },
];

// ===== ITINERARY =====
export const defaultItinerary: DayPlan[] = [
  {
    date: '2026-03-13',
    dayLabel: 'Day 0 — Friday',
    title: 'Arrival Day ✈️',
    subtitle: 'Suzanne arrives early, Ters in the evening',
    items: [
      { placeId: 'tompkins-bagels', timeSlot: 'afternoon', time: '15:00', notes: 'Suzanne solo — late lunch after check-in' },
      { placeId: 'rubirosa', timeSlot: 'evening', time: '21:30', notes: 'Late dinner together after Ters arrives. Tie dye pizza!' },
    ],
  },
  {
    date: '2026-03-14',
    dayLabel: 'Day 1 — Saturday',
    title: 'Downtown & Brooklyn 🌉',
    items: [
      { placeId: 'high-line', timeSlot: 'morning', time: '9:00', notes: 'Early morning walk — less crowded on weekends' },
      { placeId: 'chelsea-market', timeSlot: 'morning', time: '10:30', notes: 'Brunch & browse the food hall' },
      { placeId: 'little-island', timeSlot: 'morning', time: '12:00', notes: 'Short walk from Chelsea Market' },
      { placeId: 'brooklyn-bridge', timeSlot: 'afternoon', time: '13:30', notes: 'Walk Manhattan → Brooklyn' },
      { placeId: 'dumbo', timeSlot: 'afternoon', time: '14:30', notes: 'Photos at Washington St iconic spot' },
      { placeId: 'king-dumplings', timeSlot: 'afternoon', time: '16:00', notes: '$3.50 dumplings on the way back' },
      { placeId: 'fiaschetteria', timeSlot: 'evening', time: '19:00', notes: 'Cacio e pepe dinner' },
      { placeId: 'la-caverna', timeSlot: 'evening', time: '21:30', notes: 'Underground bar vibes near the hotel' },
    ],
  },
  {
    date: '2026-03-15',
    dayLabel: 'Day 2 — Sunday',
    title: 'Iconic Manhattan 🏙️',
    items: [
      { placeId: 'central-park', timeSlot: 'morning', time: '9:30', notes: 'Bethesda Fountain, Bow Bridge, Strawberry Fields' },
      { placeId: 'central-park-cafe', timeSlot: 'morning', time: '11:00', notes: 'Coffee in the park' },
      { placeId: 'the-met', timeSlot: 'afternoon', time: '12:00', notes: '2-3 hrs: Temple of Dendur, European art, rooftop' },
      { placeId: 'grand-central', timeSlot: 'afternoon', time: '15:30', notes: 'Whispering gallery, stunning ceiling' },
      { placeId: 'summit-one', timeSlot: 'evening', time: '17:30', notes: '🌅 Sunset at ~19:05 — arrive early!' },
      { placeId: 'angelina-bakery', timeSlot: 'evening', time: '19:30', notes: 'Pistachio croissant reward' },
      { placeId: 'times-square', timeSlot: 'evening', time: '20:00', notes: 'See it lit up at night' },
      { placeId: 'comedy-cellar', timeSlot: 'evening', time: '21:30', notes: 'Book tickets in advance!' },
    ],
  },
  {
    date: '2026-03-16',
    dayLabel: 'Day 3 — Monday',
    title: 'Lower Manhattan & Culture 🗽',
    items: [
      { placeId: 'faiccos', timeSlot: 'morning', time: '10:00', notes: '⭐ Legendary Italian sandwiches. Eat in Washington Sq Park.' },
      { placeId: 'ground-zero', timeSlot: 'morning', time: '11:30', notes: 'Memorial & Museum — allow 2-3 hours' },
      { placeId: 'wall-st', timeSlot: 'afternoon', time: '14:00', notes: 'Charging Bull, NYSE' },
      { placeId: 'staten-island-ferry', timeSlot: 'afternoon', time: '15:00', notes: 'Best free view of Statue of Liberty' },
      { placeId: 'shu-jiao', timeSlot: 'afternoon', time: '17:00', notes: 'Peanut noodles in Chinatown' },
      { placeId: 'doyers-st', timeSlot: 'afternoon', time: '17:30', notes: 'Historic Bloody Angle photo' },
      { placeId: 'roosevelt-tramway', timeSlot: 'evening', time: '18:30', notes: '🌅 Sunset tramway ride!' },
      { placeId: 'mao-mao', timeSlot: 'evening', time: '20:00', notes: 'Thai dinner near hotel' },
    ],
  },
  {
    date: '2026-03-17',
    dayLabel: 'Day 4 — Tuesday',
    title: 'St. Patrick\'s Day 🍀',
    subtitle: 'NYC\'s biggest street party! Also Taco Tuesday!',
    items: [
      { placeId: 'ess-a-bagel', timeSlot: 'morning', time: '9:30', notes: 'Best bagels in NYC for 40+ years' },
      { placeId: 'urban-jungle', timeSlot: 'morning', time: '11:00', notes: 'Thrift shopping in Bushwick' },
      { placeId: 'st-patricks-parade', timeSlot: 'afternoon', time: '13:00', notes: '🍀 Pop in for 15-20 min. Don\'t camp out!' },
      { placeId: 'mcsorleys', timeSlot: 'afternoon', time: '14:00', notes: '🍀 NYC\'s oldest bar — electric on St. Paddy\'s!' },
      { placeId: 'joes-pizza', timeSlot: 'afternoon', time: '15:30', notes: 'Classic NYC slice' },
      { placeId: 'friends-apt', timeSlot: 'afternoon', time: '16:30', notes: 'Quick photo stop' },
      { placeId: 'carrie-bradshaw', timeSlot: 'afternoon', time: '16:45', notes: 'Nearby — quick photo' },
      { placeId: 'limosneros', timeSlot: 'evening', time: '19:00', notes: '🌮 TACO TUESDAY + St. Paddy\'s = best combo!' },
      { placeId: 'elsewhere', timeSlot: 'evening', time: '22:00', notes: '🍀 The whole city is a party tonight!' },
    ],
  },
  {
    date: '2026-03-18',
    dayLabel: 'Day 5 — Wednesday',
    title: 'Last Morning & Departure ✈️',
    subtitle: 'Leave Manhattan by 16:30 for Newark',
    items: [
      { placeId: 'tompkins-bagels', timeSlot: 'morning', time: '9:00', notes: 'Final morning bagel run' },
      { placeId: 'wo-hop', timeSlot: 'morning', time: '12:00', notes: 'Last meal: honey chicken & eggplant garlic' },
    ],
  },
];

// ===== FLIGHTS =====
export const flights: Flight[] = [
  {
    passenger: 'Ters',
    direction: 'outbound',
    legs: [
      { flight: 'UA 6074', route: 'LBL → DEN', from: 'Liberal', to: 'Denver', depart: '11:16', arrive: '11:35', seat: '1B', aircraft: 'Bombardier CRJ200', date: '2026-03-13' },
      { flight: 'UA 1505', route: 'DEN → EWR', from: 'Denver', to: 'Newark', depart: '13:40', arrive: '19:21', seat: '7E', aircraft: 'Boeing 757-200', date: '2026-03-13' },
    ],
  },
  {
    passenger: 'Suzanne',
    direction: 'outbound',
    legs: [
      { flight: 'UA 995', route: 'BRU → EWR', from: 'Brussels', to: 'Newark', depart: '10:15', arrive: '13:30', seat: '49L', aircraft: 'Boeing 787-10 Dreamliner', date: '2026-03-13' },
    ],
  },
  {
    passenger: 'Together',
    direction: 'return',
    legs: [
      { flight: 'UA 994', route: 'EWR → BRU', from: 'Newark', to: 'Brussels', depart: '19:55', arrive: '08:05+1', seat: '59F (Suzanne)', aircraft: 'Boeing 787-10 Dreamliner', date: '2026-03-18' },
    ],
  },
];

// ===== EVENTS =====
export const events: Event[] = [
  { id: 'evt-1', name: 'NJ Devils vs LA Kings', category: '🏒 NHL', date: '2026-03-14', time: '7:00 PM', venue: 'Prudential Center, Newark', price: '$$-$$$', description: 'Easy trip from hotel via PATH train. Great intro to American hockey!', icon: '🏒' },
  { id: 'evt-2', name: 'New Edition + Boyz II Men + Toni Braxton', category: '🎵 Concert', date: '2026-03-14', time: '7:00 PM', venue: 'Barclays Center, Brooklyn', price: '$$$', description: 'Massive R&B nostalgia concert.', icon: '🎵' },
  { id: 'evt-3', name: 'Knicks vs Warriors', category: '🏀 NBA', date: '2026-03-15', time: '8:00 PM', venue: 'Madison Square Garden', price: '$$$', description: 'See Steph Curry at the world\'s most famous arena!', icon: '🏀' },
  { id: 'evt-4', name: 'NYC Half Marathon', category: '🏃 Running', date: '2026-03-15', time: 'Morning-3PM', venue: 'Various streets', price: 'Free to watch', description: '⚠️ Road closures in lower Manhattan through ~3PM. Plan around this.', icon: '🏃' },
  { id: 'evt-5', name: 'NY Rangers vs LA Kings', category: '🏒 NHL', date: '2026-03-16', time: '7:00 PM', venue: 'Madison Square Garden', price: '$$$', description: 'Hockey at MSG — electric atmosphere.', icon: '🏒' },
  { id: 'evt-6', name: 'Nets vs Trail Blazers', category: '🏀 NBA', date: '2026-03-16', time: '7:30 PM', venue: 'Barclays Center, Brooklyn', price: '$$', description: 'More affordable NBA option in Brooklyn.', icon: '🏀' },
  { id: 'evt-7', name: 'St. Patrick\'s Day Parade', category: '🍀 Holiday', date: '2026-03-17', time: '11:00 AM - 5:00 PM', venue: '5th Avenue (44th-79th St)', price: 'Free', description: 'World\'s largest St. Patrick\'s Day parade! Pop in for 15-20 min.', icon: '🍀' },
  { id: 'evt-8', name: 'Knicks vs Pacers', category: '🏀 NBA', date: '2026-03-17', time: '7:30 PM', venue: 'Madison Square Garden', price: '$$-$$$', description: 'NBA on St. Patrick\'s Day — MSG will be wild.', icon: '🏀' },
  { id: 'evt-9', name: 'Broadway: Various Shows', category: '🎭 Theater', date: '2026-03-13', time: 'Various', venue: 'Broadway Theaters, Midtown', price: '$$$', description: 'TKTS booth for same-day discounts. Check for: Death of a Salesman, Dog Day Afternoon, Every Brilliant Thing.', icon: '🎭' },
];

// ===== SURVIVAL GUIDE =====
export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: GuideItem[];
}

export interface GuideItem {
  title: string;
  text: string;
}

export const guideSections: GuideSection[] = [
  {
    id: 'transport',
    title: 'Getting Around',
    icon: '🚇',
    content: [
      { title: 'Newark → Manhattan', text: 'Best option: NJ Transit + PATH train (~$15, 60-75 min). Take AirTrain to Newark Liberty station → NJ Transit to Penn Station NYC, or to Newark Penn → PATH to Manhattan. Uber/Lyft: ~$60-90 + tolls. Shared shuttle: ~$25-35.' },
      { title: 'Subway (MTA)', text: 'Single ride: $2.90. Use OMNY tap-to-pay with your contactless bank card or phone — no MetroCard needed! Tap the same card each ride; after 12 rides in a week you ride free. Key lines from LES: F/M (east side), J/Z (Brooklyn), B/D (Midtown).' },
      { title: 'Walking', text: 'NYC is a grid above Houston St. Avenues run north-south, streets run east-west. 20 north-south blocks ≈ 1 mile. East-west blocks are longer. Manhattan is very walkable — most of your travel will be on foot.' },
      { title: 'Uber/Lyft & Taxis', text: 'Both work perfectly in NYC. Yellow cabs can be hailed on the street (light on = available). Typical ride in Manhattan: $15-30. Tip 15-20% for taxis. Uber/Lyft tipping is in-app.' },
    ],
  },
  {
    id: 'money',
    title: 'Money & Tipping',
    icon: '💰',
    content: [
      { title: 'Tipping Culture', text: 'Tipping is NOT optional in the US — it\'s how service workers earn their living. Restaurants: 18-20% on the pre-tax total. Bars: $1-2 per drink. Coffee shops: $1 or round up. Taxi/Uber: 15-20%. Hotel housekeeping: $3-5/night (leave on pillow with a note).' },
      { title: 'Sales Tax', text: 'New York sales tax is 8.875%. This is added at checkout — prices on menus and tags are BEFORE tax. So a $10 item costs $10.89 at the register.' },
      { title: 'Paying', text: 'Credit/debit cards accepted almost everywhere. Contactless (tap) works widely. Carry $50-100 cash for: street food vendors, cash-only spots (King Dumplings!), small tips, splitting checks.' },
      { title: 'Currency', text: 'USD ($). At time of writing, approximately €1 = $1.05-1.10. ATMs are everywhere (look for your bank network to avoid fees). Avoid currency exchange booths — bad rates.' },
    ],
  },
  {
    id: 'practical',
    title: 'Practical Info',
    icon: '📋',
    content: [
      { title: 'Time Zone', text: 'Eastern Standard Time (EST) — UTC-5. That\'s 6 hours behind the Netherlands. When it\'s noon in NYC, it\'s 6 PM in Den Bosch.' },
      { title: 'Weather (Mid-March)', text: 'Expect 4-12°C (40-55°F). It can feel colder with wind between buildings. Layer up: t-shirt + sweater/hoodie + jacket. Bring a light rain jacket. Comfortable walking shoes are essential — you\'ll walk 15,000-25,000 steps/day.' },
      { title: 'Power & Phones', text: 'US outlets are Type A/B (flat prongs). Bring a travel adapter! Voltage: 120V (vs 230V in NL) — most modern chargers are dual-voltage, check yours. Consider a US eSIM for data (cheaper than roaming).' },
      { title: 'Emergency & Pharmacy', text: '911 for emergencies. Duane Reade and CVS pharmacies are on practically every block — they carry medicine, snacks, toiletries, everything. Tap water in NYC is safe and actually excellent.' },
      { title: 'Etiquette Tips', text: 'Walk fast and stay right on sidewalks. Don\'t stop in the middle of the sidewalk. Stand right, walk left on escalators. New Yorkers are direct but friendly — ask for help if you need it, people are nicer than the stereotype.' },
    ],
  },
  {
    id: 'neighborhoods',
    title: 'Neighborhoods',
    icon: '🏘️',
    content: [
      { title: 'Lower East Side (Home Base)', text: 'Your hotel neighborhood! Trendy restaurants, dive bars, live music venues, vintage shops. Orchard St and Rivington St are the main drags. Great at night.' },
      { title: 'East Village', text: 'Just north of LES. Eclectic food scene, punk rock history, Tompkins Square Park. More relaxed than LES, equally cool.' },
      { title: 'Chinatown', text: 'Chaotic, delicious, authentic. Dumplings, noodles, and Doyers St. Cash-heavy area. Just south of your hotel — easy walk.' },
      { title: 'SoHo & Nolita', text: 'Shopping paradise with cast-iron architecture. High-end boutiques mixed with big brands. Nolita is more intimate with great restaurants (Rubirosa is here).' },
      { title: 'Greenwich Village', text: 'Washington Square Park, Comedy Cellar, Bleecker St. Historic bohemian neighborhood. This is where Faicco\'s, Joe\'s Pizza, and both the Friends & Carrie Bradshaw apartments are.' },
      { title: 'Chelsea & Meatpacking', text: 'The High Line, Chelsea Market, Little Island, art galleries. Modern and trendy, great for a morning exploration.' },
      { title: 'Midtown', text: 'Times Square, Grand Central, Summit One Vanderbilt, Broadway theaters. Tourist central but genuinely exciting for first-timers.' },
      { title: 'Brooklyn (DUMBO/Williamsburg)', text: 'Cross the bridge for incredible waterfront views, artsy vibes, and world-class food. DUMBO is a must for photos. Williamsburg for nightlife (Elsewhere).' },
    ],
  },
];

// ===== HELPERS =====
export function getPlaceById(id: string): Place | undefined {
  return places.find(p => p.id === id);
}

export function getMapsUrl(place: Place): string {
  const q = encodeURIComponent(`${place.name}, ${place.address}`);
  // Use universal Google Maps link that works on all devices
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function getWalkingTime(km: number): string {
  const mins = Math.round(km / 0.08); // ~5 km/h walking speed ≈ 0.083 km/min
  if (mins < 2) return '< 2 min walk';
  return `~${mins} min walk`;
}

// Hotel coordinates
export const HOTEL_LAT = 40.7178;
export const HOTEL_LNG = -73.9885;
