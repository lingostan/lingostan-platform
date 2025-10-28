import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AchievementCard } from './AchievementCard';

const meta: Meta<typeof AchievementCard> = {
  title: 'UI/AchievementCard',
  component: AchievementCard,
  args: {
    title: 'Enthusiast',
    progress: 0.6,
    current: 6,
    total: 10,
    description: 'Complete 10 lessons',
    icon: { uri: '/assets/images/achivements/enthusiast.svg' },
  },
};

export default meta;
type Story = StoryObj<typeof AchievementCard>;

export const Default: Story = {};


