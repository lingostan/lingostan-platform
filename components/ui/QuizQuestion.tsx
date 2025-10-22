import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from './BaseText';
import { PrimaryButton } from './PrimaryButton';
import { AntDesign } from '@expo/vector-icons';

interface QuizQuestionProps {
  title: string;
  options: string[];
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  onPlayAudio?: () => void;
  disabled?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  title,
  options,
  selectedOption,
  onOptionSelect,
  onPlayAudio,
  disabled = false
}) => {
  const getOptionVariant = (option: string) => {
    if (selectedOption === option) {
      return 'blue';
    }
    return 'gray';
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>{title}</BaseText>
      
      {onPlayAudio && (
        <PrimaryButton 
          variant='blue' 
          mode="filled" 
          size='large' 
          onPress={onPlayAudio}
          disabled={disabled}
        >
          <AntDesign name="sound" size={40} color="#fff" style={styles.soundIcon}/>
        </PrimaryButton>
      )}

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <PrimaryButton
            key={index}
            variant={getOptionVariant(option)}
            size="small"
            mode="outline"
            title={option}
            disabled={disabled}
            onPress={() => onOptionSelect(option)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  soundIcon: {
    marginRight: 8,
  },
  optionsContainer: {
    marginTop: 20,
    width: '100%',
    gap: 12,
  },
}); 