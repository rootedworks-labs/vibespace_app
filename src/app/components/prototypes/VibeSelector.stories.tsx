// src/app/components/prototypes/VibeSelector.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { VibeSelector } from './VibeSelector';

const meta: Meta<typeof VibeSelector> = {
  title: 'Prototypes/VibeSelector',
  component: VibeSelector,
  tags: ['autodocs'],
  argTypes: {
    onVibeSelect: { action: 'vibeSelected' },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VibeSelector>;

// Default story showing all vibes at default size
export const Default: Story = {
  args: {
    size: 'default',
  },
};

// New story for a smaller variant
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

// New story for a larger variant
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// New story showing only a limited, custom set of vibes
export const LimitedSet: Story = {
  args: {
    size: 'default',
    vibesToShow: ['joy', 'hype', 'love'],
  },
};
