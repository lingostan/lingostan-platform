import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export type ImageAnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface ImageAnswerOptionProps {
  source?: ImageSourcePropType;
  onPress?: () => void;
  state?: ImageAnswerState;
  style?: ViewStyle;
}

export const ImageAnswerOption: React.FC<ImageAnswerOptionProps> = ({
  source,
  onPress,
  state = 'default',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[state], style]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={state === 'disabled'}
    >
      {source && <Image source={source} style={styles.image} resizeMode="cover" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  default: {},
  selected: {
    borderColor: '#4F8EF7',
  },
  correct: {
    borderColor: '#58cc02',
  },
  incorrect: {
    borderColor: '#e74c3c',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default ImageAnswerOption;


