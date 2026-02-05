export interface Island {
  id: string;
  name: string;
  shortName: string;
  deliveryDay: string;
  pickupLocation: string;
  pickupCoords: { lat: number; lng: number };
}

export interface DeliveryDate {
  date: string;
  displayDate: string;
  orderDeadline: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  color: string;
  flowType: 'pdf_upload' | 'pickup_code' | 'automatic' | 'order_note' | 'call_order' | 'drop_point';
}

export interface Captain {
  id: string;
  name: string;
  boat: string;
  rating: number;
  years: number;
  avatar: string;
}

export interface WaterTaxiRoute {
  from: string;
  to: string;
  basePrice: number;
  duration: string;
}

export interface AvailableRide {
  id: string;
  from: string;
  to: string;
  captain: Captain;
  departureTime: string;
  seatsLeft: number;
  price: number;
  isOnDemand?: boolean;
}

export const islands: Island[] = [
  {
    id: 'orcas',
    name: 'Orcas Island',
    shortName: 'Orcas',
    deliveryDay: 'Tuesday',
    pickupLocation: 'Eastsound',
    pickupCoords: { lat: 48.6919, lng: -122.9069 },
  },
  {
    id: 'sanJuan',
    name: 'San Juan Island',
    shortName: 'San Juan',
    deliveryDay: 'Wednesday',
    pickupLocation: 'Friday Harbor',
    pickupCoords: { lat: 48.5343, lng: -123.0170 },
  },
  {
    id: 'lopez',
    name: 'Lopez Island',
    shortName: 'Lopez',
    deliveryDay: 'Thursday',
    pickupLocation: 'Lopez Community Center',
    pickupCoords: { lat: 48.5139, lng: -122.8859 },
  },
];

export const mainland = {
  id: 'anacortes',
  name: 'Anacortes',
  shortName: 'Anacortes',
  coords: { lat: 48.5126, lng: -122.6127 },
};

export const deliverySchedule: Record<string, DeliveryDate[]> = {
  orcas: [
    { date: '2026-02-10', displayDate: 'Tue, Feb 10', orderDeadline: 'Fri, Feb 6' },
    { date: '2026-02-24', displayDate: 'Tue, Feb 24', orderDeadline: 'Fri, Feb 20' },
    { date: '2026-03-10', displayDate: 'Tue, Mar 10', orderDeadline: 'Fri, Mar 6' },
    { date: '2026-03-24', displayDate: 'Tue, Mar 24', orderDeadline: 'Fri, Mar 20' },
  ],
  sanJuan: [
    { date: '2026-02-11', displayDate: 'Wed, Feb 11', orderDeadline: 'Sat, Feb 7' },
    { date: '2026-02-25', displayDate: 'Wed, Feb 25', orderDeadline: 'Sat, Feb 21' },
    { date: '2026-03-11', displayDate: 'Wed, Mar 11', orderDeadline: 'Sat, Mar 7' },
    { date: '2026-03-25', displayDate: 'Wed, Mar 25', orderDeadline: 'Sat, Mar 21' },
  ],
  lopez: [
    { date: '2026-02-12', displayDate: 'Thu, Feb 12', orderDeadline: 'Sun, Feb 8' },
    { date: '2026-02-26', displayDate: 'Thu, Feb 26', orderDeadline: 'Sun, Feb 22' },
    { date: '2026-03-12', displayDate: 'Thu, Mar 12', orderDeadline: 'Sun, Mar 8' },
    { date: '2026-03-26', displayDate: 'Thu, Mar 26', orderDeadline: 'Sun, Mar 22' },
  ],
};

export const stores: Store[] = [
  {
    id: 'traderJoes',
    name: "Trader Joe's",
    logo: 'cart',
    color: '#C8102E',
    flowType: 'pdf_upload',
  },
  {
    id: 'safeway',
    name: 'Safeway',
    logo: 'storefront',
    color: '#E21833',
    flowType: 'pickup_code',
  },
  {
    id: 'helaProvisions',
    name: 'Hela Provisions',
    logo: 'leaf',
    color: '#2E7D32',
    flowType: 'automatic',
  },
  {
    id: 'chefstore',
    name: "CHEF'STORE",
    logo: 'restaurant',
    color: '#1565C0',
    flowType: 'order_note',
  },
  {
    id: 'chs',
    name: 'CHS Farm & Home',
    logo: 'home',
    color: '#F57C00',
    flowType: 'call_order',
  },
  {
    id: 'azureStandard',
    name: 'Azure Standard',
    logo: 'nutrition',
    color: '#0288D1',
    flowType: 'drop_point',
  },
];

export const captains: Captain[] = [
  {
    id: 'mike',
    name: 'Captain Mike',
    boat: 'Island Hopper',
    rating: 4.9,
    years: 12,
    avatar: 'person-circle',
  },
  {
    id: 'sarah',
    name: 'Captain Sarah',
    boat: 'San Juan Spirit',
    rating: 4.8,
    years: 8,
    avatar: 'person-circle',
  },
  {
    id: 'tom',
    name: 'Captain Tom',
    boat: 'Orca Runner',
    rating: 4.7,
    years: 15,
    avatar: 'person-circle',
  },
];

export const waterTaxiRoutes: WaterTaxiRoute[] = [
  { from: 'orcas', to: 'sanJuan', basePrice: 45, duration: '25 min' },
  { from: 'orcas', to: 'lopez', basePrice: 55, duration: '35 min' },
  { from: 'sanJuan', to: 'lopez', basePrice: 40, duration: '20 min' },
  { from: 'anacortes', to: 'orcas', basePrice: 75, duration: '45 min' },
  { from: 'anacortes', to: 'sanJuan', basePrice: 70, duration: '40 min' },
  { from: 'anacortes', to: 'lopez', basePrice: 65, duration: '35 min' },
];

export const availableRides: AvailableRide[] = [
  {
    id: '1',
    from: 'orcas',
    to: 'sanJuan',
    captain: captains[0],
    departureTime: 'Today 2:30 PM',
    seatsLeft: 2,
    price: 45,
  },
  {
    id: '2',
    from: 'orcas',
    to: 'sanJuan',
    captain: captains[1],
    departureTime: 'Tomorrow 8:00 AM',
    seatsLeft: 4,
    price: 35,
  },
  {
    id: '3',
    from: 'sanJuan',
    to: 'lopez',
    captain: captains[2],
    departureTime: 'Today 4:00 PM',
    seatsLeft: 3,
    price: 40,
  },
  {
    id: '4',
    from: 'anacortes',
    to: 'orcas',
    captain: captains[0],
    departureTime: 'Tomorrow 10:00 AM',
    seatsLeft: 5,
    price: 75,
  },
];

export const ferryStatus = {
  hasDisruption: true,
  message: 'WSF delays today — water taxis ready!',
  details: 'Washington State Ferries experiencing mechanical issues until 6 PM',
};

export function getLocationName(id: string): string {
  const island = islands.find(i => i.id === id);
  if (island) return island.shortName;
  if (id === 'anacortes') return 'Anacortes';
  return id;
}

export function getRouteInfo(from: string, to: string): WaterTaxiRoute | undefined {
  return waterTaxiRoutes.find(
    r => (r.from === from && r.to === to) || (r.from === to && r.to === from)
  );
}

export function getNextDelivery(islandId: string): DeliveryDate | undefined {
  const schedule = deliverySchedule[islandId];
  return schedule?.[0];
}

export function getRidesForRoute(from: string, to: string): AvailableRide[] {
  return availableRides.filter(
    r => (r.from === from && r.to === to) || (r.from === to && r.to === from)
  );
}
