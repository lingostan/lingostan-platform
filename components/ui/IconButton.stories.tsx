import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconButton } from './IconButton';
import { View } from 'react-native';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  args: {
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <View style={{ width: 24, height: 24, backgroundColor: '#fff', borderRadius: 4 }} />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};


