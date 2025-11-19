import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface ImageCardProps {
  source?: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ImageCard: React.FC<ImageCardProps> = ({ source, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {source && <Image source={source} style={styles.image} resizeMode="cover" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageCard;


