import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.65;

interface IslandMapProps {
  mode: 'home' | 'delivery' | 'taxi';
  selectedIsland?: string | null;
  origin?: string | null;
  destination?: string | null;
  onIslandPress?: (islandId: string) => void;
  onMainlandPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IslandShapeProps {
  id: string;
  cx: number;
  cy: number;
  selected: boolean;
  isOrigin?: boolean;
  isDestination?: boolean;
  onPress: () => void;
  mode: 'home' | 'delivery' | 'taxi';
}

function IslandShape({ id, cx, cy, selected, isOrigin, isDestination, onPress, mode }: IslandShapeProps) {
  const pulseAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    if (selected || isOrigin || isDestination) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.5, { duration: 800 })
        ),
        -1,
        true
      );
    }
  }, [selected, isOrigin, isDestination]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = mode === 'home' 
      ? interpolate(pulseAnim.value, [0, 1], [1, 1.02])
      : 1;
    return {
      transform: [{ scale }],
    };
  });

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const isHighlighted = selected || isOrigin || isDestination;
  const highlightColor = isOrigin ? Colors.secondary : isDestination ? Colors.success : Colors.primary;

  const getIslandPath = () => {
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
      default:
        return '';
    }
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <G>
        {isHighlighted && (
          <Path
            d={getIslandPath()}
            fill="none"
            stroke={highlightColor}
            strokeWidth={4}
            opacity={0.6}
          />
        )}
        <Path
          d={getIslandPath()}
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
    </AnimatedPressable>
  );
}

function MainlandShape({ cx, cy, selected, onPress }: { cx: number; cy: number; selected: boolean; onPress: () => void }) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <G>
        {selected && (
          <Path
            d={`M ${cx - 60} ${cy + 80}
                L ${cx - 60} ${cy - 20}
                Q ${cx - 40} ${cy - 40} ${cx} ${cy - 35}
                Q ${cx + 40} ${cy - 30} ${cx + 60} ${cy}
                L ${cx + 60} ${cy + 80}
                Z`}
            fill="none"
            stroke={Colors.secondary}
            strokeWidth={4}
            opacity={0.6}
          />
        )}
        <Path
          d={`M ${cx - 60} ${cy + 80}
              L ${cx - 60} ${cy - 20}
              Q ${cx - 40} ${cy - 40} ${cx} ${cy - 35}
              Q ${cx + 40} ${cy - 30} ${cx + 60} ${cy}
              L ${cx + 60} ${cy + 80}
              Z`}
          fill={selected ? Colors.land : Colors.landDark}
          stroke={Colors.sand}
          strokeWidth={2}
        />
      </G>
    </Pressable>
  );
}

function WaterBackground() {
  const waveAnim = useSharedValue(0);

  useEffect(() => {
    waveAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

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
        cy={MAP_HEIGHT * 0.2}
        rx={100}
        ry={60}
        fill="url(#sunReflection)"
      />
      {[0.2, 0.4, 0.6, 0.75].map((yPos, i) => (
        <Path
          key={i}
          d={`M ${-20 + i * 10} ${MAP_HEIGHT * yPos}
              Q ${MAP_WIDTH * 0.25} ${MAP_HEIGHT * yPos - 8}
                ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * yPos}
              Q ${MAP_WIDTH * 0.75} ${MAP_HEIGHT * yPos + 8}
                ${MAP_WIDTH + 20} ${MAP_HEIGHT * yPos}`}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1.5}
        />
      ))}
    </G>
  );
}

function Boat({ x, y }: { x: number; y: number }) {
  const bobAnim = useSharedValue(0);

  useEffect(() => {
    bobAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

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
  const swimAnim = useSharedValue(0);

  useEffect(() => {
    swimAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

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
  const drawAnim = useSharedValue(0);

  useEffect(() => {
    drawAnim.value = 0;
    drawAnim.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
  }, [from, to]);

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 30;

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
  const islandPositions = {
    orcas: { x: MAP_WIDTH * 0.55, y: MAP_HEIGHT * 0.25 },
    sanJuan: { x: MAP_WIDTH * 0.3, y: MAP_HEIGHT * 0.45 },
    lopez: { x: MAP_WIDTH * 0.55, y: MAP_HEIGHT * 0.6 },
    anacortes: { x: MAP_WIDTH * 0.8, y: MAP_HEIGHT * 0.75 },
  };

  const showRouteLine = mode === 'taxi' && origin && destination;
  const originPos = origin ? islandPositions[origin as keyof typeof islandPositions] : null;
  const destPos = destination ? islandPositions[destination as keyof typeof islandPositions] : null;

  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
        <WaterBackground />
        
        <Boat x={MAP_WIDTH * 0.15} y={MAP_HEIGHT * 0.3} />
        <Whale x={MAP_WIDTH * 0.75} y={MAP_HEIGHT * 0.45} />
        <Boat x={MAP_WIDTH * 0.4} y={MAP_HEIGHT * 0.75} />

        {showRouteLine && originPos && destPos && (
          <RouteLine from={originPos} to={destPos} />
        )}

        <MainlandShape
          cx={islandPositions.anacortes.x}
          cy={islandPositions.anacortes.y}
          selected={origin === 'anacortes' || destination === 'anacortes'}
          onPress={() => {
            if (mode === 'taxi') {
              onIslandPress?.('anacortes');
            } else {
              onMainlandPress?.();
            }
          }}
        />

        <IslandShape
          id="orcas"
          cx={islandPositions.orcas.x}
          cy={islandPositions.orcas.y}
          selected={selectedIsland === 'orcas'}
          isOrigin={origin === 'orcas'}
          isDestination={destination === 'orcas'}
          onPress={() => onIslandPress?.('orcas')}
          mode={mode}
        />
        <IslandShape
          id="sanJuan"
          cx={islandPositions.sanJuan.x}
          cy={islandPositions.sanJuan.y}
          selected={selectedIsland === 'sanJuan'}
          isOrigin={origin === 'sanJuan'}
          isDestination={destination === 'sanJuan'}
          onPress={() => onIslandPress?.('sanJuan')}
          mode={mode}
        />
        <IslandShape
          id="lopez"
          cx={islandPositions.lopez.x}
          cy={islandPositions.lopez.y}
          selected={selectedIsland === 'lopez'}
          isOrigin={origin === 'lopez'}
          isDestination={destination === 'lopez'}
          onPress={() => onIslandPress?.('lopez')}
          mode={mode}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
});
