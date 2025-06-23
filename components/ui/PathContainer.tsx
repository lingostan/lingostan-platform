import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PathContainerProps {
  children: React.ReactNode;
}

const PathContainer: React.FC<PathContainerProps> = ({ children }) => {
  return (
    <View style={stylesPathContainer.container}>
      <View style={stylesPathContainer.line} />
      <View style={stylesPathContainer.items}>{children}</View>
    </View>
  );
};

export default PathContainer;

const stylesPathContainer = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  line: {
    position: 'absolute',
    top: 20,
    left: 32,
    right: 32,
    height: 2,
    backgroundColor: '#dcdcdc',
    zIndex: 0,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
});