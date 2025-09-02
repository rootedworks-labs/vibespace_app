// src/app/components/Sidebar.tsx
import Link from 'next/link';
import { Home, User, Settings, Search, Sparkles, Waves, Flame } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 p-4 hidden md:block">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
          <Home className="h-5 w-5" />
          <span className="font-semibold">Home</span>
        </Link>
        <Link href="/search" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
          <Search className="h-5 w-5" />
          <span className="font-semibold">Search</span>
        </Link>
        <Link href="/profile/me" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
          <User className="h-5 w-5" />
          <span className="font-semibold">Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
          <Settings className="h-5 w-5" />
          <span className="font-semibold">Settings</span>
        </Link>
      </nav>

      <div className="mt-8">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discover Vibes</h3>
        <nav className="space-y-2 mt-2">
            <Link href="/vibes/flow" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
                <Waves className="h-5 w-5 text-vibe-flow" />
                <span className="font-semibold">Flow</span>
            </Link>
            <Link href="/vibes/hype" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
                <Flame className="h-5 w-5 text-vibe-hype" />
                <span className="font-semibold">Hype</span>
            </Link>
            <Link href="/vibes/glow" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
                <Sparkles className="h-5 w-5 text-vibe-glow" />
                <span className="font-semibold">Glow</span>
            </Link>
        </nav>
      </div>
    </aside>
  );
}
