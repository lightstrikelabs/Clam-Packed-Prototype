export interface Island {
  id: string;
  name: string;
  x: number;
  y: number;
  deliveryDays?: string[];
  isMainland?: boolean;
}

export interface Store {
  id: string;
  name: string;
  type: 'pdf' | 'pickup' | 'auto' | 'note' | 'call' | 'drop';
  description: string;
  logo?: string;
}

export interface Captain {
  id: string;
  name: string;
  boat: string;
  rating: number;
  trips: number;
  avatar?: string;
}

export interface Region {
  id: string;
  name: string;
  tagline: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  islands: Island[];
  stores: Store[];
  captains: Captain[];
  baseDeliveryFee: number;
  baseTaxiRate: number;
}

export const regions: Region[] = [
  {
    id: 'san-juan',
    name: 'San Juan Islands',
    tagline: 'Washington State',
    brandName: 'Clam Packed',
    primaryColor: '#39ADB8',
    secondaryColor: '#ED9739',
    islands: [
      { id: 'orcas', name: 'Orcas Island', x: 0.55, y: 0.22, deliveryDays: ['Tuesday', 'Friday'] },
      { id: 'sanJuan', name: 'San Juan Island', x: 0.25, y: 0.45, deliveryDays: ['Wednesday', 'Saturday'] },
      { id: 'lopez', name: 'Lopez Island', x: 0.55, y: 0.65, deliveryDays: ['Thursday'] },
      { id: 'anacortes', name: 'Anacortes', x: 0.78, y: 0.82, isMainland: true },
    ],
    stores: [
      { id: 'traderjoes', name: "Trader Joe's", type: 'pdf', description: 'Upload your shopping list' },
      { id: 'safeway', name: 'Safeway', type: 'pickup', description: 'Enter pickup confirmation' },
      { id: 'hela', name: 'Hela Provisions', type: 'auto', description: 'We handle everything' },
      { id: 'chefstore', name: "CHEF'STORE", type: 'note', description: 'Add order details' },
      { id: 'chs', name: 'CHS Farm & Home', type: 'call', description: 'Call to place order' },
      { id: 'azure', name: 'Azure Standard', type: 'drop', description: 'Drop point pickup' },
    ],
    captains: [
      { id: 'mike', name: 'Captain Mike', boat: 'Sea Sprite', rating: 4.9, trips: 342 },
      { id: 'sarah', name: 'Captain Sarah', boat: 'Island Runner', rating: 4.8, trips: 256 },
      { id: 'tom', name: 'Captain Tom', boat: 'Wave Dancer', rating: 4.7, trips: 189 },
    ],
    baseDeliveryFee: 25,
    baseTaxiRate: 45,
  },
  {
    id: 'casco-bay',
    name: 'Casco Bay Islands',
    tagline: 'Maine',
    brandName: 'Casco Cargo',
    primaryColor: '#2E7D5A',
    secondaryColor: '#D4853A',
    islands: [
      { id: 'peaks', name: 'Peaks Island', x: 0.45, y: 0.30, deliveryDays: ['Monday', 'Thursday'] },
      { id: 'longIsland', name: 'Long Island', x: 0.60, y: 0.45, deliveryDays: ['Tuesday', 'Friday'] },
      { id: 'chebeague', name: 'Chebeague Island', x: 0.35, y: 0.55, deliveryDays: ['Wednesday'] },
      { id: 'cliffIsland', name: 'Cliff Island', x: 0.55, y: 0.70, deliveryDays: ['Friday'] },
      { id: 'portland', name: 'Portland', x: 0.25, y: 0.82, isMainland: true },
    ],
    stores: [
      { id: 'hannaford', name: 'Hannaford', type: 'pickup', description: 'Enter pickup confirmation' },
      { id: 'traderjoes', name: "Trader Joe's", type: 'pdf', description: 'Upload your shopping list' },
      { id: 'wholeFoods', name: 'Whole Foods', type: 'auto', description: 'We handle everything' },
      { id: 'portlandFood', name: 'Portland Food Co-op', type: 'note', description: 'Add order details' },
    ],
    captains: [
      { id: 'jim', name: 'Captain Jim', boat: 'Nor\'easter', rating: 4.9, trips: 512 },
      { id: 'lisa', name: 'Captain Lisa', boat: 'Lobster Lady', rating: 4.8, trips: 389 },
    ],
    baseDeliveryFee: 20,
    baseTaxiRate: 35,
  },
  {
    id: 'mackinac',
    name: 'Mackinac Island',
    tagline: 'Michigan',
    brandName: 'Mackinac Move',
    primaryColor: '#4A6FA5',
    secondaryColor: '#C7522A',
    islands: [
      { id: 'mackinac', name: 'Mackinac Island', x: 0.50, y: 0.35, deliveryDays: ['Monday', 'Wednesday', 'Friday'] },
      { id: 'boisBlanc', name: 'Bois Blanc Island', x: 0.70, y: 0.55, deliveryDays: ['Tuesday', 'Saturday'] },
      { id: 'stIgnace', name: 'St. Ignace', x: 0.30, y: 0.75, isMainland: true },
      { id: 'mackinawCity', name: 'Mackinaw City', x: 0.65, y: 0.82, isMainland: true },
    ],
    stores: [
      { id: 'meijer', name: 'Meijer', type: 'pickup', description: 'Enter pickup confirmation' },
      { id: 'familyFare', name: 'Family Fare', type: 'auto', description: 'We handle everything' },
      { id: 'glenns', name: "Glenn's Market", type: 'note', description: 'Add order details' },
    ],
    captains: [
      { id: 'bob', name: 'Captain Bob', boat: 'Great Lakes Runner', rating: 4.9, trips: 678 },
      { id: 'nancy', name: 'Captain Nancy', boat: 'Northern Star', rating: 4.7, trips: 234 },
    ],
    baseDeliveryFee: 30,
    baseTaxiRate: 50,
  },
];

export function getRegion(regionId: string): Region | undefined {
  return regions.find(r => r.id === regionId);
}

export function getDefaultRegion(): Region {
  return regions[0];
}
