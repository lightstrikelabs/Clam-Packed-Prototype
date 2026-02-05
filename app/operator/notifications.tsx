import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

interface NotificationSetting {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const notificationSettings: NotificationSetting[] = [
  { id: 'new_orders', title: 'New Orders', subtitle: 'When a customer places a delivery order', icon: 'cube-outline', iconColor: '#3B82F6' },
  { id: 'taxi_bookings', title: 'Taxi Bookings', subtitle: 'When a customer books a water taxi', icon: 'boat-outline', iconColor: '#10B981' },
  { id: 'order_updates', title: 'Order Updates', subtitle: 'Status changes on active orders', icon: 'sync-outline', iconColor: '#8B5CF6' },
  { id: 'captain_alerts', title: 'Captain Alerts', subtitle: 'When captains need attention', icon: 'person-outline', iconColor: '#F59E0B' },
  { id: 'payment_received', title: 'Payments Received', subtitle: 'When payments are processed', icon: 'card-outline', iconColor: '#10B981' },
  { id: 'daily_summary', title: 'Daily Summary', subtitle: 'End of day report with stats', icon: 'stats-chart-outline', iconColor: '#6366F1' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { region } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    notificationSettings.forEach(s => {
      initial[s.id] = true;
    });
    return initial;
  });

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <Header 
        title="Notifications"
        onBackPress={() => router.back()}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottomInset + 20 }}
      >
        <View style={[styles.statusCard, { backgroundColor: region.primaryColor }]}>
          <Ionicons name="notifications" size={28} color="#fff" />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {enabledCount} of {notificationSettings.length} enabled
            </Text>
            <Text style={styles.statusSubtitle}>
              You'll receive alerts for enabled notifications
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        {notificationSettings.map((setting) => (
          <Card key={setting.id} style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIcon, { backgroundColor: `${setting.iconColor}20` }]}>
                <Ionicons name={setting.icon} size={20} color={setting.iconColor} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
              </View>
              <Switch
                value={settings[setting.id]}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: Colors.grayLight, true: `${region.primaryColor}80` }}
                thumbColor={settings[setting.id] ? region.primaryColor : '#f4f3f4'}
              />
            </View>
          </Card>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={region.primaryColor} />
          <Text style={styles.infoText}>
            Push notifications require the Expo Go app on your device. Email notifications are sent to your registered email address.
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  statusSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 8,
    padding: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  settingSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: Colors.gray,
    marginTop: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(57, 173, 184, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
});
