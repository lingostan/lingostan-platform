import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseCaption } from '@/components/ui/BaseCaption';
import { BookIcon } from '@/components/icons/BookIcon';

interface CurrentModuleProps {
  title?: string;
  description?: string;
}

export const CurrentModule: React.FC<CurrentModuleProps> = ({
  title = 'Модуль 1',
  description = 'Базовые слова',
}) => {
  return (
    <View style={styles.module}>
      <BaseCaption
        title={title}
        desc={description}
        icon={<BookIcon />}
        variant="green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  module: {
    marginBottom: 20,
  },
});

