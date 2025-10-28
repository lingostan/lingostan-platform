import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProgressCard } from './ProgressCard';

const meta: Meta<typeof ProgressCard> = {
  title: 'UI/ProgressCard',
  component: ProgressCard,
  args: {
    title: 'XP',
    value: 120,
    description: 'Experience points',
    icon: { uri: '/assets/images/icons/star.svg' },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCard>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
  },
};


