import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';

export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface AnswerOptionProps {
  label: string;
  onPress?: () => void;
  state?: AnswerState;
  style?: ViewStyle;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  label,
  onPress,
  state = 'default',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[state], style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={state === 'disabled'}
    >
      <BaseText variant="bodyBold">{label}</BaseText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    width: '48%',
  },
  default: {},
  selected: {
    borderColor: '#4F8EF7',
    backgroundColor: '#E8F0FF',
  },
  correct: {
    borderColor: '#58cc02',
    backgroundColor: '#eaffde',
  },
  incorrect: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe4e1',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default AnswerOption;


