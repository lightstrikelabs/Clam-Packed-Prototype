import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface IslandMapProps {
  mode: 'home' | 'delivery' | 'taxi';
  selectedIsland?: string | null;
  origin?: string | null;
  destination?: string | null;
  onIslandPress?: (islandId: string) => void;
  onMainlandPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const islandPositions = {
  orcas: { x: MAP_WIDTH * 0.55, y: MAP_HEIGHT * 0.22 },
  sanJuan: { x: MAP_WIDTH * 0.25, y: MAP_HEIGHT * 0.45 },
  lopez: { x: MAP_WIDTH * 0.55, y: MAP_HEIGHT * 0.65 },
  anacortes: { x: MAP_WIDTH * 0.78, y: MAP_HEIGHT * 0.82 },
};

function getIslandPath(id: string, cx: number, cy: number) {
  switch (id) {
    case 'orcas':
      return `M ${cx - 45} ${cy} 
              Q ${cx - 40} ${cy - 35} ${cx - 10} ${cy - 30}
              Q ${cx + 20} ${cy - 40} ${cx + 45} ${cy - 20}
              Q ${cx + 55} ${cy + 5} ${cx + 40} ${cy + 25}
              Q ${cx + 15} ${cy + 35} ${cx - 15} ${cy + 30}
              Q ${cx - 45} ${cy + 25} ${cx - 45} ${cy}`;
    case 'sanJuan':
      return `M ${cx - 35} ${cy - 15}
              Q ${cx - 20} ${cy - 35} ${cx + 15} ${cy - 30}
              Q ${cx + 40} ${cy - 20} ${cx + 35} ${cy + 10}
              Q ${cx + 30} ${cy + 30} ${cx} ${cy + 35}
              Q ${cx - 35} ${cy + 25} ${cx - 35} ${cy - 15}`;
    case 'lopez':
      return `M ${cx} ${cy - 40}
              Q ${cx + 25} ${cy - 35} ${cx + 30} ${cy - 10}
              Q ${cx + 35} ${cy + 20} ${cx + 15} ${cy + 40}
              Q ${cx - 10} ${cy + 45} ${cx - 20} ${cy + 20}
              Q ${cx - 25} ${cy - 10} ${cx} ${cy - 40}`;
    case 'anacortes':
      return `M ${cx - 40} ${cy + 30}
              L ${cx - 40} ${cy - 15}
              Q ${cx - 25} ${cy - 28} ${cx} ${cy - 23}
              Q ${cx + 25} ${cy - 18} ${cx + 40} ${cy}
              L ${cx + 40} ${cy + 30}
              Z`;
    default:
      return '';
  }
}

interface TouchableIslandProps {
  id: string;
  isSelected: boolean;
  isOrigin?: boolean;
  isDestination?: boolean;
  onPress: () => void;
  testID?: string;
}

function TouchableIsland({ id, isSelected, isOrigin, isDestination, onPress, testID }: TouchableIslandProps) {
  const scale = useSharedValue(1);
  const pos = islandPositions[id as keyof typeof islandPositions];
  
  const isHighlighted = isSelected || isOrigin || isDestination;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const size = id === 'anacortes' ? 100 : 90;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Select ${id}`}
      style={[
        styles.touchableIsland,
        animatedStyle,
        {
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: isHighlighted ? 3 : 0,
          borderColor: isOrigin ? Colors.secondary : isDestination ? Colors.success : Colors.primary,
        },
      ]}
    />
  );
}

function WaterBackground() {
  return (
    <G>
      <Defs>
        <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={Colors.water} />
          <Stop offset="50%" stopColor={Colors.waterLight} />
          <Stop offset="100%" stopColor={Colors.water} />
        </LinearGradient>
        <RadialGradient id="sunReflection" cx="70%" cy="20%">
          <Stop offset="0%" stopColor="#fff" stopOpacity={0.15} />
          <Stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Path
        d={`M 0 0 L ${MAP_WIDTH} 0 L ${MAP_WIDTH} ${MAP_HEIGHT} L 0 ${MAP_HEIGHT} Z`}
        fill="url(#waterGradient)"
      />
      <Ellipse
        cx={MAP_WIDTH * 0.7}
        cy={MAP_HEIGHT * 0.15}
        rx={80}
        ry={50}
        fill="url(#sunReflection)"
      />
      {[0.3, 0.5, 0.65, 0.8].map((yPos, i) => (
        <Path
          key={i}
          d={`M ${-20 + i * 10} ${MAP_HEIGHT * yPos}
              Q ${MAP_WIDTH * 0.25} ${MAP_HEIGHT * yPos - 6}
                ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * yPos}
              Q ${MAP_WIDTH * 0.75} ${MAP_HEIGHT * yPos + 6}
                ${MAP_WIDTH + 20} ${MAP_HEIGHT * yPos}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1.5}
        />
      ))}
    </G>
  );
}

function IslandSvg({ id, selected, isOrigin, isDestination }: { id: string; selected: boolean; isOrigin?: boolean; isDestination?: boolean }) {
  const pos = islandPositions[id as keyof typeof islandPositions];
  const isHighlighted = selected || isOrigin || isDestination;
  const highlightColor = isOrigin ? Colors.secondary : isDestination ? Colors.success : Colors.primary;

  return (
    <G>
      {isHighlighted && (
        <Path
          d={getIslandPath(id, pos.x, pos.y)}
          fill="none"
          stroke={highlightColor}
          strokeWidth={4}
          opacity={0.6}
        />
      )}
      <Path
        d={getIslandPath(id, pos.x, pos.y)}
        fill={isHighlighted ? Colors.land : Colors.landDark}
        stroke={Colors.sand}
        strokeWidth={2}
      />
      <Circle
        cx={pos.x}
        cy={pos.y + 5}
        r={4}
        fill={Colors.sand}
      />
    </G>
  );
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x}, ${y})`}>
      <Path
        d="M -12 5 Q -10 10 0 10 Q 10 10 12 5 L 10 0 L -10 0 Z"
        fill={Colors.surface}
        stroke={Colors.text}
        strokeWidth={0.5}
      />
      <Path
        d="M 0 0 L 0 -12 L 8 -4 Z"
        fill={Colors.secondary}
      />
    </G>
  );
}

function Whale({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x}, ${y})`}>
      <Ellipse
        cx={0}
        cy={0}
        rx={18}
        ry={8}
        fill={Colors.water}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
      />
      <Path
        d="M 15 0 Q 22 -8 25 0 Q 22 8 15 0"
        fill={Colors.water}
      />
      <Circle cx={-8} cy={-2} r={1.5} fill="rgba(255,255,255,0.5)" />
    </G>
  );
}

function RouteLine({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 25;

  return (
    <G>
      <Path
        d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
        fill="none"
        stroke={Colors.secondary}
        strokeWidth={3}
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
      <Circle cx={from.x} cy={from.y} r={8} fill={Colors.secondary} />
      <Circle cx={to.x} cy={to.y} r={8} fill={Colors.success} />
    </G>
  );
}

export default function IslandMap({ 
  mode, 
  selectedIsland, 
  origin, 
  destination,
  onIslandPress, 
  onMainlandPress 
}: IslandMapProps) {
  const showRouteLine = mode === 'taxi' && origin && destination;
  const originPos = origin ? islandPositions[origin as keyof typeof islandPositions] : null;
  const destPos = destination ? islandPositions[destination as keyof typeof islandPositions] : null;

  const handleIslandPress = (id: string) => {
    if (id === 'anacortes') {
      if (mode === 'taxi') {
        onIslandPress?.(id);
      } else {
        onMainlandPress?.();
      }
    } else {
      onIslandPress?.(id);
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
        <WaterBackground />
        
        <Boat x={MAP_WIDTH * 0.12} y={MAP_HEIGHT * 0.35} />
        <Whale x={MAP_WIDTH * 0.8} y={MAP_HEIGHT * 0.45} />
        <Boat x={MAP_WIDTH * 0.35} y={MAP_HEIGHT * 0.85} />

        {showRouteLine && originPos && destPos && (
          <RouteLine from={originPos} to={destPos} />
        )}

        <IslandSvg 
          id="anacortes" 
          selected={false}
          isOrigin={origin === 'anacortes'}
          isDestination={destination === 'anacortes'}
        />
        <IslandSvg 
          id="orcas" 
          selected={selectedIsland === 'orcas'}
          isOrigin={origin === 'orcas'}
          isDestination={destination === 'orcas'}
        />
        <IslandSvg 
          id="sanJuan" 
          selected={selectedIsland === 'sanJuan'}
          isOrigin={origin === 'sanJuan'}
          isDestination={destination === 'sanJuan'}
        />
        <IslandSvg 
          id="lopez" 
          selected={selectedIsland === 'lopez'}
          isOrigin={origin === 'lopez'}
          isDestination={destination === 'lopez'}
        />
      </Svg>

      {mode !== 'home' && (
        <>
          <TouchableIsland
            id="orcas"
            isSelected={selectedIsland === 'orcas'}
            isOrigin={origin === 'orcas'}
            isDestination={destination === 'orcas'}
            onPress={() => handleIslandPress('orcas')}
            testID="island-orcas"
          />
          <TouchableIsland
            id="sanJuan"
            isSelected={selectedIsland === 'sanJuan'}
            isOrigin={origin === 'sanJuan'}
            isDestination={destination === 'sanJuan'}
            onPress={() => handleIslandPress('sanJuan')}
            testID="island-sanjuan"
          />
          <TouchableIsland
            id="lopez"
            isSelected={selectedIsland === 'lopez'}
            isOrigin={origin === 'lopez'}
            isDestination={destination === 'lopez'}
            onPress={() => handleIslandPress('lopez')}
            testID="island-lopez"
          />
          {mode === 'taxi' && (
            <TouchableIsland
              id="anacortes"
              isSelected={false}
              isOrigin={origin === 'anacortes'}
              isDestination={destination === 'anacortes'}
              onPress={() => handleIslandPress('anacortes')}
              testID="island-anacortes"
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    position: 'relative',
  },
  touchableIsland: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});
