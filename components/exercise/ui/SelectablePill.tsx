import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { Feather } from '@expo/vector-icons';

type PillStatus = 'default' | 'active' | 'paired' | 'correct' | 'incorrect';

interface SelectablePillProps {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
  status?: PillStatus;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SelectablePill: React.FC<SelectablePillProps> = ({
  label,
  icon,
  status = 'default',
  disabled = false,
  onPress,
  style,
}) => {
  // Определяем цвет иконки в зависимости от статуса
  const getIconColor = () => {
    if (status === 'active') return '#fff';
    if (status === 'default') return '#333';
    if (status === 'paired') return '#58cc02';
    if (status === 'correct') return '#58cc02';
    if (status === 'incorrect') return '#dc2626'; // Красный контрастный цвет для неправильного ответа
    return '#fff';
  };

  return (
    <TouchableOpacity
      style={[styles.base, styles[status], style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon ? (
        <Feather name={icon} size={20} color={getIconColor()} />
      ) : null}
      {label && (
          <BaseText
            variant="bodyBold"
            style={{
              marginLeft: icon ? 8 : 0,
              color:
                status === 'active'
                  ? '#fff'
                  : status === 'default'
                    ? '#333'
                    : '#333',
            }}
          >
          {label}
        </BaseText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  default: {},
  active: {
    borderColor: '#58cc02',
    backgroundColor: '#58cc02',
  },
  paired: {
    borderColor: '#58cc02',
  },
  correct: {
    borderColor: '#58cc02',
    backgroundColor: '#eaffde',
  },
  incorrect: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe4e1',
  },
});

export default SelectablePill;

