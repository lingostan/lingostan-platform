import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';

interface ProgressCardProps {
  icon: any;
  title: string;
  value: string | number;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  title,
  value,
  description,
  variant = 'default'
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'green';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'red';
      default:
        return 'main';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.icon} resizeMode='contain' source={icon} />
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <BaseText variant='bodyBold' color={getVariantColor()}>
              {value}
            </BaseText>
          </View>
          <View style={styles.descriptionContainer}>
            <BaseText variant='body' style={styles.description}>
              {description}
            </BaseText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  body: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
}); 