import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { islands } from '@/lib/mockData';
import IslandMap from '@/components/IslandMap';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import IslandLabel from '@/components/ui/IslandLabel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SelectIslandScreen() {
  const insets = useSafeAreaInsets();
  const { setSelectedIsland, setMode } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const headerHeight = insets.top + webTopInset + 50;

  const handleIslandPress = (islandId: string) => {
    setSelected(islandId);
  };

  const handleContinue = () => {
    const island = islands.find(i => i.id === selected);
    if (island) {
      setSelectedIsland(island);
      router.push(`/delivery/${selected}`);
    }
  };

  const handleBack = () => {
    setMode('home');
    router.back();
  };

  const selectedIsland = islands.find(i => i.id === selected);

  return (
    <View style={styles.container}>
      <Header 
        title="Where are we delivering?"
        transparent
        light
        onBackPress={handleBack}
      />
      
      <View style={styles.mapContainer}>
        <View style={{ marginTop: headerHeight }}>
          <IslandMap
            mode="delivery"
            selectedIsland={selected}
            onIslandPress={handleIslandPress}
          />
        </View>
        
        <IslandLabel name="Orcas" position="orcas" offsetTop={headerHeight} />
        <IslandLabel name="San Juan" position="sanJuan" offsetTop={headerHeight} />
        <IslandLabel name="Lopez" position="lopez" offsetTop={headerHeight} />
      </View>
      
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + webBottomInset + 16 }]}>
        <Text style={styles.prompt}>Tap an island to select</Text>
        
        {selectedIsland && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionTitle}>{selectedIsland.name}</Text>
            <Text style={styles.selectionDetail}>
              Deliveries on {selectedIsland.deliveryDay}s
            </Text>
            <Text style={styles.selectionDetail}>
              Pickup at {selectedIsland.pickupLocation}
            </Text>
          </View>
        )}
        
        <Button
          title={selected ? "Let's go!" : "Select an island"}
          onPress={handleContinue}
          disabled={!selected}
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
    paddingTop: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  prompt: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectionInfo: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectionTitle: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: Colors.primary,
    marginBottom: 8,
  },
  selectionDetail: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: Colors.text,
    marginTop: 4,
  },
  continueButton: {
    marginTop: 8,
  },
});
