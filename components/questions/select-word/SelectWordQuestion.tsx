import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { AudioPlayButton } from '@/components/questions/ui/AudioPlayButton';
import { AnswerOption } from '@/components/questions/ui/AnswerOption';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { resolveAudioAsset } from '@/mocks/assets';
import type { SelectWordQuestionData } from '@/types/lesson';

interface SelectWordQuestionProps {
  data: SelectWordQuestionData;
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

export const SelectWordQuestion: React.FC<SelectWordQuestionProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();

  const interactionDisabled = feedbackState !== 'idle';

  return (
    <View style={styles.container}>
      <BaseText variant="headingM">{`Выбери слово с буквой «${data.letter}»`}</BaseText>

      <AudioPlayButton onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))} />

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
    paddingHorizontal: 16,
  },
  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
});

export default SelectWordQuestion;


