import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { stores } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const { orderDetails, setOrderDetails } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleStorePress = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setOrderDetails({ ...orderDetails, store });
      router.push(`/delivery/order/${storeId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Pick your store"
        subtitle={`Delivering to ${orderDetails.island?.shortName}`}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + webBottomInset + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Select a store to start building your order
        </Text>
        
        <View style={styles.storeGrid}>
          {stores.map((store) => (
            <Card
              key={store.id}
              onPress={() => handleStorePress(store.id)}
              style={styles.storeCard}
              variant="elevated"
            >
              <View style={[styles.storeIcon, { backgroundColor: `${store.color}20` }]}>
                <Ionicons 
                  name={store.logo as keyof typeof Ionicons.glyphMap} 
                  size={32} 
                  color={store.color} 
                />
              </View>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeType}>
                {getFlowTypeLabel(store.flowType)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function getFlowTypeLabel(flowType: string): string {
  switch (flowType) {
    case 'pdf_upload':
      return 'Upload shopping list';
    case 'pickup_code':
      return 'Paste pickup code';
    case 'automatic':
      return 'Auto-notified';
    case 'order_note':
      return 'Add order note';
    case 'call_order':
      return 'Call to order';
    case 'drop_point':
      return 'Select drop point';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  storeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  storeCard: {
    width: '47%',
    alignItems: 'center',
    padding: 20,
  },
  storeIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  storeName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  storeType: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
});
