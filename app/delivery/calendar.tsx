import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { islands, deliverySchedule, DeliveryDate } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CalendarScreen() {
  const { island } = useLocalSearchParams<{ island: string }>();
  const insets = useSafeAreaInsets();
  const { setOrderDetails, orderDetails, selectedIsland } = useApp();
  const [selectedDate, setSelectedDate] = useState<DeliveryDate | null>(null);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const islandData = islands.find(i => i.id === island) || selectedIsland;
  const schedule = island ? deliverySchedule[island] : [];

  const handleDateSelect = (date: DeliveryDate) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedDate(date);
  };

  const handleOrderPress = () => {
    if (selectedDate && islandData) {
      setOrderDetails({ ...orderDetails, island: islandData, deliveryDate: selectedDate });
      router.push('/delivery/stores');
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Delivery Schedule"
        subtitle={islandData?.name}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + webBottomInset + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={22} color={Colors.primary} />
          <Text style={styles.infoText}>
            We deliver to {islandData?.name} every {islandData?.deliveryDay}. 
            Tap a date to see details and start your order.
          </Text>
        </View>
        
        {schedule.map((date, index) => (
          <Card
            key={index}
            variant={selectedDate?.date === date.date ? 'elevated' : 'default'}
            selected={selectedDate?.date === date.date}
            onPress={() => handleDateSelect(date)}
            style={styles.dateCard}
          >
            <View style={styles.dateRow}>
              <View style={styles.dateIconContainer}>
                <Ionicons 
                  name="cube" 
                  size={24} 
                  color={selectedDate?.date === date.date ? Colors.primary : Colors.gray} 
                />
              </View>
              <View style={styles.dateInfo}>
                <Text style={[
                  styles.dateText,
                  selectedDate?.date === date.date && styles.selectedDateText
                ]}>
                  {date.displayDate}
                </Text>
                <Text style={styles.deadlineText}>
                  Order by {date.orderDeadline}
                </Text>
              </View>
              {selectedDate?.date === date.date && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </View>
            
            {selectedDate?.date === date.date && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color={Colors.gray} />
                  <Text style={styles.detailText}>
                    Pickup at {islandData?.pickupLocation}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color={Colors.gray} />
                  <Text style={styles.detailText}>
                    8:30 AM - 4:50 PM
                  </Text>
                </View>
              </View>
            )}
          </Card>
        ))}
        
        {selectedDate && (
          <Button
            title="Order for this date"
            onPress={handleOrderPress}
            size="large"
            style={styles.orderButton}
          />
        )}
      </ScrollView>
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  dateCard: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  selectedDateText: {
    color: Colors.primary,
  },
  deadlineText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  orderButton: {
    marginTop: 24,
  },
});
