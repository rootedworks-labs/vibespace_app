import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './UserCard';

// Define the User type explicitly for the stories
interface User {
  username: string;
  bio?: string | null;
  profile_picture_url?: string | null;
  dominantVibe?: 'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love' | null;
}

const meta: Meta<typeof UserCard> = {
  title: 'Prototypes/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      username: 'Alex Ray',
      bio: 'Exploring the intersection of art, technology, and mindfulness.',
      profile_picture_url: 'https://placehold.co/128x128/a3b8a1/3A4F6B?text=AR',
    },
  },
};

export const WithDominantVibe: Story = {
  args: {
    user: {
      username: 'Jordan Lee',
      bio: 'Bringing the hype and positive energy. Let\'s build something great together.',
      profile_picture_url: 'https://placehold.co/128x128/e2a08a/3A4F6B?text=JL',
      dominantVibe: 'hype',
    },
  },
};

export const NoProfilePicture: Story = {
  args: {
    user: {
      username: 'Sam Jones',
      bio: 'Just joined VibeSpace! Excited to see what it\'s all about.',
      dominantVibe: 'flow',
    },
  },
};

export const LongUsernameAndBio: Story = {
    args: {
      user: {
        username: 'AlexandraConstantinople',
        bio: 'This is a much longer bio designed to test how the line-clamping functionality works to prevent the card from expanding vertically in an uncontrolled way.',
        dominantVibe: 'reflect',
      },
    },
  };