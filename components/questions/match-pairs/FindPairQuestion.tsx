import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '@/components/ui/BaseText';
import { SelectablePill } from '@/components/questions/ui/SelectablePill';
import type { MatchPairsQuestionData } from '@/types/lesson';

interface FindPairQuestionProps {
  data: MatchPairsQuestionData;
  feedbackState: 'idle' | 'correct' | 'incorrect';
  onReadyChange: (ready: boolean) => void;
  onRegisterCheck: (
    handler: { check: () => boolean | Promise<boolean>; reset?: () => void } | null,
  ) => void;
}

type AssignmentsMap = Record<string, string | null>;

const createInitialAssignments = (pairs: MatchPairsQuestionData['pairs']): AssignmentsMap => {
  return pairs.reduce<AssignmentsMap>((acc, pair) => {
    acc[pair.left] = null;
    return acc;
  }, {});
};

export const FindPairQuestion: React.FC<FindPairQuestionProps> = ({
  data,
  feedbackState,
  onReadyChange,
  onRegisterCheck,
}) => {
  const leftItems = useMemo(() => data.pairs.map(pair => pair.left), [data.pairs]);
  const rightItems = useMemo(() => {
    const rights = data.pairs.map(pair => pair.right);
    return rights;
  }, [data.pairs]);

  const [assignments, setAssignments] = useState<AssignmentsMap>(() =>
    createInitialAssignments(data.pairs),
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [incorrectLefts, setIncorrectLefts] = useState<Set<string>>(new Set());

  const correctMap = useMemo(() => {
    return data.pairs.reduce<Record<string, string>>((acc, pair) => {
      acc[pair.left] = pair.right;
      return acc;
    }, {});
  }, [data.pairs]);

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
    setAssignments(createInitialAssignments(data.pairs));
    setSelectedLeft(null);
    setSelectedRight(null);
    setIncorrectLefts(new Set());
    onReadyChange(false);
  }, [data.pairs, onReadyChange]);

  useEffect(() => {
    reset();
  }, [data.pairs, reset]);

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

  const handleSelectLeft = (left: string) => {
    if (feedbackState !== 'idle') {
      return;
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

  const handleSelectRight = (right: string) => {
    if (feedbackState !== 'idle') {
      return;
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
      return 'incorrect';
    }
    if (feedbackState === 'correct') {
      return 'correct';
    }
    if (selectedLeft === left) {
      return 'active';
    }
    if (assignments[left]) {
      return 'paired';
    }
    return 'default';
  };

  const getRightStatus = (right: string) => {
    const assignedLeft = reverseAssignments[right];
    if (feedbackState === 'incorrect' && assignedLeft && incorrectLefts.has(assignedLeft)) {
      return 'incorrect';
    }
    if (feedbackState === 'correct') {
      return 'correct';
    }
    if (selectedRight === right) {
      return 'active';
    }
    if (assignedLeft) {
      return 'paired';
    }
    return 'default';
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        {data.title}
      </BaseText>
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map(left => (
            <SelectablePill
              key={left}
              label={left}
              status={getLeftStatus(left)}
              disabled={feedbackState !== 'idle'}
              onPress={() => handleSelectLeft(left)}
              style={styles.pill}
            />
          ))}
        </View>
        <View style={styles.column}>
          {rightItems.map(right => (
            <SelectablePill
              key={right}
              label={right}
              status={getRightStatus(right)}
              disabled={feedbackState !== 'idle'}
              onPress={() => handleSelectRight(right)}
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
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
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

export default FindPairQuestion;

