import type { Meta, StoryObj } from '@storybook/react';
import { VibeCheck } from '@/src/app/prototypes/_components/VibeCheck';

const meta: Meta<typeof VibeCheck> = {
  title: 'Prototypes/Daily Vibe Check',
  component: VibeCheck,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The daily question to prompt the user.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VibeCheck>;

export const Default: Story = {
  args: {
    question: "What's your energy for today?",
  },
};

export const WeekendVibe: Story = {
    args: {
      question: "What's the vibe for the weekend?",
    },
};

export const GratitudeCheck: Story = {
    args: {
      question: "What's one thing you're grateful for right now?",
    },
};
