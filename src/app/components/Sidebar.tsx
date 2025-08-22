// src/app/components/Sidebar.tsx
import Link from 'next/link';
import { Home, User, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 p-4 hidden md:block">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100">
          <Home className="h-5 w-5" />
          <span className="font-semibold">Home</span>
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
    </aside>
  );
}