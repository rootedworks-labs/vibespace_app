import type { Meta, StoryObj } from '@storybook/react';
import { VibeCard } from './VibeCard';

const meta: Meta<typeof VibeCard> = {
  title: 'Prototypes/VibeCard',
  component: VibeCard,
  tags: ['autodocs'],
  argTypes: {
    timeWindow: {
      control: 'select',
      options: ['Morning', 'Afternoon', 'Evening'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof VibeCard>;

export const MorningVibe: Story = {
  args: {
    author: 'Corey',
    text: 'I see no changes, wake up in the morning and I ask myself.',
    timeWindow: 'Morning',
    vibeCounts: { flow: 10, joy: 5 },
  },
};

export const MorningVibeWithImage: Story = {
    args: {
    author: 'Jane',
    mediaUrl: 'https://placehold.co/600x400/a3b8a1/3A4F6B?text=VibeSpace',
    mediaType: 'image',
    timeWindow: 'Morning',
    vibeCounts: { flow: 10, glow: 5 },
  },
};

export const MorningVibeWithImageAndText: Story = {
args: {
    author: 'Alex',
    text: 'A little burst of energy to get through the morning!',
    mediaUrl: 'https://placehold.co/600x400/e2a08a/3A4F6B?text=VibeSpace',
    mediaType: 'image',
    timeWindow: 'Morning',
    vibeCounts: { love: 10, glow: 5 },
  },
};

export const MorningVibeWithVideo: Story = {
  args: {
    author: 'Sam',
    text: 'Winding down for the night with some calming visuals.',
    // Note: Using a placeholder video URL. You may need to find a different one if this link breaks.
    mediaUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    mediaType: 'video',
    timeWindow: 'Evening',
    vibeCounts: { hype: 10, reflect: 5 },
  },
};

export const AfternoonVibe: Story = {
  args: {
    author: 'Jane',
    text: 'Hope a garden grows where we danced this afternoon',
    timeWindow: 'Afternoon',
    vibeCounts: { flow: 10, hype: 5 },
  },
};

export const EveningVibe: Story = {
  args: {
    author: 'Alex',
    text: 'What\'s the day without a little night? I\'m just tryna shed a little light',
    timeWindow: 'Evening',
    vibeCounts: { flow: 10, joy: 5 },
  },
};