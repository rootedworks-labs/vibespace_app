import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { PostCard } from './PostCard';
import { useAuthStore } from '../../store/authStore';
import { fn } from 'storybook/test';
 
// Mock Post Data
const mockPost = {
  id: 1,
  user_id: 2,
  username: 'storybook_user',
  profile_picture_url: 'https://github.com/shadcn.png',
  content: 'This is a post from Storybook! It demonstrates how the component renders with standard content.',
  created_at: new Date().toISOString(),
  like_count: 10,
  has_liked: false,
};

// A Storybook decorator to mock the Zustand auth store.
// It reads a mock user from the story's args.
const withMockAuthStore = (Story, context) => {
  const { user } = context.args; // Get mock user from story args

  // Set the state of the store before rendering the story
  useAuthStore.setState({ user: user || null, token: user ? 'fake-token' : null });

  return <Story />;
};

const meta: Meta<typeof PostCard> = {
  title: 'Components/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  argTypes: {
    // We add a 'user' arg here so we can control the mock auth store per story
    user: { control: 'object' },
  },
  // Decorators apply to all stories in this file
  decorators: [
    // Mock SWR's mutate function so the component doesn't crash
    (Story) => (
      <SWRConfig value={{ mutate: fn() }}>
        <Story />
      </SWRConfig>
    ),
    // Apply the mock auth store decorator
    withMockAuthStore,
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story 1: A standard post from another user
export const Default: Story = {
  args: {
    post: mockPost,
    // The current user is not the author of the post
    user: { id: 99, username: 'current_user' },
  },
};

// Story 2: A post that the current user has liked
export const Liked: Story = {
  args: {
    ...Default.args,
    post: {
      ...mockPost,
      has_liked: true,
      like_count: 11,
    },
  },
};

// Story 3: A post authored by the current user, showing the delete dropdown
export const AuthoredByCurrentUser: Story = {
  args: {
    post: {
      ...mockPost,
      user_id: 1, // This user_id matches the mock current user's id
    },
    // The current user *is* the author
    user: { id: 1, username: 'current_user' },
  },
};

// Story 4: A post without a profile picture to test the AvatarFallback
export const NoProfilePicture: Story = {
  args: {
    ...Default.args,
    post: {
      ...mockPost,
      profile_picture_url: null,
    },
  },
};
