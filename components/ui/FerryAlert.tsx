import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { ferryStatus } from '@/lib/mockData';

interface FerryAlertProps {
  onPress?: () => void;
  onDismiss?: () => void;
}

export default function FerryAlert({ onPress, onDismiss }: FerryAlertProps) {
  if (!ferryStatus.hasDisruption) return null;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const handleDismiss = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDismiss?.();
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Pressable onPress={handlePress} style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={18} color={Colors.warning} />
        </View>
        <Text style={styles.text}>{ferryStatus.message}</Text>
        <Pressable onPress={handleDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={18} color={Colors.text} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: Colors.warning,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(237, 151, 57, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: Colors.text,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
