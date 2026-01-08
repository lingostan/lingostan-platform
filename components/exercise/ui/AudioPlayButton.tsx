import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BaseText } from '@/components/ui/BaseText';

interface AudioPlayButtonProps {
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({
  label = 'Прослушать',
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Feather name="volume-2" size={18} color="#fff" />
      <BaseText variant="bodyBold" style={styles.label}>
        {label}
      </BaseText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#58cc02',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 140,
  },
  label: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});

export default AudioPlayButton;


