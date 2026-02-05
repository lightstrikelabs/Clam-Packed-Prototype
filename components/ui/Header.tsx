import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  transparent?: boolean;
  light?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
}

export default function Header({ 
  title, 
  subtitle,
  showBack = true, 
  transparent = false,
  light = false,
  rightAction,
  onBackPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const textColor = light ? Colors.textLight : Colors.text;

  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top + webTopInset + 8 },
      transparent && styles.transparent,
    ]}>
      <View style={styles.content}>
        {showBack ? (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={textColor} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <View style={styles.titleContainer}>
          {title && (
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: light ? 'rgba(255,255,255,0.7)' : Colors.gray }]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {rightAction || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
  },
  subtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    marginTop: 2,
  },
});
