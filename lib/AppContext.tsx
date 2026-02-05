import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region, regions, getDefaultRegion, getRegion } from './regions';

type ServiceMode = 'home' | 'delivery' | 'taxi';

interface OrderDetails {
  islandId?: string;
  storeId?: string;
  deliveryDate?: string;
  notes?: string;
  pickupCode?: string;
  pdfUploaded?: boolean;
}

interface RideDetails {
  from?: string;
  to?: string;
  rideId?: string;
  passengers?: number;
  contactName?: string;
  contactPhone?: string;
}

interface AppContextValue {
  mode: ServiceMode;
  setMode: (mode: ServiceMode) => void;
  selectedIslandId: string | null;
  setSelectedIslandId: (id: string | null) => void;
  orderDetails: OrderDetails;
  setOrderDetails: (details: OrderDetails) => void;
  rideDetails: RideDetails;
  setRideDetails: (details: RideDetails) => void;
  resetOrder: () => void;
  resetRide: () => void;
  region: Region;
  setRegionById: (regionId: string) => void;
  availableRegions: Region[];
}

const AppContext = createContext<AppContextValue | null>(null);

const REGION_STORAGE_KEY = '@clampacked_region';

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ServiceMode>('home');
  const [selectedIslandId, setSelectedIslandId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const [rideDetails, setRideDetails] = useState<RideDetails>({ passengers: 1 });
  const [region, setRegion] = useState<Region>(getDefaultRegion());

  useEffect(() => {
    AsyncStorage.getItem(REGION_STORAGE_KEY).then((storedRegionId) => {
      if (storedRegionId) {
        const storedRegion = getRegion(storedRegionId);
        if (storedRegion) {
          setRegion(storedRegion);
        }
      }
    });
  }, []);

  const setRegionById = (regionId: string) => {
    const newRegion = getRegion(regionId);
    if (newRegion) {
      setRegion(newRegion);
      AsyncStorage.setItem(REGION_STORAGE_KEY, regionId);
      resetOrder();
      resetRide();
    }
  };

  const resetOrder = () => {
    setOrderDetails({});
    setSelectedIslandId(null);
  };

  const resetRide = () => {
    setRideDetails({ passengers: 1 });
  };

  const value = useMemo(() => ({
    mode,
    setMode,
    selectedIslandId,
    setSelectedIslandId,
    orderDetails,
    setOrderDetails,
    rideDetails,
    setRideDetails,
    resetOrder,
    resetRide,
    region,
    setRegionById,
    availableRegions: regions,
  }), [mode, selectedIslandId, orderDetails, rideDetails, region]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
