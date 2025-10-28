import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { BaseInput } from './BaseInput';

const meta: Meta<typeof BaseInput> = {
  title: 'UI/BaseInput',
  component: BaseInput,
  args: {
    label: 'Label',
    placeholder: 'Type here',
    value: '',
    onChangeText: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof BaseInput>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <BaseInput {...args} value={value} onChangeText={setValue} />;
  },
};

export const WithError: Story = {
  args: {
    error: 'Validation error',
  },
};


