import type { Meta, StoryObj } from '@storybook/react';
import { SunDialNavigator } from './SunDialNavigator';

const meta: Meta<typeof SunDialNavigator> = {
  title: 'Prototypes/SunDialNavigator',
  component: SunDialNavigator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SunDialNavigator>;

export const Default: Story = {};