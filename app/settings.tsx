import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { region, setRegionById, availableRegions } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleRegionSelect = (regionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setRegionById(regionId);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Admin Settings"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.adminBadgeText}>Admin Only</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Select Region</Text>
        <Text style={styles.sectionSubtitle}>
          Configure which island community this app serves
        </Text>
        
        {availableRegions.map((r) => {
          const isSelected = region.id === r.id;
          const cardStyle: ViewStyle = {
            ...styles.regionCard,
            ...(isSelected ? { borderColor: r.primaryColor, borderWidth: 2 } : {}),
          };
          
          return (
            <Pressable
              key={r.id}
              onPress={() => handleRegionSelect(r.id)}
            >
              <Card style={cardStyle}>
                <View style={styles.regionHeader}>
                  <View style={[styles.regionBadge, { backgroundColor: r.primaryColor }]}>
                    <Ionicons name="location" size={20} color="#fff" />
                  </View>
                  <View style={styles.regionInfo}>
                    <Text style={styles.regionName}>{r.name}</Text>
                    <Text style={styles.regionTagline}>{r.tagline}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: r.primaryColor }]}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </View>
                
                <View style={styles.regionDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="boat-outline" size={16} color={Colors.gray} />
                    <Text style={styles.detailText}>
                      {r.islands.filter(i => !i.isMainland).length} islands
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="storefront-outline" size={16} color={Colors.gray} />
                    <Text style={styles.detailText}>
                      {r.stores.length} stores
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={16} color={Colors.gray} />
                    <Text style={styles.detailText}>
                      {r.captains.length} captains
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.brandName}>
                  Powered by {r.brandName}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#6B7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  adminBadgeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
  },
  regionCard: {
    marginBottom: 16,
    padding: 16,
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  regionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  regionTagline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
  },
  brandName: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 8,
  },
});
