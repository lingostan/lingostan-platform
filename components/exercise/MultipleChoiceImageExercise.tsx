import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { resolveAudioAsset, resolveImageAsset } from '@/mocks/assets';
import type { SelectImageQuestionData } from '@/types/lesson';
import { CachedImage } from '@/components/exercise/ui/CachedImage';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Feather } from '@expo/vector-icons';

interface MultipleChoiceImageExerciseProps {
  data: SelectImageQuestionData & { title?: string };
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

// Отдельный компонент для option с мемоизацией imageSource
interface ImageOptionItemProps {
  option: any;
  state: 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
  letter: string;
  interactionDisabled: boolean;
  audioPlayer: ReturnType<typeof useAudioPlayer>;
  onSelectOption: (optionId: string) => void;
}

const ImageOptionItem: React.FC<ImageOptionItemProps> = React.memo(({
  option,
  state,
  letter,
  interactionDisabled,
  audioPlayer,
  onSelectOption,
}) => {
  // Мемоизируем imageSource, чтобы избежать пересоздания объекта при каждом рендере
  const imageSource = useMemo(() => {
    if (!option.image) return null;
    if (option.image.startsWith('http') || option.image.startsWith('/')) {
      return { uri: option.image.startsWith('/') ? `https://gilaniel.ru${option.image}` : option.image };
    }
    return resolveImageAsset(option.image);
  }, [option.image]);

  const optionAudioSource = (option as any).audio && typeof (option as any).audio === 'string'
    ? ((option as any).audio.startsWith('http') || (option as any).audio.startsWith('/')
        ? ((option as any).audio.startsWith('/') ? `https://gilaniel.ru${(option as any).audio}` : (option as any).audio)
        : resolveAudioAsset((option as any).audio))
    : null;

  if (!imageSource) return null;

  // Выделяем букву из data.letter красным цветом в тексте под картинкой
  const renderWord = (word: string, letter: string) => {
    if (!letter || !word) {
      return <BaseText variant="body" style={styles.optionWord}>{word}</BaseText>;
    }
    const escapedLetter = letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedLetter})`, 'gi');
    const parts = word.split(regex);
    return (
      <Text style={styles.optionWord}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === letter.toLowerCase()) {
            return (
              <Text key={i} style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 14 }}>
                {part}
              </Text>
            );
          }
          return <Text key={i} style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>{part}</Text>;
        })}
      </Text>
    );
  };

  return (
    <View style={styles.imageOptionWrapper}>
      <TouchableOpacity
        style={[styles.imageOption, styles[state]]}
        onPress={async () => {
          if (interactionDisabled) return;
          // Воспроизводим аудио варианта ответа, если оно есть
          if (optionAudioSource && typeof optionAudioSource === 'string') {
            const source = optionAudioSource.startsWith('http') || optionAudioSource.startsWith('/')
              ? { uri: optionAudioSource.startsWith('/') ? `https://gilaniel.ru${optionAudioSource}` : optionAudioSource }
              : resolveAudioAsset(optionAudioSource);
            if (source) {
              const playbackSource = typeof source === 'string' 
                ? { uri: source } 
                : (typeof source === 'object' && 'uri' in source ? source : { uri: String(source) });
              await audioPlayer.play(playbackSource);
            }
          }
          onSelectOption(option.id);
        }}
        activeOpacity={0.85}
        disabled={state === 'disabled'}
      >
        <CachedImage
          source={imageSource as any}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      {(option as any).word && renderWord((option as any).word, letter)}
    </View>
  );
});

export const MultipleChoiceImageExercise: React.FC<MultipleChoiceImageExerciseProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();
  const interactionDisabled = feedbackState !== 'idle';
  
  const letterAudioSource = data.letterAudio
    ? (data.letterAudio.startsWith('http') || data.letterAudio.startsWith('/')
        ? (data.letterAudio.startsWith('/') ? `https://gilaniel.ru${data.letterAudio}` : data.letterAudio)
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
      {letterAudioSource && (
        <View style={styles.audioButtonContainer}>
          <TouchableOpacity
            style={styles.audioButtonWithLetter}
            onPress={async () => {
              if (typeof letterAudioSource !== 'string') return;
              const source = letterAudioSource.startsWith('http') || letterAudioSource.startsWith('/')
                ? { uri: letterAudioSource.startsWith('/') ? `https://gilaniel.ru${letterAudioSource}` : letterAudioSource }
                : resolveAudioAsset(letterAudioSource);
              if (source) {
                const playbackSource = typeof source === 'string' 
                  ? { uri: source } 
                  : (typeof source === 'object' && 'uri' in source ? source : { uri: String(source) });
                await audioPlayer.play(playbackSource);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.audioButtonContent}>
              <BaseText variant="headingM" style={styles.letterInButton}>
                {data.letter}
              </BaseText>
              <Feather name="volume-2" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.grid}>
        {data.options.map(option => {
          let state: 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled' = 'default';

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
            <ImageOptionItem
              key={option.id}
              option={option}
              state={state}
              letter={data.letter}
              interactionDisabled={interactionDisabled}
              audioPlayer={audioPlayer}
              onSelectOption={onSelectOption}
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
  audioButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  audioButtonWithLetter: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#58cc02',
    borderRadius: 12,
    padding: 10,
    alignSelf: 'center',
  },
  audioButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  letterInButton: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  imageOptionWrapper: {
    width: '45%',
    alignItems: 'center',
  },
  imageOption: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionWord: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  default: {},
  selected: {
    borderColor: '#4F8EF7',
  },
  correct: {
    borderColor: '#58cc02',
  },
  incorrect: {
    borderColor: '#e74c3c',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default MultipleChoiceImageExercise;

