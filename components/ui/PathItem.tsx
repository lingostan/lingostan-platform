import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type PathItemStatus = 'completed' | 'current' | 'locked';

interface PathItemProps {
  status: PathItemStatus;
  children?: React.ReactNode; // например, номер шага
  icon?: React.ReactNode; // иконка (например SVG или Image)
  onPress?: () => void; // обработчик клика
}

export const PathItem: React.FC<PathItemProps> = ({ status, children, icon, onPress }) => {
  const getStyles = () => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: '#58cc02',
          borderColor: '#58cc02',
          color: '#fff',
        };
      case 'current':
        return {
          backgroundColor: '#fff',
          borderColor: '#58cc02',
          color: '#58cc02',
        };
      case 'locked':
        return {
          backgroundColor: '#f0f0f0',
          borderColor: '#ccc',
          color: '#aaa',
        };
    }
  };

  const styles = getStyles();

  const isTouchable = !!onPress;

  const content = (
    <View
      style={[
        stylesPathItem.circle,
        {
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        },
      ]}
    >
      {icon ? (
        <View style={stylesPathItem.icon}>{icon}</View>
      ) : (
        <Text style={{ color: styles.color, fontWeight: 'bold' }}>{children}</Text>
      )}
    </View>
  );

  return (
    <View style={stylesPathItem.container}>
      {isTouchable ? (
        <TouchableOpacity onPress={onPress} disabled={status === 'locked'}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
};


const stylesPathItem = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});