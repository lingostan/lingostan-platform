import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from 'react-native';

import { ButtonColors } from '../theme/colors';

// Типы

type IconButtonSize = 'small' | 'medium' | 'large';
type IconButtonVariant = keyof typeof ButtonColors;

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  loading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'green',
  size = 'medium',
  disabled = false,
  loading = false,
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      onPress?.();
    });
  };

  // Размеры
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 36, height: 36, borderRadius: 18 };
      case 'large':
        return { width: 80, height: 80, borderRadius: 40 };
      default:
        return { width: 48, height: 48, borderRadius: 24 };
    }
  };

  // Цвета
  const { background, shadow } = ButtonColors[variant];

  // boxShadow
  const getBoxShadow = () =>
    `0px 10px 0 ${shadow}`;

  return (
    
    <Animated.View
      style={[
        styles.container,
        getSizeStyle(),
        {
          backgroundColor: background,
          transform: [{scale: scaleAnim }, { scaleY: 0.8 }], // делает кнопку чуть сплющенной по вертикали
          opacity: disabled ? 0.5 : 1,
          boxShadow: getBoxShadow(),
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        style={styles.touchable}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.iconContainer}>{icon}</View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Вспомогательная функция для цвета тени
const hexToRgba = (hex: string, alpha: number): string => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 40, // делает из квадрата — круг
    position: 'relative'
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  },
  shadow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    height: 5,
    zIndex: 1,
    backgroundColor: 'yellow'
  }
});