import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BaseText } from '@/components/ui/BaseText';

interface LessonCardProps {
  title: string;
  summary?: string;
  locked?: boolean;
  completed?: boolean;
  onPress?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  summary,
  locked = false,
  completed = false,
  onPress,
}) => {
  const disabled = locked || !onPress;

  const icon = locked
    ? <AntDesign name="lock" size={18} color="#999" />
    : completed
      ? <AntDesign name="checkcircle" size={18} color="#58cc02" />
      : <AntDesign name="playcircleo" size={18} color="#58cc02" />;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        locked && styles.locked,
        completed && styles.completed,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <BaseText variant="bodyBold" style={styles.title}>
          {title}
        </BaseText>
        {icon}
      </View>
      {summary && (
        <BaseText variant="caption" color="secondary">
          {summary}
        </BaseText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  locked: {
    opacity: 0.6,
  },
  completed: {
    borderColor: '#58cc02',
  },
});

export default LessonCard;


