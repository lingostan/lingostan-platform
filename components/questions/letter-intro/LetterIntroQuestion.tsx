import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
  const imageSource = resolveImageAsset(data.image) as any;

  const interactionDisabled = feedbackState !== 'idle';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BaseText variant="headingM" style={styles.letter}>
          {data.letter}
        </BaseText>
      </View>

      <View style={styles.mediaContainer}>
        <AudioPlayButton onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))} />

        {imageSource && (
          <ImageCard
            source={imageSource}
            onPress={() => audioPlayer.play(resolveAudioAsset(data.letterAudio))}
          />
        )}
      </View>

      <View style={styles.optionsContainer}>
        {data.options.map((option, index) => {
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

          const isEven = index % 2 === 0;
          const optionStyle = [
            styles.optionWrapper,
            isEven ? styles.optionLeft : styles.optionRight,
          ];

          return (
            <View key={option.id} style={optionStyle}>
              <AnswerOption
                label={option.label}
                onPress={() => {
                  if (interactionDisabled) return;
                  onSelectOption(option.id);
                }}
                state={state}
              />
            </View>
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
    width: '100%',
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        paddingVertical: 12,
      },
    }),
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  letter: {
    fontSize: 56,
    fontWeight: '700',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  mediaContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        gap: 16,
      },
      android: {
        gap: 16,
      },
    }),
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    ...Platform.select({
      ios: {
        marginTop: 4,
      },
      android: {
        marginTop: 8,
      },
    }),
  },
  optionWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  optionLeft: {},
  optionRight: {},
});

export default LetterIntroQuestion;


