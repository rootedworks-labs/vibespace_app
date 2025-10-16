'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/vibes/flow', icon: Compass, label: 'Discover' },
  { href: '/posts/create', icon: PlusSquare, label: 'Create' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile/me', icon: User, label: 'Profile' },
];

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center w-full h-full">
              <item.icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-neutral-500')} />
              <span className={cn('text-xs', isActive ? 'text-primary' : 'text-neutral-500')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}