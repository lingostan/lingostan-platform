import type { Preview } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: '100%', maxWidth: 480 }}>
        <Story />
      </View>
    ),
  ],
};

export default preview;


