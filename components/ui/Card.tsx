import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat';
  selected?: boolean;
}

export default function Card({ children, onPress, style, variant = 'default', selected = false }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const getCardStyle = () => {
    const baseStyles = [styles.card];
    
    switch (variant) {
      case 'elevated':
        baseStyles.push(styles.elevated);
        break;
      case 'flat':
        baseStyles.push(styles.flat);
        break;
      default:
        baseStyles.push(styles.default);
    }
    
    if (selected) {
      baseStyles.push(styles.selected);
    }
    
    return baseStyles;
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, ...getCardStyle(), style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.surface,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  flat: {
    backgroundColor: Colors.primaryLight,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});
