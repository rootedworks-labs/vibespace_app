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
    id: 1,
    author: 'Corey',
    text: 'Y\'all are witnessing elegance in the form of a black elephant.',
    timeWindow: 'Morning',
    vibeCounts: { flow: 10, joy: 5 },
  },
};

export const MorningVibeWithImage: Story = {
    args: {
      id: 2,
      
      author: 'Vibespace',
      avatarUrl: 'vibespace-logo-transparent-hardmark.png',
      mediaUrl: 'https://placehold.co/600x400/a3b8a1/3A4F6B?text=VibeSpace',
      mediaType: 'image',
      timeWindow: 'Afternoon',
      vibeCounts: { flow: 10, glow: 5, joy: 15 },
      
    },
};

export const MorningVibeWithImageAndText: Story = {
args: {
  id: 3,
  author: "VibeSpace",
  text: "",
  mediaUrl: 'https://placehold.co/600x400/e2a08a/3A4F6B?text=VibeSpace',
  mediaType: 'image',
  timeWindow: "Afternoon",
  vibeCounts: { flow: 3, glow:2 },
  avatarUrl: "vibespace-logo-transparent-hardmask.png"
},
};

export const MorningVibeWithVideo: Story = {
  args: {
    id: 4,
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
    id: 5,
    author: 'Jane',
    text: 'I need a hundred round drum for the bullshit.',
    timeWindow: 'Afternoon',
    vibeCounts: { flow: 10, hype: 5 },
  },
};

export const EveningVibe: Story = {
  args: {
    id: 6,
    author: 'Alex',
    text: 'What\'s the day without a little night? I\'m just tryna shed a little light',
    timeWindow: 'Evening',
    vibeCounts: { flow: 10, joy: 5 },
  },
};

export const ForInstagramReel: Story = {
  args: {
    id: 7,
    author: 'VibeSpace',
    avatarUrl: 'vibespace-logo-transparent-hardmask.png',
    text: 'This is a sample post for our Instagram Reel! It shows how a real post will look and feel on VibeSpace.',
    timeWindow: 'Afternoon',
    vibeCounts: { flow: 25, joy: 18, hype: 12 },
  },
};

