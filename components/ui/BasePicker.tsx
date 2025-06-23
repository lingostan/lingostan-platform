import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { BaseText } from './BaseText'; 

interface PickerItem {
  label: string;
  value: any;
}

interface PickerProps {
  label?: string;
  selectedValue: any;
  onValueChange: (value: any) => void;
  items: PickerItem[];
  error?: string;
  placeholder?: string;
}

export const BasePicker: React.FC<PickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  error,
  placeholder = 'Выберите значение',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <BaseText variant="label" color="secondary">{label}</BaseText>}
      <View
        style={[
          styles.pickerContainer,
          isFocused && !error && styles.focused,
          error && styles.errorInput,
        ]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.picker}
          dropdownIconColor="#58cc02"
        >
          <Picker.Item label={placeholder} value={null} color="#aaa" />
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color="rgb(60, 60, 60)"
            />
          ))}
        </Picker>
      </View>
      {error && <BaseText variant="caption" color="secondary">{error}</BaseText>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    pickerContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      minHeight: 48,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    focused: {
      borderColor: '#58cc02',
      shadowColor: '#58cc02',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    errorInput: {
      borderColor: '#e74c3c',
      shadowColor: '#e74c3c',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    picker: {
      color: 'rgb(60, 60, 60)',
    },
  });