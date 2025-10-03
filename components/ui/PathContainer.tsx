import React from 'react'
import { View, StyleSheet } from 'react-native'

interface PathContainerProps {
  children: React.ReactNode
}

const PathContainer: React.FC<PathContainerProps> = ({ children }) => {
  return (
    <View style={stylesPathContainer.container}>
      <View style={stylesPathContainer.line} />
      <View style={stylesPathContainer.items}>{children}</View>
    </View>
  )
}

export default PathContainer

const stylesPathContainer = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  items: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  line: {
    backgroundColor: '#dcdcdc',
    height: 2,
    left: 32,
    position: 'absolute',
    right: 32,
    top: 20,
    zIndex: 0,
  },
})
