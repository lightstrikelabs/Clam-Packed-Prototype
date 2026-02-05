import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { getLocationName } from '@/lib/mockData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface WaveProps {
  index: number;
}

function Wave({ index }: WaveProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    const delay = index * 200;
    
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-30, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.4, { duration: 1500 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.wave,
        animatedStyle,
        { 
          bottom: 40 + index * 25,
        },
      ]}
    >
      <View style={styles.waveShape} />
    </Animated.View>
  );
}

export default function TaxiConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { rideDetails, resetRide, setMode } = useApp();
  const boatScale = useSharedValue(0);
  const boatRotate = useSharedValue(0);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    boatScale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 80 })
    );

    boatRotate.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const boatAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: boatScale.value },
      { rotate: `${boatRotate.value}deg` },
    ],
  }));

  const handleDone = () => {
    resetRide();
    setMode('home');
    router.replace('/');
  };

  const handleAddGroceries = () => {
    setMode('delivery');
    router.push('/delivery/select');
  };

  const totalPrice = rideDetails.ride ? rideDetails.ride.price * (rideDetails.passengers || 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Wave key={i} index={i} />
        ))}
      </View>
      
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) + 60 }]}>
        <Animated.View style={[styles.boatCircle, boatAnimatedStyle]}>
          <Ionicons name="boat" size={64} color={Colors.textLight} />
        </Animated.View>
        
        <Animated.Text 
          entering={FadeIn.delay(400).duration(500)}
          style={styles.title}
        >
          All aboard!
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeIn.delay(600).duration(500)}
          style={styles.subtitle}
        >
          Your water taxi is booked
        </Animated.Text>
        
        <Animated.View 
          entering={SlideInUp.delay(800).duration(500)}
          style={styles.summaryCard}
        >
          <Card variant="elevated" style={styles.card}>
            <View style={styles.routeDisplay}>
              <View style={styles.routeEndpoint}>
                <View style={[styles.routeDot, { backgroundColor: Colors.secondary }]} />
                <Text style={styles.routeText}>
                  {getLocationName(rideDetails.from || '')}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={Colors.gray} />
              <View style={styles.routeEndpoint}>
                <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.routeText}>
                  {getLocationName(rideDetails.to || '')}
                </Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Ionicons name="person-circle" size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Captain</Text>
              <Text style={styles.summaryValue}>{rideDetails.ride?.captain.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Departure</Text>
              <Text style={styles.summaryValue}>{rideDetails.ride?.departureTime}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Ionicons name="cash" size={24} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryPrice}>${totalPrice}</Text>
            </View>
          </Card>
        </Animated.View>
        
        <Animated.View 
          entering={FadeIn.delay(1000).duration(500)}
          style={styles.crossSell}
        >
          <Card style={styles.crossSellCard} variant="flat">
            <View style={styles.crossSellIcon}>
              <Ionicons name="cube" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.crossSellTitle}>Need groceries on that island?</Text>
            <Text style={styles.crossSellText}>
              Order bulk delivery to have them waiting
            </Text>
            <Button
              title="Add groceries"
              onPress={handleAddGroceries}
              variant="secondary"
              size="small"
              style={styles.crossSellButton}
            />
          </Card>
        </Animated.View>
      </View>
      
      <View style={[styles.footer, { paddingBottom: insets.bottom + webBottomInset + 20 }]}>
        <Button
          title="Done"
          onPress={handleDone}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.water,
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  wave: {
    position: 'absolute',
    left: -50,
    right: -50,
    height: 20,
  },
  waveShape: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  boatCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 42,
    color: Colors.textLight,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 32,
  },
  summaryCard: {
    width: '100%',
    marginBottom: 24,
  },
  card: {
    padding: 20,
  },
  routeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeEndpoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    flex: 1,
  },
  summaryValue: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  summaryPrice: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 24,
    color: Colors.secondary,
  },
  crossSell: {
    width: '100%',
  },
  crossSellCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  crossSellIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  crossSellTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  crossSellText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
    textAlign: 'center',
  },
  crossSellButton: {
    paddingHorizontal: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
