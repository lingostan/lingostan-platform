import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { ButtonColors } from '../theme/colors';

// Получаем ширину экрана для адаптивности
const { width } = Dimensions.get('window');

// Типы для вариантов цвета
type ButtonVariant = keyof typeof ButtonColors;

// Размеры кнопок
type ButtonSize = 'small' | 'medium' | 'large';

// Режимы отображения
type ButtonMode = 'filled' | 'outline' | 'transparent';

// Типы для пропсов кнопки
interface PrimaryButtonProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  mode?: ButtonMode;
  loading?: boolean;
  fluid?: boolean; 
  textCenter?: boolean;
  children?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  title,
  disabled = false,
  variant = 'green',
  size = 'medium',
  mode = 'filled',
  loading = false,
  fluid = false,
  textCenter = true,
  children = null
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    if (mode !== 'transparent') {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
    
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    if (mode !== 'transparent') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        onPress();
      });
    } else {
      onPress();
    }
    
  };

  // Цвета по выбранному варианту
  const { background, shadow } = ButtonColors[variant];

  // Определяем стили в зависимости от режима
  const getContainerStyle = () => {
    switch (mode) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: background,
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: background,
        };
    }
  };

  // Размер кнопки
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 40,
          borderRadius: 20,
        };
      default:
        return {
          paddingVertical: 15,
          paddingHorizontal: 30,
          borderRadius: 16,
        };
    }
  };

  // Стиль тени (всегда одинаковый)
  const getShadowStyle = () => {
    return {
      shadowColor: mode === 'filled' ? shadow : 'transparent',
      shadowOffset: {
        width: 0,
        height: 4,
      },
    };
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        getSizeStyle(),
        getContainerStyle(),
        getShadowStyle(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.5 : 1,
          width: fluid ? '100%' : undefined,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{ width: '100%' }}
      >
        <View style={styles.innerButton}>
          {children}
          {loading ? (
            <ActivityIndicator color={mode === 'filled' ? '#fff' : background} />
          ) : (
            title && <Text
              style={[
                styles.buttonText,
                {
                  textAlign: textCenter ? 'center': 'left',
                  color:
                    mode === 'filled'
                      ? '#fff'
                      : mode === 'transparent'
                        ? background
                        : background,
                  fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 17,
                },
              ]}
            >
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    minWidth: 100,
    maxWidth: '100%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  innerButton: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
});