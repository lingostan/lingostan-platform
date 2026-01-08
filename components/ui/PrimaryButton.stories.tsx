import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PrimaryButton } from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'UI/PrimaryButton',
  component: PrimaryButton,
  args: {
    title: 'Press me',
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Filled: Story = {
  args: {
    mode: 'filled',
    variant: 'green',
  },
};

export const Outline: Story = {
  args: {
    mode: 'outline',
    variant: 'green',
  },
};

export const Transparent: Story = {
  args: {
    mode: 'transparent',
    variant: 'green',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};


