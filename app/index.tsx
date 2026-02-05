import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import IslandMap from '@/components/IslandMap';
import ServiceButton from '@/components/ui/ServiceButton';
import FerryAlert from '@/components/ui/FerryAlert';
import IslandLabel from '@/components/ui/IslandLabel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { setMode, showFerryAlert, setShowFerryAlert } = useApp();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const topPadding = insets.top + webTopInset;

  const handleDeliveryPress = () => {
    setMode('delivery');
    router.push('/delivery/select');
  };

  const handleTaxiPress = () => {
    setMode('taxi');
    router.push('/taxi/routes');
  };

  const handleFerryAlertPress = () => {
    setMode('taxi');
    router.push('/taxi/routes');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={[styles.headerOverlay, { paddingTop: topPadding + 8 }]}>
          <Text style={styles.logo}>Clam Packed</Text>
          <Text style={styles.tagline}>San Juan Islands Logistics</Text>
        </View>
        
        <View style={{ marginTop: topPadding + 60 }}>
          <IslandMap mode="home" />
        </View>
        
        <IslandLabel name="Orcas" position="orcas" offsetTop={topPadding + 60} />
        <IslandLabel name="San Juan" position="sanJuan" offsetTop={topPadding + 60} />
        <IslandLabel name="Lopez" position="lopez" offsetTop={topPadding + 60} />
        <IslandLabel name="Anacortes" position="anacortes" offsetTop={topPadding + 60} />
      </View>
      
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        {showFerryAlert && (
          <FerryAlert 
            onPress={handleFerryAlertPress}
            onDismiss={() => setShowFerryAlert(false)}
          />
        )}
        
        <Text style={styles.prompt}>What do you need to move?</Text>
        
        <View style={styles.buttonRow}>
          <ServiceButton
            title="My Groceries"
            subtitle="Bulk delivery"
            icon="cube"
            color={Colors.primary}
            onPress={handleDeliveryPress}
          />
          <ServiceButton
            title="Me"
            subtitle="Water taxi"
            icon="boat"
            color={Colors.secondary}
            onPress={handleTaxiPress}
          />
        </View>
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
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 42,
    color: Colors.textLight,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  prompt: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
});
