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

export default function OperatorScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleOptionPress = (option: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Operator Settings"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <View style={[styles.companyHeader, { backgroundColor: region.primaryColor }]}>
          <Ionicons name="business" size={32} color="#fff" />
          <Text style={styles.companyName}>{region.brandName} Logistics</Text>
          <Text style={styles.companyTagline}>{region.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Company Settings</Text>
        
        <Pressable onPress={() => handleOptionPress('schedule')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: region.primaryColor }]}>
                <Ionicons name="calendar-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Delivery Schedule</Text>
                <Text style={styles.optionSubtitle}>Set pickup and delivery days</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleOptionPress('pricing')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: region.secondaryColor }]}>
                <Ionicons name="pricetag-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Pricing</Text>
                <Text style={styles.optionSubtitle}>Delivery fees and taxi rates</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleOptionPress('captains')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="people-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Captains</Text>
                <Text style={styles.optionSubtitle}>Manage water taxi operators</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleOptionPress('stores')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="storefront-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Partner Stores</Text>
                <Text style={styles.optionSubtitle}>Manage store partnerships</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>

        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable onPress={() => handleOptionPress('notifications')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Notifications</Text>
                <Text style={styles.optionSubtitle}>Order and booking alerts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleOptionPress('support')}>
          <Card style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={[styles.optionIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#fff" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Support</Text>
                <Text style={styles.optionSubtitle}>Get help with your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </Card>
        </Pressable>
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
  },
  companyHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  companyName: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 28,
    color: '#fff',
    marginTop: 8,
  },
  companyTagline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  optionCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  optionSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
});
