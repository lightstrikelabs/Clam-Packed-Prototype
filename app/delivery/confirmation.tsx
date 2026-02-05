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
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ConfettiPieceProps {
  index: number;
  color: string;
}

function ConfettiPiece({ index, color }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 200;
    const delay = index * 50;

    translateY.value = withDelay(
      delay,
      withTiming(400, { duration: 2000, easing: Easing.out(Easing.ease) })
    );
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(randomX, { duration: 1000 }),
        withTiming(randomX * 1.2, { duration: 1000 })
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration: 2000 })
    );
    opacity.value = withDelay(
      1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const size = 8 + Math.random() * 8;
  const startX = Math.random() * 300 - 150;

  return (
    <Animated.View
      style={[
        styles.confetti,
        animatedStyle,
        { 
          backgroundColor: color,
          width: size,
          height: size * 1.5,
          left: '50%',
          marginLeft: startX,
        },
      ]}
    />
  );
}

export default function DeliveryConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { orderDetails, resetOrder, setMode } = useApp();
  const checkScale = useSharedValue(0);
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const confettiColors = [
    Colors.primary,
    Colors.secondary,
    Colors.success,
    '#FFD700',
    '#FF69B4',
    '#87CEEB',
  ];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    checkScale.value = withDelay(
      300,
      withSpring(1, { damping: 8, stiffness: 100 })
    );
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleDone = () => {
    resetOrder();
    setMode('home');
    router.replace('/');
  };

  const handleAddWaterTaxi = () => {
    setMode('taxi');
    router.push('/taxi/routes');
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece 
          key={i} 
          index={i} 
          color={confettiColors[i % confettiColors.length]} 
        />
      ))}
      
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) + 60 }]}>
        <Animated.View style={[styles.checkCircle, checkAnimatedStyle]}>
          <Ionicons name="checkmark" size={64} color={Colors.textLight} />
        </Animated.View>
        
        <Animated.Text 
          entering={FadeIn.delay(400).duration(500)}
          style={styles.title}
        >
          Order confirmed!
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeIn.delay(600).duration(500)}
          style={styles.subtitle}
        >
          Your groceries are on their way
        </Animated.Text>
        
        <Animated.View 
          entering={SlideInUp.delay(800).duration(500)}
          style={styles.summaryCard}
        >
          <Card variant="elevated" style={styles.card}>
            <View style={styles.summaryRow}>
              <Ionicons name="cube" size={24} color={Colors.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Store</Text>
                <Text style={styles.summaryValue}>{orderDetails.store?.name}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Ionicons name="location" size={24} color={Colors.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Delivery to</Text>
                <Text style={styles.summaryValue}>{orderDetails.island?.name}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Pickup date</Text>
                <Text style={styles.summaryValue}>{orderDetails.deliveryDate?.displayDate}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
        
        <Animated.View 
          entering={FadeIn.delay(1000).duration(500)}
          style={styles.crossSell}
        >
          <Card style={styles.crossSellCard} variant="flat">
            <View style={styles.crossSellIcon}>
              <Ionicons name="boat" size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.crossSellTitle}>Need a ride too?</Text>
            <Text style={styles.crossSellText}>
              Book a water taxi to meet your groceries
            </Text>
            <Button
              title="Book water taxi"
              onPress={handleAddWaterTaxi}
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
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 42,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: Colors.gray,
    marginBottom: 32,
  },
  summaryCard: {
    width: '100%',
    marginBottom: 24,
  },
  card: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 16,
  },
  crossSell: {
    width: '100%',
  },
  crossSellCard: {
    alignItems: 'center',
    padding: 24,
  },
  crossSellIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(237, 151, 57, 0.15)',
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
