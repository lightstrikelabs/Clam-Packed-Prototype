import React from 'react';
import { View, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Island, Region } from '@/lib/regions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface IslandMapProps {
  mode: 'home' | 'delivery' | 'taxi';
  region: Region;
  selectedIsland?: string | null;
  origin?: string | null;
  destination?: string | null;
  onIslandPress?: (islandId: string) => void;
  onMainlandPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getIslandPath(island: Island, mapWidth: number, mapHeight: number) {
  const cx = island.x * mapWidth;
  const cy = island.y * mapHeight;
  const size = island.isMainland ? 40 : 35;
  
  if (island.isMainland) {
    return `M ${cx - size} ${cy + 30}
            L ${cx - size} ${cy - 15}
            Q ${cx - size * 0.6} ${cy - 28} ${cx} ${cy - 23}
            Q ${cx + size * 0.6} ${cy - 18} ${cx + size} ${cy}
            L ${cx + size} ${cy + 30}
            Z`;
  }
  
  const seed = island.id.charCodeAt(0) % 3;
  switch (seed) {
    case 0:
      return `M ${cx - size} ${cy} 
              Q ${cx - size * 0.8} ${cy - size} ${cx - size * 0.2} ${cy - size * 0.85}
              Q ${cx + size * 0.4} ${cy - size * 1.1} ${cx + size} ${cy - size * 0.5}
              Q ${cx + size * 1.2} ${cy + size * 0.1} ${cx + size * 0.9} ${cy + size * 0.7}
              Q ${cx + size * 0.3} ${cy + size} ${cx - size * 0.3} ${cy + size * 0.85}
              Q ${cx - size} ${cy + size * 0.7} ${cx - size} ${cy}`;
    case 1:
      return `M ${cx - size * 0.8} ${cy - size * 0.4}
              Q ${cx - size * 0.4} ${cy - size} ${cx + size * 0.3} ${cy - size * 0.85}
              Q ${cx + size} ${cy - size * 0.5} ${cx + size * 0.8} ${cy + size * 0.25}
              Q ${cx + size * 0.7} ${cy + size * 0.85} ${cx} ${cy + size}
              Q ${cx - size * 0.8} ${cy + size * 0.7} ${cx - size * 0.8} ${cy - size * 0.4}`;
    default:
      return `M ${cx} ${cy - size}
              Q ${cx + size * 0.6} ${cy - size * 0.85} ${cx + size * 0.75} ${cy - size * 0.25}
              Q ${cx + size * 0.85} ${cy + size * 0.5} ${cx + size * 0.35} ${cy + size}
              Q ${cx - size * 0.25} ${cy + size * 1.1} ${cx - size * 0.5} ${cy + size * 0.5}
              Q ${cx - size * 0.6} ${cy - size * 0.25} ${cx} ${cy - size}`;
  }
}

interface TouchableIslandProps {
  island: Island;
  mapWidth: number;
  mapHeight: number;
  isSelected: boolean;
  isOrigin?: boolean;
  isDestination?: boolean;
  onPress: () => void;
  primaryColor: string;
  secondaryColor: string;
}

function TouchableIsland({ 
  island, 
  mapWidth, 
  mapHeight, 
  isSelected, 
  isOrigin, 
  isDestination, 
  onPress,
  primaryColor,
  secondaryColor,
}: TouchableIslandProps) {
  const scale = useSharedValue(1);
  const cx = island.x * mapWidth;
  const cy = island.y * mapHeight;
  
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

  const size = island.isMainland ? 100 : 90;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`island-${island.id.toLowerCase()}`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${island.name}`}
      style={[
        styles.touchableIsland,
        animatedStyle,
        {
          left: cx - size / 2,
          top: cy - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: isHighlighted ? 3 : 0,
          borderColor: isOrigin ? secondaryColor : isDestination ? Colors.success : primaryColor,
        },
      ]}
    />
  );
}

function WaterBackground({ primaryColor }: { primaryColor: string }) {
  const waterColor = Colors.water;
  const waterLight = Colors.waterLight;
  
  return (
    <G>
      <Defs>
        <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={waterColor} />
          <Stop offset="50%" stopColor={waterLight} />
          <Stop offset="100%" stopColor={waterColor} />
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

function IslandSvg({ 
  island, 
  mapWidth, 
  mapHeight, 
  selected, 
  isOrigin, 
  isDestination,
  primaryColor,
  secondaryColor,
}: { 
  island: Island; 
  mapWidth: number; 
  mapHeight: number; 
  selected: boolean; 
  isOrigin?: boolean; 
  isDestination?: boolean;
  primaryColor: string;
  secondaryColor: string;
}) {
  const cx = island.x * mapWidth;
  const cy = island.y * mapHeight;
  const isHighlighted = selected || isOrigin || isDestination;
  const highlightColor = isOrigin ? secondaryColor : isDestination ? Colors.success : primaryColor;

  return (
    <G>
      {isHighlighted && (
        <Path
          d={getIslandPath(island, mapWidth, mapHeight)}
          fill="none"
          stroke={highlightColor}
          strokeWidth={4}
          opacity={0.6}
        />
      )}
      <Path
        d={getIslandPath(island, mapWidth, mapHeight)}
        fill={isHighlighted ? Colors.land : Colors.landDark}
        stroke={Colors.sand}
        strokeWidth={2}
      />
      <Circle
        cx={cx}
        cy={cy + 5}
        r={4}
        fill={Colors.sand}
      />
    </G>
  );
}

function Boat({ x, y, color }: { x: number; y: number; color: string }) {
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
        fill={color}
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

function RouteLine({ 
  from, 
  to,
  secondaryColor,
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number };
  secondaryColor: string;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 25;

  return (
    <G>
      <Path
        d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
        fill="none"
        stroke={secondaryColor}
        strokeWidth={3}
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
      <Circle cx={from.x} cy={from.y} r={8} fill={secondaryColor} />
      <Circle cx={to.x} cy={to.y} r={8} fill={Colors.success} />
    </G>
  );
}

export default function IslandMap({ 
  mode, 
  region,
  selectedIsland, 
  origin, 
  destination,
  onIslandPress, 
  onMainlandPress 
}: IslandMapProps) {
  const showRouteLine = mode === 'taxi' && origin && destination;
  
  const originIsland = origin ? region.islands.find(i => i.id === origin) : null;
  const destIsland = destination ? region.islands.find(i => i.id === destination) : null;
  
  const originPos = originIsland ? { x: originIsland.x * MAP_WIDTH, y: originIsland.y * MAP_HEIGHT } : null;
  const destPos = destIsland ? { x: destIsland.x * MAP_WIDTH, y: destIsland.y * MAP_HEIGHT } : null;

  const handleIslandPress = (island: Island) => {
    if (island.isMainland) {
      if (mode === 'taxi') {
        onIslandPress?.(island.id);
      } else {
        onMainlandPress?.();
      }
    } else {
      onIslandPress?.(island.id);
    }
  };

  const selectableIslands = mode === 'taxi' 
    ? region.islands 
    : region.islands.filter(i => !i.isMainland);

  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
        <WaterBackground primaryColor={region.primaryColor} />
        
        <Boat x={MAP_WIDTH * 0.12} y={MAP_HEIGHT * 0.35} color={region.secondaryColor} />
        <Whale x={MAP_WIDTH * 0.8} y={MAP_HEIGHT * 0.45} />
        <Boat x={MAP_WIDTH * 0.35} y={MAP_HEIGHT * 0.85} color={region.secondaryColor} />

        {showRouteLine && originPos && destPos && (
          <RouteLine from={originPos} to={destPos} secondaryColor={region.secondaryColor} />
        )}

        {region.islands.map((island) => (
          <IslandSvg 
            key={island.id}
            island={island}
            mapWidth={MAP_WIDTH}
            mapHeight={MAP_HEIGHT}
            selected={selectedIsland === island.id}
            isOrigin={origin === island.id}
            isDestination={destination === island.id}
            primaryColor={region.primaryColor}
            secondaryColor={region.secondaryColor}
          />
        ))}
      </Svg>

      {mode !== 'home' && selectableIslands.map((island) => (
        <TouchableIsland
          key={island.id}
          island={island}
          mapWidth={MAP_WIDTH}
          mapHeight={MAP_HEIGHT}
          isSelected={selectedIsland === island.id}
          isOrigin={origin === island.id}
          isDestination={destination === island.id}
          onPress={() => handleIslandPress(island)}
          primaryColor={region.primaryColor}
          secondaryColor={region.secondaryColor}
        />
      ))}
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
