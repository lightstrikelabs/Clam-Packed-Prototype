import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Island, Store, Captain, AvailableRide, DeliveryDate, islands, stores, captains, availableRides, getNextDelivery } from './mockData';

type ServiceMode = 'home' | 'delivery' | 'taxi';

interface OrderDetails {
  island?: Island;
  store?: Store;
  deliveryDate?: DeliveryDate;
  notes?: string;
  pickupCode?: string;
  pdfUploaded?: boolean;
}

interface RideDetails {
  from?: string;
  to?: string;
  ride?: AvailableRide;
  passengers?: number;
}

interface AppContextValue {
  mode: ServiceMode;
  setMode: (mode: ServiceMode) => void;
  selectedIsland: Island | null;
  setSelectedIsland: (island: Island | null) => void;
  orderDetails: OrderDetails;
  setOrderDetails: (details: OrderDetails) => void;
  rideDetails: RideDetails;
  setRideDetails: (details: RideDetails) => void;
  resetOrder: () => void;
  resetRide: () => void;
  showFerryAlert: boolean;
  setShowFerryAlert: (show: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ServiceMode>('home');
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const [rideDetails, setRideDetails] = useState<RideDetails>({ passengers: 1 });
  const [showFerryAlert, setShowFerryAlert] = useState(true);

  const resetOrder = () => {
    setOrderDetails({});
    setSelectedIsland(null);
  };

  const resetRide = () => {
    setRideDetails({ passengers: 1 });
  };

  const value = useMemo(() => ({
    mode,
    setMode,
    selectedIsland,
    setSelectedIsland,
    orderDetails,
    setOrderDetails,
    rideDetails,
    setRideDetails,
    resetOrder,
    resetRide,
    showFerryAlert,
    setShowFerryAlert,
  }), [mode, selectedIsland, orderDetails, rideDetails, showFerryAlert]);

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
