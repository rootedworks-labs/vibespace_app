import type { Meta, StoryObj } from '@storybook/react';
import { ProfileAura } from './ProfileAura';
import { Avatar, AvatarFallback } from '../ui/Avatar';

const meta: Meta<typeof ProfileAura> = {
  title: 'Prototypes/ProfileAura',
  component: ProfileAura,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <Story />
        <Avatar className="h-32 w-32 border-4 border-white relative z-10">
          <AvatarFallback className="text-4xl">VU</AvatarFallback>
        </Avatar>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FlowDominant: Story = {
  args: {
    dominantVibe: 'flow',
  },
};

export const JoyDominant: Story = {
  args: {
    dominantVibe: 'joy',
  },
};

export const HypeDominant: Story = {
  args: {
    dominantVibe: 'hype',
  },
};

export const WarmthDominant: Story = {
  args: {
    dominantVibe: 'warmth',
  },
};

export const GlowDominant: Story = {
  args: {
    dominantVibe: 'glow',
  },
};

export const ReflectDominant: Story = {
  args: {
    dominantVibe: 'reflect',
  },
};

export const LoveDominant: Story = {
  args: {
    dominantVibe: 'love',
  },
};

export const NoVibe: Story = {
  args: {
    dominantVibe: null,
  },
};
