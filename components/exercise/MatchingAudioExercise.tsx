import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { SelectablePill } from '@/components/exercise/ui/SelectablePill';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import type { ExerciseType } from '@/types/lesson';

type SideConfig = {
  isLetter?: boolean;
  onlyAudio?: boolean;
};

type PairItem = {
  value: string;
  displayValue?: string | null;
  audioUrl?: string | null;
};

type Pair = {
  id: string;
  left: PairItem;
  right: PairItem;
};

interface MatchingQuestionData {
  id: string | number;
  type: ExerciseType | 'matching';
  title: string;
  content: {
    left: SideConfig;
    right: SideConfig;
    pairs: Pair[];
  };
}

interface MatchingAudioExerciseProps {
  data: MatchingQuestionData;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onReadyChange: (ready: boolean) => void;
  onRegisterCheck: (
    handler: { check: () => boolean | Promise<boolean>; reset?: () => void } | null,
  ) => void;
}

type AssignmentsMap = Record<string, string | null>;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://gilaniel.ru';

const resolveUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
};

// Функция для перемешивания массива (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createInitialAssignments = (pairs: Pair[]): AssignmentsMap => {
  return pairs.reduce<AssignmentsMap>((acc, pair) => {
    acc[pair.left.value] = null;
    return acc;
  }, {});
};

export const MatchingAudioExercise: React.FC<MatchingAudioExerciseProps> = ({
  data,
  feedbackState,
  onReadyChange,
  onRegisterCheck,
}) => {
  const audioPlayer = useAudioPlayer();
  const leftConfig = data.content.left;
  const rightConfig = data.content.right;
  
  // Определяем, нужно ли показывать только аудио
  const showAudioOnlyLeft = leftConfig?.onlyAudio === true;
  const showAudioOnlyRight = rightConfig?.onlyAudio === true;
  const allowAudioLeft = leftConfig?.onlyAudio !== false;
  const allowAudioRight = rightConfig?.onlyAudio !== false;

  // Рандомизируем порядок элементов в левой и правой колонках
  const leftItems = useMemo(() => {
    const items = data.content.pairs.map(pair => pair.left.value);
    return shuffleArray(items);
  }, [data.content.pairs]);
  
  const rightItems = useMemo(() => {
    const items = data.content.pairs.map(pair => pair.right.value);
    return shuffleArray(items);
  }, [data.content.pairs]);

  const [assignments, setAssignments] = useState<AssignmentsMap>(() =>
    createInitialAssignments(data.content.pairs),
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [incorrectLefts, setIncorrectLefts] = useState<Set<string>>(new Set());

  const correctMap = useMemo(() => {
    return data.content.pairs.reduce<Record<string, string>>((acc, pair) => {
      acc[pair.left.value] = pair.right.value;
      return acc;
    }, {});
  }, [data.content.pairs]);

  // Обновляем assignments при изменении leftItems
  useEffect(() => {
    const initial: AssignmentsMap = {};
    leftItems.forEach(left => {
      initial[left] = null;
    });
    setAssignments(initial);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIncorrectLefts(new Set());
    onReadyChange(false);
  }, [leftItems, onReadyChange]);

  const reverseAssignments = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(assignments).forEach(([left, right]) => {
      if (right) {
        map[right] = left;
      }
    });
    return map;
  }, [assignments]);

  const allPaired = useMemo(
    () => Object.values(assignments).every(value => value),
    [assignments],
  );

  useEffect(() => {
    onReadyChange(allPaired);
  }, [allPaired, onReadyChange]);

  useEffect(() => {
    if (feedbackState === 'incorrect') {
      const wrong = new Set<string>();
      Object.entries(assignments).forEach(([left, right]) => {
        if (!right || correctMap[left] !== right) {
          wrong.add(left);
        }
      });
      setIncorrectLefts(wrong);
    } else {
      setIncorrectLefts(new Set());
    }
  }, [feedbackState, assignments, correctMap]);

  const reset = useCallback(() => {
    const initial: AssignmentsMap = {};
    leftItems.forEach(left => {
      initial[left] = null;
    });
    setAssignments(initial);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIncorrectLefts(new Set());
    onReadyChange(false);
  }, [leftItems, onReadyChange]);

  useEffect(() => {
    const check = () => {
      const wrong = new Set<string>();
      Object.entries(assignments).forEach(([left, right]) => {
        if (!right || correctMap[left] !== right) {
          wrong.add(left);
        }
      });
      setIncorrectLefts(wrong);
      return wrong.size === 0 && Object.values(assignments).every(Boolean);
    };

    onRegisterCheck({ check, reset });
    return () => {
      onRegisterCheck(null);
    };
  }, [assignments, correctMap, onRegisterCheck, reset]);

  const handleAssign = useCallback(
    (left: string, right: string, toggle: boolean) => {
      setAssignments(prev => {
        const next: AssignmentsMap = { ...prev };
        if (toggle && prev[left] === right) {
          next[left] = null;
        } else {
          Object.keys(next).forEach(key => {
            if (key !== left && next[key] === right) {
              next[key] = null;
            }
          });
          next[left] = right;
        }
        return next;
      });
    },
    [],
  );

  const getPairByLeft = useCallback(
    (leftValue: string) => data.content.pairs.find(p => p.left.value === leftValue),
    [data.content.pairs],
  );

  const getPairByRight = useCallback(
    (rightValue: string) => data.content.pairs.find(p => p.right.value === rightValue),
    [data.content.pairs],
  );

  const handleSelectLeft = async (left: string) => {
    if (feedbackState !== 'idle') {
      return;
    }

    const pair = getPairByLeft(left);
    const audioUrl = pair?.left.audioUrl;

    // Воспроизводим аудио при клике на вариант ответа, если оно есть
    if (audioUrl) {
      const audioSource = resolveUrl(audioUrl);
      if (audioSource) {
        await audioPlayer.play({ uri: audioSource });
      }
    }

    if (selectedLeft === left) {
      if (assignments[left]) {
        handleAssign(left, assignments[left] as string, true);
      }
      setSelectedLeft(null);
      return;
    }

    if (selectedRight) {
      handleAssign(left, selectedRight, false);
      setSelectedRight(null);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(left);
    }
  };

  const handleSelectRight = async (right: string) => {
    if (feedbackState !== 'idle') {
      return;
    }

    const pair = getPairByRight(right);
    const audioUrl = pair?.right.audioUrl;

    // Воспроизводим аудио при клике на вариант ответа, если оно есть
    if (audioUrl) {
      const audioSource = resolveUrl(audioUrl);
      if (audioSource) {
        await audioPlayer.play({ uri: audioSource });
      }
    }

    if (selectedLeft) {
      const toggle = assignments[selectedLeft] === right;
      handleAssign(selectedLeft, right, toggle);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight(prev => (prev === right ? null : right));
    }
  };

  const getLeftStatus = (left: string) => {
    if (feedbackState === 'incorrect' && incorrectLefts.has(left)) {
      return 'incorrect' as const;
    }
    if (feedbackState === 'correct') {
      return 'correct' as const;
    }
    if (selectedLeft === left) {
      return 'active' as const;
    }
    if (assignments[left]) {
      return 'paired' as const;
    }
    return 'default' as const;
  };

  const getRightStatus = (right: string) => {
    const assignedLeft = reverseAssignments[right];
    if (feedbackState === 'incorrect' && assignedLeft && incorrectLefts.has(assignedLeft)) {
      return 'incorrect' as const;
    }
    if (feedbackState === 'correct') {
      return 'correct' as const;
    }
    if (selectedRight === right) {
      return 'active' as const;
    }
    if (assignedLeft) {
      return 'paired' as const;
    }
    return 'default' as const;
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        {data.title}
      </BaseText>
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map(leftValue => {
            const pair = getPairByLeft(leftValue);
            if (!pair) return null;
            const displayText = pair.left.displayValue || pair.left.value;
            const audioUrl = pair.left.audioUrl;
            const resolvedAudio = allowAudioLeft ? resolveUrl(audioUrl) : null;

            // Если onlyAudio === true, НЕ показываем текст (букву), только иконку аудио
            const label = showAudioOnlyLeft ? undefined : displayText;
            // Показываем иконку, если есть аудиодорожка
            const showIcon = !!audioUrl;

            return (
              <SelectablePill
                key={leftValue}
                icon={showIcon ? "volume-2" : undefined}
                label={label}
                status={getLeftStatus(leftValue)}
                disabled={feedbackState !== 'idle'}
                onPress={() => handleSelectLeft(leftValue)}
                style={styles.pill}
              />
            );
          })}
        </View>
        <View style={styles.column}>
          {rightItems.map(rightValue => {
            const pair = getPairByRight(rightValue);
            if (!pair) return null;
            const displayText = pair.right.displayValue || pair.right.value;
            const audioUrl = pair.right.audioUrl;
            const resolvedAudio = allowAudioRight ? resolveUrl(audioUrl) : null;

            // Если onlyAudio === true, НЕ показываем текст (букву), только иконку аудио
            const label = showAudioOnlyRight ? undefined : displayText;
            // Показываем иконку, если есть аудиодорожка
            const showIcon = !!audioUrl;

            return (
              <SelectablePill
                key={rightValue}
                icon={showIcon ? "volume-2" : undefined}
                label={label}
                status={getRightStatus(rightValue)}
                disabled={feedbackState !== 'idle'}
                onPress={() => handleSelectRight(rightValue)}
                style={styles.pill}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  columns: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  pill: {
    width: '100%',
  },
});

export default MatchingAudioExercise;

