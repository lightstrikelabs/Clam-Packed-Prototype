import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import IslandMap from '@/components/IslandMap';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import IslandLabel from '@/components/ui/IslandLabel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SelectIslandScreen() {
  const insets = useSafeAreaInsets();
  const { setSelectedIslandId, setMode, region } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const headerHeight = insets.top + webTopInset + 50;

  const handleIslandPress = (islandId: string) => {
    setSelected(islandId);
  };

  const handleContinue = () => {
    if (selected) {
      setSelectedIslandId(selected);
      router.push(`/delivery/${selected}`);
    }
  };

  const handleBack = () => {
    setMode('home');
    router.back();
  };

  const selectedIsland = region.islands.find(i => i.id === selected);
  const deliverableIslands = region.islands.filter(i => !i.isMainland);

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
            region={region}
            selectedIsland={selected}
            onIslandPress={handleIslandPress}
          />
        </View>
        
        {region.islands.map((island) => (
          <IslandLabel 
            key={island.id}
            island={island} 
            offsetTop={headerHeight} 
          />
        ))}
      </View>
      
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + webBottomInset + 16 }]}>
        <Text style={styles.prompt}>Tap an island to select</Text>
        
        {selectedIsland && (
          <View style={[styles.selectionInfo, { backgroundColor: region.primaryColor + '20' }]}>
            <Text style={[styles.selectionTitle, { color: region.primaryColor }]}>{selectedIsland.name}</Text>
            {selectedIsland.deliveryDays && (
              <Text style={styles.selectionDetail}>
                Deliveries on {selectedIsland.deliveryDays.join(' & ')}
              </Text>
            )}
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectionTitle: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
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
