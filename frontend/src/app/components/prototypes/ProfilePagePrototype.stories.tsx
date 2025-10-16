// src/app/components/prototypes/ProfilePagePrototype.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProfilePagePrototype } from './ProfilePagePrototype';

const meta: Meta<typeof ProfilePagePrototype> = {
  title: 'Prototypes/ProfilePage',
  component: ProfilePagePrototype,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfilePagePrototype>;

export const FireDominant: Story = {
  args: {
    username: 'Aiden Sol',
    bio: 'Passionate about building communities and exploring new ideas. Always chasing the next spark of inspiration.',
    dominantVibe: 'fire',
    vibeText: 'Radiates Fire',
  },
};

export const FlowDominant: Story = {
  args: {
    username: 'Luna River',
    bio: 'Finding calm in the chaos. Sharing thoughts on mindfulness, art, and the beauty of the everyday.',
    dominantVibe: 'flow',
    vibeText: 'A Flowing Vibe',
  },
};

export const MagicDominant: Story = {
  args: {
    username: 'Orion Stardust',
    bio: 'Creator of whimsical things and digital dreamscapes. Let\'s make something magical.',
    dominantVibe: 'magic',
    vibeText: 'Full of Magic',
  },
};

export const NewUser: Story = {
  args: {
    username: 'New User',
    bio: 'Just joined Vibespace! Excited to see what it\'s all about.',
    dominantVibe: null,
    vibeText: '',
  },
};