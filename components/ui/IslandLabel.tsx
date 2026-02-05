import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface IslandLabelProps {
  name: string;
  position: 'orcas' | 'sanJuan' | 'lopez' | 'anacortes';
  offsetTop?: number;
}

export default function IslandLabel({ name, position, offsetTop = 0 }: IslandLabelProps) {
  const getPosition = () => {
    switch (position) {
      case 'orcas':
        return { top: offsetTop + MAP_HEIGHT * 0.12, left: SCREEN_WIDTH * 0.38 };
      case 'sanJuan':
        return { top: offsetTop + MAP_HEIGHT * 0.37, left: SCREEN_WIDTH * 0.05 };
      case 'lopez':
        return { top: offsetTop + MAP_HEIGHT * 0.55, left: SCREEN_WIDTH * 0.38 };
      case 'anacortes':
        return { top: offsetTop + MAP_HEIGHT * 0.72, left: SCREEN_WIDTH * 0.6 };
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <View style={[styles.container, getPosition()]}>
      <Text style={styles.text}>{name}</Text>
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
