import { useRef, ReactNode } from 'react';
import { Animated, Pressable, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  haptic?: 'selection' | 'light' | 'medium' | 'heavy' | 'none';
  scaleTarget?: number;
  disabled?: boolean;
}

const SPRING_CONFIG = { tension: 340, friction: 22, useNativeDriver: true } as const;

export default function PressableFeedback({
  onPress,
  onLongPress,
  children,
  style,
  haptic = 'light',
  scaleTarget = 0.94,
  disabled = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { ...SPRING_CONFIG, toValue: scaleTarget }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { ...SPRING_CONFIG, toValue: 1 }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      if (haptic === 'selection') Haptics.selectionAsync();
      else if (haptic === 'light')  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else if (haptic === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else if (haptic === 'heavy')  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onPress?.();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
