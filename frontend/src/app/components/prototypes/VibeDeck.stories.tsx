import type { Meta, StoryObj } from '@storybook/react';
import { VibeDeck } from './VibeDeck';

interface Post {
  id: number;
  author: string;
  content: string;
  timeWindow: 'Morning' | 'Afternoon' | 'Evening';
  vibeCounts: {
    flow?: number;
    joy?: number;
    hype?: number;
    love?: number;
    glam?: number;
  };
}

const mockPosts: Post[] = [
    { id: 1, author: 'Alex', content: 'Morning vibes are the best.', timeWindow: 'Morning', vibeCounts: { flow: 8, joy: 5 } },
    { id: 2, author: 'Brenda', content: 'Just finished a great workout!', timeWindow: 'Morning', vibeCounts: { love: 15 } },
    { id: 3, author: 'Chris', content: 'Afternoon coffee break.', timeWindow: 'Afternoon', vibeCounts: { joy: 22, glam: 4 } },
];

const meta: Meta<typeof VibeDeck> = {
  title: 'Prototypes/VibeDeck',
  component: VibeDeck,
  tags: ['autodocs'],
  args: {
    posts: mockPosts,
  },
};

export default meta;
type Story = StoryObj<typeof VibeDeck>;

export const Default: Story = {};