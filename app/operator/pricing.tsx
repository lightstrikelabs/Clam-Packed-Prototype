import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

export default function PricingScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const [baseDeliveryFee, setBaseDeliveryFee] = useState(region.baseDeliveryFee.toString());
  const [baseTaxiRate, setBaseTaxiRate] = useState(region.baseTaxiRate.toString());
  const [perMileFee, setPerMileFee] = useState('2.50');
  const [rushFee, setRushFee] = useState('15.00');

  return (
    <View style={styles.container}>
      <Header 
        title="Pricing"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <Text style={styles.sectionTitle}>Grocery Delivery</Text>
        
        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Base Delivery Fee</Text>
              <Text style={styles.priceHint}>Charged per delivery order</Text>
            </View>
            <View style={styles.priceInput}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={styles.input}
                value={baseDeliveryFee}
                onChangeText={setBaseDeliveryFee}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Per-Mile Surcharge</Text>
              <Text style={styles.priceHint}>Added for distant islands</Text>
            </View>
            <View style={styles.priceInput}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={styles.input}
                value={perMileFee}
                onChangeText={setPerMileFee}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Rush Delivery Fee</Text>
              <Text style={styles.priceHint}>Next-day delivery premium</Text>
            </View>
            <View style={styles.priceInput}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={styles.input}
                value={rushFee}
                onChangeText={setRushFee}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Water Taxi</Text>

        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Base Taxi Rate</Text>
              <Text style={styles.priceHint}>Per passenger, per trip</Text>
            </View>
            <View style={styles.priceInput}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={styles.input}
                value={baseTaxiRate}
                onChangeText={setBaseTaxiRate}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </Card>

        <View style={styles.summary}>
          <Ionicons name="calculator-outline" size={20} color={region.primaryColor} />
          <Text style={styles.summaryText}>
            Example: A delivery to Orcas Island would cost ${baseDeliveryFee || '0'} base + distance surcharge
          </Text>
        </View>
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
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  priceCard: {
    marginBottom: 12,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  priceHint: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },
  currency: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginRight: 4,
  },
  input: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    minWidth: 60,
    textAlign: 'right',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(57, 173, 184, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 16,
  },
  summaryText: {
    flex: 1,
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
});
