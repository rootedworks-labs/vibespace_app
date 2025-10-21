'use client';

import { useEffect, useState } from 'react';
import { viewUserData } from '@/src/app/api';
import { Accordion, AccordionItem } from '@/src/app/components/ui/Accordian';
import { PostCard } from '@/src/app/(main)/_components/PostCard';
import { UserCard } from '@/src/app/components/UserCard';
import { Spinner } from '@/src/app/components/ui/Spinner';
import { Post } from '@/src/app/(main)/_components/PostCard';
import { Card } from '@/src/app/components/ui/Card';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

// Define the structure of the user data we expect
interface UserData {
  profile: {
    id: number;
    username: string;
    email: string;
    bio: string | null;
    website: string | null;
    created_at: string;
    profile_picture_url: string | null;
  };
  posts: Post[];
  comments: {
    id: number;
    post_id: number;
    content: string;
    created_at: string;
  }[];
  vibes_given: {
    id: number;
    post_id: number;
    vibe_type: string;
    created_at: string;
  }[];
  connections: {
    followers: number[];
    following: number[];
  };
}

export default function MyDataPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (fetchData logic remains the same) ...
     const fetchData = async () => {
      try {
        const response = await viewUserData();
        setData(response);
      } catch (err) {
        setError('Failed to fetch your data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- STYLE CHANGE 1: Apply background and full height to the page container ---
  // We use `min-h-full` (or adjust based on your layout's structure)
  // We remove the Card-like styling (border, shadow, rounded) from here
  // Add padding directly here instead of nested div
  return (
    <div className="min-h-full bg-[var(--color-brand-sand)] dark:bg-neutral-900 p-4 md:p-8">
      {isLoading && <div className="flex justify-center items-center pt-10"><Spinner /></div>}
      {error && <div className="pt-10 text-center text-red-500">{error}</div>}
      {!isLoading && !error && !data && <div className="pt-10 text-center">No data found.</div>}
      
      {data && (
        // --- STYLE CHANGE 2: Add a max-width container for content centering ---
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-2">Your VibeSpace Data</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            An open and transparent view of all the data and content associated with your account.
          </p>

          <Accordion>
            <AccordionItem value="profile" header="Profile">
              <ul className="space-y-3 text-sm">
                {/* --- STYLE CHANGE 3: Use slightly darker bg for list items --- */}
                <li className="flex justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <strong>Username:</strong> <span>{data.profile.username}</span>
                </li>
                <li className="flex justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <strong>Email:</strong> <span>{data.profile.email}</span>
                </li>
                <li className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <strong>Bio:</strong>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-300">{data.profile.bio || 'Not set'}</p>
                </li>
                <li className="flex justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <strong>Website:</strong> <span>{data.profile.website || 'Not set'}</span>
                </li>
                <li className="flex justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <strong>Joined:</strong> <span>{new Date(data.profile.created_at).toLocaleString()}</span>
                </li>
              </ul>
            </AccordionItem>

            <AccordionItem value="posts" header={`Posts (${data.posts.length})`}>
              <div className="space-y-4">
                {data.posts.length > 0 ? (
                  data.posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        username: data.profile.username,
                        profile_picture_url: data.profile.profile_picture_url
                      }}
                    />
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">You have not created any posts.</p>
                )}
              </div>
            </AccordionItem>

            <AccordionItem value="comments" header={`Comments (${data.comments.length})`}>
              <div className="space-y-4">
                {data.comments.length > 0 ? (
                  data.comments.map(comment => (
                    // Use Card for consistency
                    <Card key={comment.id} className="p-4 bg-white/70 dark:bg-neutral-800/70">
                      <blockquote className="text-sm italic text-neutral-700 dark:text-neutral-300">
                        "{comment.content}"
                      </blockquote>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        On post {comment.post_id} at {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">You have not made any comments.</p>
                )}
              </div>
            </AccordionItem>

            <AccordionItem value="vibes" header={`Vibes Given (${data.vibes_given.length})`}>
              <div className="space-y-3">
                {data.vibes_given.length > 0 ? (
                  data.vibes_given.map(vibe => (
                    // Use lighter background
                    <div key={vibe.id} className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-[var(--color-vibe-energy)]" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        Gave a <strong>{vibe.vibe_type}</strong> vibe to post {vibe.post_id}
                      </p>
                      <span className="flex-1 text-right text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(vibe.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">You have not given any vibes.</p>
                )}
              </div>
            </AccordionItem>

            <AccordionItem value="connections" header="Connections">
               {/* Use lighter background */}
               <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                 <h3 className="font-heading font-semibold mb-2">Following ({data.connections.following.length})</h3>
                 {data.connections.following.length > 0 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">IDs: {data.connections.following.join(', ')}</p>
                 ) : (
                   <p className="text-sm text-neutral-500 dark:text-neutral-400">You are not following anyone.</p>
                 )}
               </div>

               <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg mt-4">
                 <h3 className="font-heading font-semibold mb-2">Followers ({data.connections.followers.length})</h3>
                 {data.connections.followers.length > 0 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">IDs: {data.connections.followers.join(', ')}</p>
                 ) : (
                   <p className="text-sm text-neutral-500 dark:text-neutral-400">You do not have any followers.</p>
                 )}
               </div>
            </AccordionItem>

          </Accordion>
        </div>
      )}
    </div>
  );
}