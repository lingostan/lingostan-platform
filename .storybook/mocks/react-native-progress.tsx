import React from 'react';
import { View } from 'react-native';

// Minimal mock of react-native-progress for Storybook web build
export const Bar: React.FC<{ width?: number; height?: number; color?: string; unfilledColor?: string; borderColor?: string; style?: any; } & Record<string, any>> = ({ width = 150, height = 10, color = '#6CD96C', unfilledColor = '#E0E0E0', style }) => {
  return (
    <View style={[{ width, height, backgroundColor: unfilledColor, borderRadius: height / 2, overflow: 'hidden' }, style]}>
      <View style={{ width: '60%', height: '100%', backgroundColor: color }} />
    </View>
  );
};

export const Circle = (props: any) => <View {...props} />;
export const Pie = (props: any) => <View {...props} />;
export const CircleSnail = (props: any) => <View {...props} />;

export default { Bar, Circle, Pie, CircleSnail };


