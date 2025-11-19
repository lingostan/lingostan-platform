import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { AudioPlayButton } from '@/components/questions/ui/AudioPlayButton';
import { ImageAnswerOption } from '@/components/questions/ui/ImageAnswerOption';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { resolveAudioAsset, resolveImageAsset } from '@/mocks/assets';
import type { SelectImageQuestionData } from '@/types/lesson';

interface SelectImageQuestionProps {
  data: SelectImageQuestionData;
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

export const SelectImageQuestion: React.FC<SelectImageQuestionProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();

  const interactionDisabled = feedbackState !== 'idle';

  return (
    <View style={styles.container}>
      <BaseText variant="headingM">{`Выбери картинку с буквой «${data.letter}»`}</BaseText>

      <AudioPlayButton onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))} />

      <View style={styles.grid}>
        {data.options.map(option => {
          let state: Parameters<typeof ImageAnswerOption>[0]['state'] = 'default';

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
            <ImageAnswerOption
              key={option.id}
              source={resolveImageAsset(option.image)}
              onPress={async () => {
                if (interactionDisabled) return;
                await audioPlayer.play(resolveAudioAsset(option.audio));
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
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
});

export default SelectImageQuestion;

