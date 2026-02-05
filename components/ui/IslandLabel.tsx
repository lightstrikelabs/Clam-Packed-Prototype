import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import { Island } from '@/lib/regions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_PADDING = 50;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface IslandLabelProps {
  island: Island;
  offsetTop?: number;
}

// Get a short display name for the island
function getShortName(name: string): string {
  // For "San Juan Island", show "San Juan"
  // For "Orcas Island", show "Orcas"
  // For "Lopez Island", show "Lopez"
  const words = name.split(' ');
  if (words.length >= 2 && words[0] === 'San') {
    return `${words[0]} ${words[1]}`;
  }
  return words[0];
}

export default function IslandLabel({ island, offsetTop = 0 }: IslandLabelProps) {
  // Apply same padding calculation as IslandMap
  const usableWidth = SCREEN_WIDTH - (MAP_PADDING * 2);
  const usableHeight = MAP_HEIGHT - (MAP_PADDING * 2);
  const cx = MAP_PADDING + (island.x * usableWidth);
  const cy = MAP_PADDING + (island.y * usableHeight);
  
  const top = offsetTop + cy - 10;
  const left = cx - 40;

  return (
    <View style={[styles.container, { top, left }]} pointerEvents="none">
      <Text style={styles.text}>{getShortName(island.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    pointerEvents: 'none',
  },
  text: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
});
