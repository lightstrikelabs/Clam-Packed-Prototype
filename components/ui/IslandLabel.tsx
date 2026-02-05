import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import { Island } from '@/lib/regions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface IslandLabelProps {
  island: Island;
  offsetTop?: number;
}

export default function IslandLabel({ island, offsetTop = 0 }: IslandLabelProps) {
  const top = offsetTop + (island.y * MAP_HEIGHT) - 10;
  const left = (island.x * SCREEN_WIDTH) - 40;

  return (
    <View style={[styles.container, { top, left }]} pointerEvents="none">
      <Text style={styles.text}>{island.name.split(' ')[0]}</Text>
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
