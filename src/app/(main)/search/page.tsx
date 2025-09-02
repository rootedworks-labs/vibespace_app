'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/src/app/components/ui/Input';
import { UserCard } from '@/src/app/components/prototypes/UserCard';
import { Spinner } from '@/src/app/components/ui/Spinner';
import api from '@/src/app/api';
import { Search } from 'lucide-react';

// Define the shape of a user object from the API
interface User {
  username: string;
  bio?: string | null;
  profile_picture_url?: string | null;
  dominantVibe?: 'flow' | 'joy' | 'hype' | 'warmth' | 'glow' | 'reflect' | 'love' | null;
}

// A simple debounce hook to prevent excessive API calls
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]); // Use the User interface here
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      api.get(`/users/search?q=${debouncedQuery}`)
        .then(res => {
          setResults(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Search failed:", err);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Search Users</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for a username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((user) => (
              <UserCard key={user.username} user={user} />
            ))}
          </div>
        )}
        {!isLoading && results.length === 0 && query && (
          <p className="text-center text-gray-500">No users found for "{query}"</p>
        )}
      </div>
    </div>
  );
}
