import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'large';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  variant = 'default'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <BaseText 
          variant={variant === 'large' ? 'headingM' : 'subtitle'} 
          color="main"
        >
          {title}
        </BaseText>
      </View>
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <BaseText variant='body' color='secondary'>
            {subtitle}
          </BaseText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 4,
  },
  subtitleContainer: {
    marginBottom: 0,
  },
}); 