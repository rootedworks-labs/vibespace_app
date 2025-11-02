import type { Meta, StoryObj } from '@storybook/react';
import { EnergyStream } from './EnergyStream';

const meta: Meta<typeof EnergyStream> = {
  title: 'Prototypes/EnergyStream',
  component: EnergyStream,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4 border rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EnergyStream>;

// Story for a post with a mix of vibes
export const Default: Story = {
  args: {
    vibeCounts: {
      joy: 15,
      hype: 5,
      love: 8,
    },
  },
};

// Story for a post where one vibe is clearly dominant
export const JoyDominant: Story = {
  args: {
    vibeCounts: {
      glow: 30,
      flow: 3,
      warmth: 5,
    },
  },
};

// Story for a post with only a few vibes
export const LightEngagement: Story = {
  args: {
    vibeCounts: {
      flow: 2,
      glow: 1,
    },
  },
};

// Story for the empty state when a post has no vibes
export const Empty: Story = {
  args: {
    vibeCounts: {},
  },
};