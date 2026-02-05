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

export default function CaptainsScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleAddCaptain = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Captains"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: region.primaryColor }]}>
            <Text style={styles.statNumber}>{region.captains.length}</Text>
            <Text style={styles.statLabel}>Active Captains</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: region.secondaryColor }]}>
            <Text style={styles.statNumber}>
              {region.captains.reduce((sum, c) => sum + c.trips, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Captains</Text>
          <Pressable style={styles.addButton} onPress={handleAddCaptain}>
            <Ionicons name="add" size={20} color={region.primaryColor} />
            <Text style={[styles.addText, { color: region.primaryColor }]}>Add</Text>
          </Pressable>
        </View>

        {region.captains.map((captain) => (
          <Card key={captain.id} style={styles.captainCard}>
            <View style={styles.captainRow}>
              <View style={[styles.avatar, { backgroundColor: region.primaryColor }]}>
                <Text style={styles.avatarText}>
                  {captain.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.captainInfo}>
                <Text style={styles.captainName}>{captain.name}</Text>
                <Text style={styles.captainBoat}>{captain.boat}</Text>
              </View>
              <View style={styles.captainStats}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{captain.rating}</Text>
                </View>
                <Text style={styles.tripsText}>{captain.trips} trips</Text>
              </View>
            </View>
            
            <View style={styles.actionRow}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="call-outline" size={18} color={Colors.gray} />
                <Text style={styles.actionText}>Call</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="calendar-outline" size={18} color={Colors.gray} />
                <Text style={styles.actionText}>Schedule</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="create-outline" size={18} color={Colors.gray} />
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
            </View>
          </Card>
        ))}
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 36,
    color: '#fff',
  },
  statLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
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
  captainCard: {
    marginBottom: 12,
    padding: 16,
  },
  captainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  captainInfo: {
    flex: 1,
  },
  captainName: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  captainBoat: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  captainStats: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 13,
    color: '#F59E0B',
  },
  tripsText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
  },
});
