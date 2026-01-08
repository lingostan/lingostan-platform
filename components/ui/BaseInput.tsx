import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

import { BaseText } from './BaseText';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
}

export const BaseInput: React.FC<InputProps & TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <BaseText variant="label" color="secondary" style={styles.label}>{label}</BaseText>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          multiline && { height: 32 * numberOfLines },
          isFocused && !error && styles.focused,
          error && styles.errorInput,
        ]}
        placeholderTextColor="#aaa"
      />
      {error && <BaseText variant="caption" color="secondary">{error}</BaseText>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    color: 'rgb(60, 60, 60)',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 48,
  },
  focused: {
    borderColor: '#58cc02',
    boxShadow: '0px 0px 4px rgba(88, 204, 2, 0.3)',
  },
  errorInput: {
    borderColor: '#e74c3c',
    boxShadow: '0px 0px 4px rgba(231, 76, 60, 0.3)',
  },
  label: {
    marginBottom: 4
  }
});