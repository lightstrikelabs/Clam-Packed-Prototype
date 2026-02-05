import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { getRidesForRoute, getLocationName, AvailableRide } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface RideCardProps {
  ride: AvailableRide;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function RideCard({ ride, isSelected, onSelect, index }: RideCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <Card
        onPress={onSelect}
        selected={isSelected}
        variant={isSelected ? 'elevated' : 'default'}
        style={styles.rideCard}
      >
        <View style={styles.rideHeader}>
          <View style={styles.captainInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={48} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.captainName}>{ride.captain.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{ride.captain.rating}</Text>
                <Text style={styles.boatName}>{ride.captain.boat}</Text>
              </View>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${ride.price}</Text>
            <Text style={styles.priceLabel}>per seat</Text>
          </View>
        </View>
        
        <View style={styles.rideDivider} />
        
        <View style={styles.rideDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color={Colors.gray} />
            <Text style={styles.detailText}>{ride.departureTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={18} color={Colors.gray} />
            <Text style={styles.detailText}>{ride.seatsLeft} seats left</Text>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

export default function RidesScreen() {
  const insets = useSafeAreaInsets();
  const { rideDetails, setRideDetails } = useApp();
  const [selectedRide, setSelectedRide] = useState<AvailableRide | null>(null);
  const [passengers, setPassengers] = useState(rideDetails.passengers || 1);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const rides = rideDetails.from && rideDetails.to 
    ? getRidesForRoute(rideDetails.from, rideDetails.to)
    : [];

  const handleRideSelect = (ride: AvailableRide) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedRide(ride);
  };

  const handlePassengerChange = (delta: number) => {
    const newCount = passengers + delta;
    if (newCount >= 1 && newCount <= (selectedRide?.seatsLeft || 10)) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setPassengers(newCount);
    }
  };

  const handleBook = () => {
    if (selectedRide) {
      setRideDetails({ ...rideDetails, ride: selectedRide, passengers });
      router.push('/taxi/booking');
    }
  };

  const totalPrice = selectedRide ? selectedRide.price * passengers : 0;

  return (
    <View style={styles.container}>
      <Header 
        title="Available rides"
        subtitle={`${getLocationName(rideDetails.from || '')} → ${getLocationName(rideDetails.to || '')}`}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {rides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="boat-outline" size={64} color={Colors.grayLight} />
            <Text style={styles.emptyTitle}>No rides available</Text>
            <Text style={styles.emptyText}>
              Check back later or try a different route
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {rides.length} ride{rides.length !== 1 ? 's' : ''} available
            </Text>
            
            {rides.map((ride, index) => (
              <RideCard
                key={ride.id}
                ride={ride}
                isSelected={selectedRide?.id === ride.id}
                onSelect={() => handleRideSelect(ride)}
                index={index}
              />
            ))}
            
            {selectedRide && (
              <Card style={styles.passengerCard}>
                <Text style={styles.passengerTitle}>How many passengers?</Text>
                <View style={styles.passengerControls}>
                  <Button
                    title=""
                    onPress={() => handlePassengerChange(-1)}
                    variant="outline"
                    icon={<Ionicons name="remove" size={24} color={Colors.primary} />}
                    disabled={passengers <= 1}
                    style={styles.counterButton}
                  />
                  <Text style={styles.passengerCount}>{passengers}</Text>
                  <Button
                    title=""
                    onPress={() => handlePassengerChange(1)}
                    variant="outline"
                    icon={<Ionicons name="add" size={24} color={Colors.primary} />}
                    disabled={passengers >= (selectedRide.seatsLeft || 1)}
                    style={styles.counterButton}
                  />
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>
      
      {selectedRide && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + webBottomInset + 20 }]}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>
          <Button
            title="Book this ride"
            onPress={handleBook}
            size="large"
            style={styles.bookButton}
          />
        </View>
      )}
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
    paddingBottom: 150,
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  rideCard: {
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  captainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  captainName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 13,
    color: Colors.text,
  },
  boatName: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginLeft: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: Colors.secondary,
  },
  priceLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    marginTop: -4,
  },
  rideDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 16,
  },
  rideDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    justifyContent: 'center',
  },
  selectedText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  passengerCard: {
    alignItems: 'center',
    padding: 24,
  },
  passengerTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 20,
  },
  passengerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  passengerCount: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 48,
    color: Colors.text,
    minWidth: 60,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
  },
  totalPrice: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 32,
    color: Colors.text,
  },
  bookButton: {
    flex: 1,
  },
});
