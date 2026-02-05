import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const [schedules, setSchedules] = useState(() => {
    const initial: Record<string, string[]> = {};
    region.islands.filter(i => !i.isMainland).forEach(island => {
      initial[island.id] = island.deliveryDays || ['Tuesday', 'Friday'];
    });
    return initial;
  });

  const toggleDay = (islandId: string, day: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSchedules(prev => {
      const current = prev[islandId] || [];
      if (current.includes(day)) {
        return { ...prev, [islandId]: current.filter(d => d !== day) };
      } else {
        return { ...prev, [islandId]: [...current, day] };
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Delivery Schedule"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <Text style={styles.description}>
          Set which days deliveries are available for each island. Customers can only book deliveries on selected days.
        </Text>

        {region.islands.filter(i => !i.isMainland).map((island) => (
          <Card key={island.id} style={styles.islandCard}>
            <View style={styles.islandHeader}>
              <View style={[styles.islandIcon, { backgroundColor: region.primaryColor }]}>
                <Ionicons name="location" size={18} color="#fff" />
              </View>
              <Text style={styles.islandName}>{island.name}</Text>
            </View>
            
            <View style={styles.daysGrid}>
              {DAYS.map((day) => {
                const isSelected = (schedules[island.id] || []).includes(day);
                return (
                  <Pressable
                    key={day}
                    style={[
                      styles.dayChip,
                      isSelected && { backgroundColor: region.primaryColor }
                    ]}
                    onPress={() => toggleDay(island.id, day)}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={region.primaryColor} />
          <Text style={styles.infoText}>
            Changes will apply to future bookings only. Existing deliveries will not be affected.
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
  description: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  islandCard: {
    marginBottom: 16,
    padding: 16,
  },
  islandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  islandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  islandName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.grayLight,
  },
  dayText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 13,
    color: Colors.gray,
  },
  dayTextSelected: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(57, 173, 184, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
});
