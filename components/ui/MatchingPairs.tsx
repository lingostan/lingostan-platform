import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseText } from './BaseText';
import { PrimaryButton } from './PrimaryButton';

type Pair = { left: string; right: string };

interface MatchingPairsProps {
  title: string;
  pairs: Pair[];
  disabled?: boolean;
  onSolved: () => void;
}

export const MatchingPairs: React.FC<MatchingPairsProps> = ({
  title,
  pairs,
  disabled = false,
  onSolved,
}) => {
  const shuffledLeft = useMemo(() => shuffleArray(pairs.map(p => p.left)), [pairs]);
  const shuffledRight = useMemo(() => shuffleArray(pairs.map(p => p.right)), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});

  const isAllMatched = Object.keys(matched).length === pairs.length;

  const handleSelectLeft = (item: string) => {
    if (disabled || isAllMatched) return;
    if (matched[item]) return;
    setSelectedLeft(item === selectedLeft ? null : item);
  };

  const handleSelectRight = (item: string) => {
    if (disabled || isAllMatched) return;
    if (Object.values(matched).includes(item)) return;
    const newValue = item === selectedRight ? null : item;
    setSelectedRight(newValue);

    const left = selectedLeft;
    if (left && newValue) {
      const correctRight = pairs.find(p => p.left === left)?.right;
      if (correctRight === newValue) {
        setMatched(prev => ({ ...prev, [left]: newValue }));
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>{title}</BaseText>

      <View style={styles.columns}>
        <View style={styles.column}>
          {shuffledLeft.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelectLeft(item)}
              disabled={disabled || !!matched[item]}
              style={[
                styles.pill,
                matched[item] && styles.pillDisabled,
                selectedLeft === item && styles.pillActive,
              ]}
            >
              <BaseText variant="bodyBold">{item}</BaseText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          {shuffledRight.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelectRight(item)}
              disabled={disabled || Object.values(matched).includes(item)}
              style={[
                styles.pill,
                Object.values(matched).includes(item) && styles.pillDisabled,
                selectedRight === item && styles.pillActive,
              ]}
            >
              <BaseText variant="bodyBold">{item}</BaseText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PrimaryButton
        title="Готово"
        variant="blue"
        mode="filled"
        size="small"
        disabled={!isAllMatched || disabled}
        onPress={onSolved}
      />
    </View>
  );
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
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
    marginBottom: 16,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  pillActive: {
    borderColor: '#4F8EF7',
  },
  pillDisabled: {
    opacity: 0.6,
  },
});

export default MatchingPairs;


