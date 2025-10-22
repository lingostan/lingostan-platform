import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { PrimaryButton } from './PrimaryButton';

interface QuizFeedbackProps {
  isCorrect: boolean;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  isCorrect,
  message,
  buttonText,
  onButtonPress
}) => {
  return (
    <View style={[styles.container, isCorrect ? styles.correct : styles.incorrect]}>
      <BaseText 
        variant="bodyBold" 
        color={isCorrect ? "green" : "red"} 
        style={styles.message}
      >
        {message}
      </BaseText>
      <PrimaryButton 
        onPress={onButtonPress} 
        title={buttonText} 
        variant={isCorrect ? "green" : "red"} 
        size="small" 
        mode="filled" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  correct: {
    backgroundColor: '#E8F5E8',
    borderColor: '#6CD96C',
    borderWidth: 1,
  },
  incorrect: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF4D4D',
    borderWidth: 1,
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
}); 