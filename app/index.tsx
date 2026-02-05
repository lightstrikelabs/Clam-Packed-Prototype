import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import IslandMap from '@/components/IslandMap';
import ServiceButton from '@/components/ui/ServiceButton';
import IslandLabel from '@/components/ui/IslandLabel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAPS_TO_UNLOCK = 5;
const TAP_TIMEOUT = 2000;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { setMode, region } = useApp();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const topPadding = insets.top + webTopInset;

  const [adminMode, setAdminMode] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);
  
  const logoScale = useSharedValue(1);
  const adminButtonOpacity = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const adminButtonsStyle = useAnimatedStyle(() => ({
    opacity: adminButtonOpacity.value,
    pointerEvents: adminButtonOpacity.value > 0.5 ? 'auto' : 'none',
  }));

  const handleLogoPress = () => {
    tapCount.current += 1;
    
    logoScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    if (tapCount.current >= TAPS_TO_UNLOCK) {
      const newAdminMode = !adminMode;
      setAdminMode(newAdminMode);
      adminButtonOpacity.value = withSpring(newAdminMode ? 1 : 0);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          newAdminMode 
            ? Haptics.NotificationFeedbackType.Success 
            : Haptics.NotificationFeedbackType.Warning
        );
      }
      tapCount.current = 0;
    } else {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, TAP_TIMEOUT);
    }
  };

  const handleDeliveryPress = () => {
    setMode('delivery');
    router.push('/delivery/select');
  };

  const handleTaxiPress = () => {
    setMode('taxi');
    router.push('/taxi/routes');
  };

  const handleAdminPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/settings');
  };

  const handleOperatorPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/operator');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={[styles.headerOverlay, { paddingTop: topPadding + 8 }]}>
          <Animated.View style={[styles.headerButton, adminButtonsStyle]}>
            <Pressable 
              onPress={handleAdminPress}
              hitSlop={10}
              testID="admin-button"
              accessibilityLabel="Admin Settings"
              style={styles.iconButton}
            >
              <Ionicons name="key-outline" size={22} color="#fff" />
            </Pressable>
          </Animated.View>
          <Pressable onPress={handleLogoPress} style={styles.titleContainer}>
            <Animated.View style={logoAnimatedStyle}>
              <Text style={styles.logo}>{region.brandName}</Text>
            </Animated.View>
            <Text style={styles.tagline}>{region.name}</Text>
            {adminMode && (
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={10} color="#fff" />
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </Pressable>
          <Animated.View style={[styles.headerButton, adminButtonsStyle]}>
            <Pressable 
              onPress={handleOperatorPress}
              hitSlop={10}
              testID="operator-button"
              accessibilityLabel="Operator Settings"
              style={styles.iconButton}
            >
              <Ionicons name="briefcase-outline" size={22} color="#fff" />
            </Pressable>
          </Animated.View>
        </View>
        
        <View style={{ marginTop: topPadding + 60 }}>
          <IslandMap mode="home" region={region} />
        </View>
        
        {region.islands.map((island) => (
          <IslandLabel 
            key={island.id}
            island={island} 
            offsetTop={topPadding + 60} 
          />
        ))}
      </View>
      
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Text style={styles.prompt}>What do you need to move?</Text>
        
        <View style={styles.buttonRow}>
          <ServiceButton
            title="My Groceries"
            subtitle="Bulk delivery"
            icon="cube"
            color={region.primaryColor}
            onPress={handleDeliveryPress}
          />
          <ServiceButton
            title="Me"
            subtitle="Water taxi"
            icon="boat"
            color={region.secondaryColor}
            onPress={handleTaxiPress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.water,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginTop: 4,
  },
  adminBadgeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 10,
    color: '#fff',
    textTransform: 'uppercase',
  },
  logo: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 36,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: -4,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  prompt: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
