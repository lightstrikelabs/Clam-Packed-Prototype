import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.65;

interface IslandLabelProps {
  name: string;
  position: 'orcas' | 'sanJuan' | 'lopez' | 'anacortes';
}

export default function IslandLabel({ name, position }: IslandLabelProps) {
  const getPosition = () => {
    switch (position) {
      case 'orcas':
        return { top: MAP_HEIGHT * 0.12, left: SCREEN_WIDTH * 0.42 };
      case 'sanJuan':
        return { top: MAP_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.12 };
      case 'lopez':
        return { top: MAP_HEIGHT * 0.52, left: SCREEN_WIDTH * 0.4 };
      case 'anacortes':
        return { top: MAP_HEIGHT * 0.68, left: SCREEN_WIDTH * 0.68 };
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
});
