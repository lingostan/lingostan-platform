import React, { useMemo } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, ImageSourcePropType } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { Feather } from '@expo/vector-icons';
import { resolveAudioAsset, resolveImageAsset } from '@/mocks/assets';
import type { LetterIntroQuestionData } from '@/types/lesson';
import { CachedImage } from '@/components/exercise/ui/CachedImage';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface ListeningExerciseProps {
  data: LetterIntroQuestionData & { title?: string };
  selectedOptionId: string | null;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (optionId: string) => void;
}

export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  data,
  selectedOptionId,
  feedbackState,
  onSelectOption,
}) => {
  const audioPlayer = useAudioPlayer();
  
  // Поддерживаем как URL, так и локальные идентификаторы
  // Мемоизируем imageSource, чтобы избежать пересоздания объекта при каждом рендере
  const imageSource: { uri: string } | ImageSourcePropType | null = useMemo(() => {
    if (!data.image) return null;
    if (data.image.startsWith('http') || data.image.startsWith('/')) {
      return { uri: data.image.startsWith('/') ? `https://gilaniel.ru${data.image}` : data.image };
    }
    return resolveImageAsset(data.image) || null;
  }, [data.image]);
  const audioSource = data.letterAudio
    ? (data.letterAudio.startsWith('http') || data.letterAudio.startsWith('/')
        ? (data.letterAudio.startsWith('/') ? `https://gilaniel.ru${data.letterAudio}` : data.letterAudio)
        : resolveAudioAsset(data.letterAudio))
    : null;

  const interactionDisabled = feedbackState !== 'idle';

  return (
    <View style={styles.container}>
      {data.title && (
        <View style={styles.titleContainer}>
          <BaseText variant="headingM" style={styles.title}>
            {data.title}
          </BaseText>
        </View>
      )}
      <View style={styles.mediaContainer}>
        {audioSource && typeof audioSource === 'string' && (
          <View style={styles.audioButtonWrapper}>
            <TouchableOpacity
              style={styles.audioButtonWithLetter}
              onPress={async () => {
                if (typeof audioSource !== 'string') return;
                const source = audioSource.startsWith('http') || audioSource.startsWith('/')
                  ? { uri: audioSource.startsWith('/') ? `https://gilaniel.ru${audioSource}` : audioSource }
                  : resolveAudioAsset(audioSource);
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

        {imageSource && (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => {
              // Аудио будет воспроизводиться через CachedAudioButton
            }}
            activeOpacity={0.85}
          >
            <CachedImage
              source={imageSource as any}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {data.options.map((option) => {
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

          // Выделяем букву из data.letter красным цветом в label
          const renderLabel = (text: string, letter: string) => {
            if (!letter || !text) {
              return <BaseText variant="bodyBold" style={styles.label}>{text}</BaseText>;
            }
            const escapedLetter = letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedLetter})`, 'gi');
            const parts = text.split(regex);
            return (
              <Text style={styles.label}>
                {parts.map((part, i) => {
                  if (part.toLowerCase() === letter.toLowerCase()) {
                    return (
                      <Text key={i} style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 16 }}>
                        {part}
                      </Text>
                    );
                  }
                  return <Text key={i} style={{ fontSize: 16, fontWeight: '600' }}>{part}</Text>;
                })}
              </Text>
            );
          };

          const optionAudioSource = (option as any).audio
            ? ((option as any).audio.startsWith('http') || (option as any).audio.startsWith('/')
                ? ((option as any).audio.startsWith('/') ? `https://gilaniel.ru${(option as any).audio}` : (option as any).audio)
                : resolveAudioAsset((option as any).audio))
            : null;

          return (
            <View key={option.id} style={styles.optionWrapper}>
              <TouchableOpacity
                style={[styles.answerBase, styles[state]]}
                onPress={async () => {
                  if (interactionDisabled) return;
                  // Воспроизводим аудио варианта ответа, если оно есть
                  if (optionAudioSource) {
                    const source = optionAudioSource.startsWith('http') || optionAudioSource.startsWith('/')
                      ? { uri: optionAudioSource.startsWith('/') ? `https://gilaniel.ru${optionAudioSource}` : optionAudioSource }
                      : resolveAudioAsset(optionAudioSource);
                    if (source) {
                      await audioPlayer.play(typeof source === 'string' ? { uri: source } : source);
                    }
                  }
                  onSelectOption(option.id);
                }}
                activeOpacity={0.7}
                disabled={state === 'disabled'}
              >
                {renderLabel(option.label, data.letter)}
              </TouchableOpacity>
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
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#333',
  },
  mediaContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  audioButtonWrapper: {
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
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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
    width: '100%',
    maxWidth: 400,
    marginBottom: 12,
  },
  answerBase: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    width: '100%',
    ...Platform.select({
      ios: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 2,
      },
    }),
  },
  default: {
    borderColor: '#e0e0e0',
  },
  selected: {
    borderColor: '#4F8EF7',
    backgroundColor: '#E8F0FF',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(79, 142, 247, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  correct: {
    borderColor: '#58cc02',
    backgroundColor: '#eaffde',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(88, 204, 2, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  incorrect: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe4e1',
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 4px rgba(231, 76, 60, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      ios: {
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.05)',
      },
      android: {
        elevation: 1,
      },
    }),
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ListeningExercise;


