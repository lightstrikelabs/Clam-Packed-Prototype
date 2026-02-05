import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

const storeTypeLabels: Record<string, { label: string; color: string }> = {
  pdf: { label: 'PDF Upload', color: '#3B82F6' },
  pickup: { label: 'Pickup Code', color: '#10B981' },
  auto: { label: 'Automatic', color: '#8B5CF6' },
  note: { label: 'Order Note', color: '#F59E0B' },
  call: { label: 'Call Order', color: '#EF4444' },
  drop: { label: 'Drop Point', color: '#6366F1' },
};

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleAddStore = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Partner Stores"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <Text style={styles.description}>
          Manage your partner stores. Each store has a different order flow based on how they accept orders.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{region.stores.length} Partner Stores</Text>
          <Pressable style={styles.addButton} onPress={handleAddStore}>
            <Ionicons name="add" size={20} color={region.primaryColor} />
            <Text style={[styles.addText, { color: region.primaryColor }]}>Add</Text>
          </Pressable>
        </View>

        {region.stores.map((store) => {
          const typeInfo = storeTypeLabels[store.type] || { label: store.type, color: Colors.gray };
          return (
            <Card key={store.id} style={styles.storeCard}>
              <View style={styles.storeRow}>
                <View style={[styles.storeIcon, { backgroundColor: region.primaryColor }]}>
                  <Ionicons name="storefront" size={22} color="#fff" />
                </View>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeDescription} numberOfLines={1}>
                    {store.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.storeFooter}>
                <View style={[styles.typeBadge, { backgroundColor: `${typeInfo.color}20` }]}>
                  <View style={[styles.typeDot, { backgroundColor: typeInfo.color }]} />
                  <Text style={[styles.typeText, { color: typeInfo.color }]}>
                    {typeInfo.label}
                  </Text>
                </View>
                <Pressable style={styles.editButton}>
                  <Ionicons name="create-outline" size={18} color={Colors.gray} />
                </Pressable>
              </View>
            </Card>
          );
        })}

        <Card style={styles.legendCard}>
          <Text style={styles.legendTitle}>Order Flow Types</Text>
          <View style={styles.legendGrid}>
            {Object.entries(storeTypeLabels).map(([key, { label, color }]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </Card>
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
  description: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
  },
  storeCard: {
    marginBottom: 12,
    padding: 16,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  storeDescription: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  storeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  legendCard: {
    marginTop: 12,
    padding: 16,
    backgroundColor: Colors.grayLight,
  },
  legendTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
  },
});
