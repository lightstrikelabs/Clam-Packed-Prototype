import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { islands, getNextDelivery, deliverySchedule } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function IslandHubScreen() {
  const { island } = useLocalSearchParams<{ island: string }>();
  const insets = useSafeAreaInsets();
  const { setOrderDetails, orderDetails } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const islandData = islands.find(i => i.id === island);
  const nextDelivery = island ? getNextDelivery(island) : undefined;
  const schedule = island ? deliverySchedule[island] : [];

  if (!islandData) {
    return (
      <View style={styles.container}>
        <Header title="Island Not Found" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Island not found</Text>
        </View>
      </View>
    );
  }

  const handleOrderPress = () => {
    if (nextDelivery) {
      setOrderDetails({ ...orderDetails, island: islandData, deliveryDate: nextDelivery });
      router.push('/delivery/stores');
    }
  };

  const handleCalendarPress = () => {
    router.push({ pathname: '/delivery/calendar', params: { island } });
  };

  return (
    <View style={styles.container}>
      <Header title={islandData.name} subtitle="Nice choice!" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + webBottomInset + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.deliveryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="cube" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.cardLabel}>Next Delivery</Text>
          </View>
          
          <Text style={styles.deliveryDate}>{nextDelivery?.displayDate}</Text>
          
          <View style={styles.deadlineRow}>
            <Ionicons name="time-outline" size={18} color={Colors.warning} />
            <Text style={styles.deadlineText}>
              Order by {nextDelivery?.orderDeadline} to catch this one
            </Text>
          </View>
          
          <View style={styles.pickupRow}>
            <Ionicons name="location-outline" size={18} color={Colors.gray} />
            <Text style={styles.pickupText}>
              Pickup at {islandData.pickupLocation}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={18} color={Colors.gray} />
            <Text style={styles.pickupText}>8:30 AM - 4:50 PM</Text>
          </View>
        </Card>
        
        <View style={styles.buttonGroup}>
          <Button
            title="Let's order!"
            onPress={handleOrderPress}
            size="large"
            style={styles.orderButton}
          />
          
          <Button
            title="See full schedule"
            onPress={handleCalendarPress}
            variant="outline"
            size="medium"
          />
        </View>
        
        <Card style={styles.upcomingCard}>
          <Text style={styles.upcomingTitle}>Upcoming Deliveries</Text>
          {schedule.slice(0, 4).map((date, index) => (
            <View key={index} style={styles.scheduleRow}>
              <View style={styles.scheduleIconContainer}>
                <Ionicons 
                  name={index === 0 ? "cube" : "cube-outline"} 
                  size={18} 
                  color={index === 0 ? Colors.primary : Colors.gray} 
                />
              </View>
              <Text style={[
                styles.scheduleDate,
                index === 0 && styles.nextDate
              ]}>
                {date.displayDate}
              </Text>
              {index === 0 && (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextBadgeText}>Next</Text>
                </View>
              )}
            </View>
          ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.gray,
  },
  deliveryCard: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deliveryDate: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 36,
    color: Colors.text,
    marginBottom: 16,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 10,
  },
  deadlineText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickupText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  orderButton: {
    marginBottom: 4,
  },
  upcomingCard: {
    marginTop: 24,
  },
  upcomingTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  scheduleIconContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  scheduleDate: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: Colors.gray,
    flex: 1,
  },
  nextDate: {
    fontFamily: 'Lato_700Bold',
    color: Colors.text,
  },
  nextBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  nextBadgeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 12,
    color: Colors.textLight,
  },
});
