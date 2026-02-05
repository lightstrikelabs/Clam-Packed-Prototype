import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { getLocationName } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { rideDetails } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleConfirm = () => {
    router.push('/taxi/confirmation');
  };

  const totalPrice = rideDetails.ride ? rideDetails.ride.price * (rideDetails.passengers || 1) : 0;

  return (
    <View style={styles.container}>
      <Header title="Confirm booking" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + webBottomInset + 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeLabel}>Your trip</Text>
          </View>
          
          <View style={styles.routeVisual}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.routeLocation}>
                {getLocationName(rideDetails.from || '')}
              </Text>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.routeLocation}>
                {getLocationName(rideDetails.to || '')}
              </Text>
            </View>
          </View>
          
          <View style={styles.tripDivider} />
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailRow}>
              <Ionicons name="person-circle" size={24} color={Colors.primary} />
              <Text style={styles.tripDetailText}>{rideDetails.ride?.captain.name}</Text>
            </View>
            <View style={styles.tripDetailRow}>
              <Ionicons name="boat" size={24} color={Colors.primary} />
              <Text style={styles.tripDetailText}>{rideDetails.ride?.captain.boat}</Text>
            </View>
            <View style={styles.tripDetailRow}>
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.tripDetailText}>{rideDetails.ride?.departureTime}</Text>
            </View>
            <View style={styles.tripDetailRow}>
              <Ionicons name="people" size={24} color={Colors.primary} />
              <Text style={styles.tripDetailText}>
                {rideDetails.passengers} passenger{rideDetails.passengers !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Contact info</Text>
        <Text style={styles.sectionSubtitle}>
          So your captain can reach you if needed
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={Colors.gray}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 123-4567"
            placeholderTextColor={Colors.gray}
            keyboardType="phone-pad"
          />
        </View>
        
        <Card style={styles.pricingCard} variant="flat">
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>
              {rideDetails.passengers} x ${rideDetails.ride?.price}
            </Text>
            <Text style={styles.priceRowValue}>
              ${totalPrice}
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </Card>
      </ScrollView>
      
      <View style={[styles.footer, { paddingBottom: insets.bottom + webBottomInset + 20 }]}>
        <Button
          title={`Confirm booking - $${totalPrice}`}
          onPress={handleConfirm}
          size="large"
        />
      </View>
    </View>
  );
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
  summaryCard: {
    marginBottom: 28,
  },
  routeHeader: {
    marginBottom: 16,
  },
  routeLabel: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  routeVisual: {
    paddingLeft: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  routeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  routeLocation: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: Colors.grayLight,
    marginLeft: 7,
    marginVertical: 4,
  },
  tripDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 20,
  },
  tripDetails: {
    gap: 14,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tripDetailText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.text,
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  pricingCard: {
    marginTop: 12,
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.gray,
  },
  priceRowValue: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.primary,
    opacity: 0.2,
    marginVertical: 14,
  },
  totalLabel: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: Colors.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
});
