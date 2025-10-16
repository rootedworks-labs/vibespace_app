import type { Meta, StoryObj } from '@storybook/react';
import { TimeWindowedFeed } from './TimeWindowedFeed';

const meta: Meta<typeof TimeWindowedFeed> = {
  title: 'Prototypes/TimeWindowedFeed',
  component: TimeWindowedFeed,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TimeWindowedFeed>;

export const Default: Story = {};