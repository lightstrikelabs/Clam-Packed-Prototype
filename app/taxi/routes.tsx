import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { getLocationName, getRouteInfo } from '@/lib/mockData';
import IslandMap from '@/components/IslandMap';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FerryAlert from '@/components/ui/FerryAlert';
import IslandLabel from '@/components/ui/IslandLabel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RoutesScreen() {
  const insets = useSafeAreaInsets();
  const { rideDetails, setRideDetails, setMode, showFerryAlert, setShowFerryAlert } = useApp();
  const [origin, setOrigin] = useState<string | null>(rideDetails.from || null);
  const [destination, setDestination] = useState<string | null>(rideDetails.to || null);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const headerHeight = insets.top + webTopInset + 50;

  const handleLocationPress = (locationId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!origin) {
      setOrigin(locationId);
    } else if (!destination && locationId !== origin) {
      setDestination(locationId);
    } else if (locationId === origin) {
      setOrigin(null);
      setDestination(null);
    } else if (locationId === destination) {
      setDestination(null);
    } else {
      setOrigin(locationId);
      setDestination(null);
    }
  };

  const handleSwap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleContinue = () => {
    if (origin && destination) {
      setRideDetails({ ...rideDetails, from: origin, to: destination });
      router.push('/taxi/rides');
    }
  };

  const handleBack = () => {
    setMode('home');
    router.back();
  };

  const routeInfo = origin && destination ? getRouteInfo(origin, destination) : null;

  return (
    <View style={styles.container}>
      <Header 
        title="Where to?"
        transparent
        light
        onBackPress={handleBack}
      />
      
      <View style={styles.mapContainer}>
        <View style={{ marginTop: headerHeight }}>
          <IslandMap
            mode="taxi"
            origin={origin}
            destination={destination}
            onIslandPress={handleLocationPress}
          />
        </View>
        
        <IslandLabel name="Orcas" position="orcas" offsetTop={headerHeight} />
        <IslandLabel name="San Juan" position="sanJuan" offsetTop={headerHeight} />
        <IslandLabel name="Lopez" position="lopez" offsetTop={headerHeight} />
        <IslandLabel name="Anacortes" position="anacortes" offsetTop={headerHeight} />
      </View>
      
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + webBottomInset + 16 }]}>
        {showFerryAlert && (
          <FerryAlert onDismiss={() => setShowFerryAlert(false)} />
        )}
        
        <View style={styles.selectionContainer}>
          <Card style={styles.locationCard} variant="flat">
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationName}>
                  {origin ? getLocationName(origin) : 'Tap the map'}
                </Text>
              </View>
            </View>
            
            <Button
              title=""
              onPress={handleSwap}
              variant="ghost"
              icon={<Ionicons name="swap-vertical" size={24} color={Colors.primary} />}
              style={styles.swapButton}
            />
            
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationName}>
                  {destination ? getLocationName(destination) : 'Tap another spot'}
                </Text>
              </View>
            </View>
          </Card>
          
          {routeInfo && (
            <Card style={styles.routeInfoCard}>
              <View style={styles.routeDetail}>
                <Ionicons name="time-outline" size={20} color={Colors.gray} />
                <Text style={styles.routeText}>{routeInfo.duration}</Text>
              </View>
              <View style={styles.routeDivider} />
              <View style={styles.routeDetail}>
                <Text style={styles.routePrice}>${routeInfo.basePrice}</Text>
                <Text style={styles.routePriceLabel}>per person</Text>
              </View>
            </Card>
          )}
        </View>
        
        <Button
          title={origin && destination ? "Find rides" : "Select route"}
          onPress={handleContinue}
          disabled={!origin || !destination}
          size="large"
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.water,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  locationCard: {
    padding: 20,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  locationName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  swapButton: {
    alignSelf: 'flex-end',
    marginVertical: 8,
    marginRight: -8,
  },
  routeInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  routeDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  routeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  routeDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.grayLight,
  },
  routePrice: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: Colors.secondary,
  },
  routePriceLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
  },
  continueButton: {
    marginTop: 4,
  },
});
