import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { AudioPlayButton } from '@/components/questions/ui/AudioPlayButton';
import { AnswerOption } from '@/components/questions/ui/AnswerOption';
import { ImageCard } from '@/components/questions/ui/ImageCard';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { resolveAudioAsset, resolveImageAsset } from '@/mocks/assets';
import type { LetterIntroQuestionData } from '@/types/lesson';

interface LetterIntroQuestionProps {
  data: LetterIntroQuestionData;
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

export const LetterIntroQuestion: React.FC<LetterIntroQuestionProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();
  const imageSource = resolveImageAsset(data.image);

  const interactionDisabled = feedbackState !== 'idle';

  return (
    <View style={styles.container}>
      <BaseText variant="headingL" style={styles.letter}>
        {data.letter}
      </BaseText>

      <AudioPlayButton onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))} />

      <ImageCard
        source={imageSource}
        onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))}
      />

      <View style={styles.options}>
        {data.options.map(option => {
          let state: Parameters<typeof AnswerOption>[0]['state'] = 'default';

          if (feedbackState === 'idle') {
            state = option.id === selectedOptionId ? 'selected' : 'default';
          } else if (feedbackState === 'correct') {
            state = option.isCorrect ? 'correct' : 'disabled';
          } else if (feedbackState === 'incorrect') {
            if (option.id === selectedOptionId) {
              state = 'incorrect';
            } else {
              state = 'disabled';
            }
          }

          return (
            <AnswerOption
              key={option.id}
              label={option.label}
              onPress={() => {
                if (interactionDisabled) return;
                onSelectOption(option.id);
              }}
              state={state}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  letter: {
    fontSize: 48,
  },
  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
});

export default LetterIntroQuestion;


