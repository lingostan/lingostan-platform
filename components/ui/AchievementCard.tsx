import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import * as Progress from 'react-native-progress';

interface AchievementCardProps {
  icon: any;
  title: string;
  progress: number;
  current: number;
  total: number;
  description: string;
  isLast?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  icon,
  title,
  progress,
  current,
  total,
  description,
  isLast = false
}) => {
  return (
    <View style={[styles.container, isLast && styles.lastItem]}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <BaseText variant='bodyBold' color="main">{title}</BaseText>
          </View>
          <View>
            <BaseText variant='body' color='secondary'>{`${current}/${total}`}</BaseText>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Progress.Bar 
            progress={progress} 
            width={150} 
            height={10} 
            color="#6CD96C" 
            unfilledColor="#E0E0E0" 
            borderColor="transparent" 
          />
        </View>
        <View style={styles.descriptionContainer}>
          <BaseText variant='body' color='secondary'>{description}</BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 4,
  },
}); 