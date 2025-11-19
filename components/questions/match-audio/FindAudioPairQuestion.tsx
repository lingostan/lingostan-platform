import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { SelectablePill } from '@/components/questions/ui/SelectablePill';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { resolveAudioAsset } from '@/mocks/assets';
import type { MatchAudioQuestionData } from '@/types/lesson';

interface FindAudioPairQuestionProps {
  data: MatchAudioQuestionData;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onReadyChange: (ready: boolean) => void;
  onRegisterCheck: (
    handler: { check: () => boolean | Promise<boolean>; reset?: () => void } | null,
  ) => void;
}

type AudioAssignments = Record<string, string | null>;

const createInitialAssignments = (options: MatchAudioQuestionData['audioOptions']): AudioAssignments =>
  options.reduce<AudioAssignments>((acc, option) => {
    acc[option.id] = null;
    return acc;
  }, {});

export const FindAudioPairQuestion: React.FC<FindAudioPairQuestionProps> = ({
  data,
  feedbackState,
  onReadyChange,
  onRegisterCheck,
}) => {
  const audioPlayer = useAudioPlayer();
  const [assignments, setAssignments] = useState<AudioAssignments>(() =>
    createInitialAssignments(data.audioOptions),
  );
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [incorrectAudioIds, setIncorrectAudioIds] = useState<Set<string>>(new Set());

  const allAssigned = useMemo(
    () => Object.values(assignments).every(value => value),
    [assignments],
  );

  useEffect(() => {
    onReadyChange(allAssigned);
  }, [allAssigned, onReadyChange]);

  const correctMatches = useMemo(() => data.matches, [data.matches]);

  const reverseAssignments = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(assignments).forEach(([audioId, letterId]) => {
      if (letterId) {
        map[letterId] = audioId;
      }
    });
    return map;
  }, [assignments]);

  const reset = useCallback(() => {
    setAssignments(createInitialAssignments(data.audioOptions));
    setSelectedAudio(null);
    setSelectedLetter(null);
    setIncorrectAudioIds(new Set());
    onReadyChange(false);
  }, [data.audioOptions, onReadyChange]);

  useEffect(() => {
    reset();
  }, [data.audioOptions, data.letterOptions, reset]);

  useEffect(() => {
    if (feedbackState === 'incorrect') {
      const wrong = new Set<string>();
      Object.entries(assignments).forEach(([audioId, letterId]) => {
        if (!letterId || correctMatches[audioId] !== letterId) {
          wrong.add(audioId);
        }
      });
      setIncorrectAudioIds(wrong);
    } else {
      setIncorrectAudioIds(new Set());
    }
  }, [feedbackState, assignments, correctMatches]);

  useEffect(() => {
    const check = () => {
      const wrong = new Set<string>();
      Object.entries(assignments).forEach(([audioId, letterId]) => {
        if (!letterId || correctMatches[audioId] !== letterId) {
          wrong.add(audioId);
        }
      });
      setIncorrectAudioIds(wrong);
      return wrong.size === 0 && Object.values(assignments).every(Boolean);
    };

    onRegisterCheck({ check, reset });
    return () => {
      onRegisterCheck(null);
    };
  }, [assignments, correctMatches, onRegisterCheck, reset]);

  const assignPair = useCallback(
    (audioId: string, letterId: string, toggle: boolean) => {
      setAssignments(prev => {
        const next: AudioAssignments = { ...prev };
        if (toggle && prev[audioId] === letterId) {
          next[audioId] = null;
        } else {
          Object.keys(next).forEach(key => {
            if (key !== audioId && next[key] === letterId) {
              next[key] = null;
            }
          });
          next[audioId] = letterId;
        }
        return next;
      });
    },
    [],
  );

  const handleSelectAudio = async (audioId: string, audioKey: string) => {
    if (feedbackState !== 'idle') {
      return;
    }
    await audioPlayer.play(resolveAudioAsset(audioKey));
    if (selectedLetter) {
      const toggle = assignments[audioId] === selectedLetter;
      assignPair(audioId, selectedLetter, toggle);
      setSelectedAudio(null);
      setSelectedLetter(null);
    } else {
      setSelectedAudio(prev => (prev === audioId ? null : audioId));
    }
  };

  const handleSelectLetter = (letterId: string) => {
    if (feedbackState !== 'idle') {
      return;
    }

    if (selectedAudio) {
      const toggle = assignments[selectedAudio] === letterId;
      assignPair(selectedAudio, letterId, toggle);
      setSelectedAudio(null);
      setSelectedLetter(null);
    } else {
      setSelectedLetter(prev => (prev === letterId ? null : letterId));
    }
  };

  const getAudioStatus = (audioId: string) => {
    if (feedbackState === 'incorrect' && incorrectAudioIds.has(audioId)) {
      return 'incorrect' as const;
    }
    if (feedbackState === 'correct') {
      return 'correct' as const;
    }
    if (selectedAudio === audioId) {
      return 'active' as const;
    }
    if (assignments[audioId]) {
      return 'paired' as const;
    }
    return 'default' as const;
  };

  const getLetterStatus = (letterId: string) => {
    const assignedAudio = reverseAssignments[letterId];
    if (feedbackState === 'incorrect' && assignedAudio && incorrectAudioIds.has(assignedAudio)) {
      return 'incorrect' as const;
    }
    if (feedbackState === 'correct') {
      return 'correct' as const;
    }
    if (selectedLetter === letterId) {
      return 'active' as const;
    }
    if (assignedAudio) {
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
          {data.audioOptions.map(option => (
            <SelectablePill
              key={option.id}
              label="▶ Звук"
              status={getAudioStatus(option.id)}
              disabled={feedbackState !== 'idle'}
              onPress={() => handleSelectAudio(option.id, option.audio)}
              style={styles.pill}
            />
          ))}
        </View>
        <View style={styles.column}>
          {data.letterOptions.map(option => (
            <SelectablePill
              key={option.id}
              label={option.letter}
              status={getLetterStatus(option.id)}
              disabled={feedbackState !== 'idle'}
              onPress={() => handleSelectLetter(option.id)}
              style={styles.pill}
            />
          ))}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  columns: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  column: {
    flex: 1,
    gap: 12,
  },
  pill: {
    width: '100%',
  },
});

export default FindAudioPairQuestion;

