import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';

export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface AnswerOptionProps {
  label: string | React.ReactNode;
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
      activeOpacity={0.7}
      disabled={state === 'disabled'}
    >
      {typeof label === 'string' ? (
        <BaseText variant="bodyBold" style={styles.label}>
          {label}
        </BaseText>
      ) : (
        <BaseText variant="bodyBold" style={styles.label}>
          {label}
        </BaseText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    width: '100%',
    ...Platform.select({
      ios: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 2,
      },
    }),
  },
  label: {
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontSize: 16,
        fontWeight: '600',
      },
      android: {
        fontSize: 16,
        fontWeight: '600',
      },
    }),
  },
  default: {
    ...Platform.select({
      ios: {
        borderColor: '#e0e0e0',
      },
      android: {
        borderColor: '#e0e0e0',
      },
    }),
  },
  selected: {
    borderColor: '#4F8EF7',
    backgroundColor: '#E8F0FF',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(79, 142, 247, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  correct: {
    borderColor: '#58cc02',
    backgroundColor: '#eaffde',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(88, 204, 2, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  incorrect: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe4e1',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(231, 76, 60, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.05)',
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default AnswerOption;


