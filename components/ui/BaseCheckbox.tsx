import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { AntDesign } from '@expo/vector-icons';

interface BaseCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  disabled?: boolean;
}

export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <AntDesign name="check" size={16} color="#fff" />
        )}
      </View>
      <BaseText variant="body" style={styles.label}>
        {label}
      </BaseText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6CD96C',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#6CD96C',
    borderColor: '#6CD96C',
  },
  label: {
    flex: 1,
  },
});

