import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';

type PillStatus = 'default' | 'active' | 'paired' | 'correct' | 'incorrect';

interface SelectablePillProps {
  label: string;
  status?: PillStatus;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SelectablePill: React.FC<SelectablePillProps> = ({
  label,
  status = 'default',
  disabled = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[status], style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <BaseText variant="bodyBold">{label}</BaseText>
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
  },
  default: {},
  active: {
    borderColor: '#4F8EF7',
    backgroundColor: '#E8F0FF',
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

