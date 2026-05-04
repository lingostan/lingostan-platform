import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { AudioPlayButton } from '@/components/exercise/ui/AudioPlayButton';
import { AnswerOption } from '@/components/exercise/ui/AnswerOption';
import { resolveAudioAsset } from '@/mocks/assets';
import type { SelectWordQuestionData } from '@/types/lesson';
import { CachedAudioButton } from '@/components/exercise/ui/CachedAudioButton';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface MultipleChoiceExerciseProps {
  data: SelectWordQuestionData & { title?: string };
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();
  const interactionDisabled = feedbackState !== 'idle';
  
  const letterAudioSource = data.letterAudio
    ? (data.letterAudio.startsWith('http') || data.letterAudio.startsWith('/')
        ? (data.letterAudio.startsWith('/') ? `${data.letterAudio}` : data.letterAudio)
        : resolveAudioAsset(data.letterAudio))
    : null;

  return (
    <View style={styles.container}>
      {data.title && (
        <View style={styles.titleContainer}>
          <BaseText variant="headingM" style={styles.exerciseTitle}>
            {data.title}
          </BaseText>
        </View>
      )}
      <View style={styles.header}>
        <BaseText variant="headingM" style={styles.letter}>{data.letter}</BaseText>
      </View>

      {letterAudioSource && (
        <View style={styles.audioButtonContainer}>
          <CachedAudioButton audioUri={letterAudioSource} />
        </View>
      )}

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

          const optionAudioSource = option.audio
            ? (option.audio.startsWith('http') || option.audio.startsWith('/')
                ? (option.audio.startsWith('/') ? `${option.audio}` : option.audio)
                : resolveAudioAsset(option.audio))
            : null;

          return (
            <AnswerOption
              key={option.id}
              label={option.label}
              onPress={async () => {
                if (interactionDisabled) return;
                // Воспроизводим аудио варианта ответа, если оно есть
                if (optionAudioSource) {
                  const source = optionAudioSource.startsWith('http') || optionAudioSource.startsWith('/')
                    ? { uri: optionAudioSource.startsWith('/') ? `${optionAudioSource}` : optionAudioSource }
                    : resolveAudioAsset(optionAudioSource);
                  if (source) {
                    await audioPlayer.play(typeof source === 'string' ? { uri: source } : source);
                  }
                }
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
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#333',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  letter: {
    fontSize: 24,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  audioButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MultipleChoiceExercise;


