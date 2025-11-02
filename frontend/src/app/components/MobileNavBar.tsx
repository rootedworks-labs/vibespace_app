'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react'; // Import useEffect and useState

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/vibes/flow', icon: Compass, label: 'Discover' },
  { href: '/posts/create', icon: PlusSquare, label: 'Create' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  // Ensure the profile link points to the dynamic profile page or a static 'me' page
  // If your dynamic route is '/profile/[username]', '/profile/me' might need special handling
  // or you might fetch the actual username to build the link
  { href: '/profile/me', icon: User, label: 'Profile' },
];

export function MobileNavbar() {
  const pathname = usePathname();
  // State to manage the active index for the sliding animation
  const [activeIndex, setActiveIndex] = useState(-1);

  // Effect to update activeIndex when pathname changes
  useEffect(() => {
    const newActiveIndex = navItems.findIndex(
      (item) =>
        // Handle the root path explicitly
        (item.href === '/' && pathname === '/') ||
        // Handle other paths
        (item.href !== '/' && pathname?.startsWith(item.href))
    );
    setActiveIndex(newActiveIndex);
  }, [pathname]); // Re-run effect when pathname changes

  // Calculate the width based on the number of items and desired spacing
  // Each 'cell' for an icon will be 68px wide (60px for pill + 8px padding/gap)
  const navWidth = navItems.length * 68; // 5 * 68 = 340px

  return (
    // 1. Floating Pill Container
    <nav
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2', // Centering and floating
        'bg-white/70 backdrop-blur-md', // Styling with blur
        'border border-white/20', // Subtle border
        'shadow-xl rounded-full', // Pill shape and shadow
        'md:hidden' // Hide on medium screens and up
      )}
      style={{ width: `${navWidth}px` }} // Set the calculated width
    >
      {/* This div holds the icons and the sliding pill. */}
      <div className="flex items-center h-14 relative w-full">
        {/* 2. Sliding Pill Indicator - Only render if an item is active */}
        {activeIndex !== -1 && (
          <div
            className={cn(
              'absolute top-1 left-1 h-12 w-[60px]', // Pill size (slightly smaller than cell)
              'rounded-full bg-blue-100', // Pill color
              'transition-transform duration-300 ease-in-out' // Animation
            )}
            style={{ transform: `translateX(${activeIndex * 68}px)` }} // Slide animation
          />
        )}

        {/* 3. Nav Items (using Next.js Link) */}
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <Link
              key={item.label}
              href={item.href}
              // Each item takes up a 'cell' of 68px
              className={cn(
                'relative z-10 flex items-center justify-center',
                'w-[68px] h-full', // Cell size
                'outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full' // Accessibility focus style
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors', // Icon size and transition
                  isActive
                    ? 'text-blue-600' // Active color
                    : 'text-neutral-600 hover:text-neutral-900' // Default and hover colors
                )}
              />
              {/* No labels for this minimal design */}
              <span className="sr-only">{item.label}</span> {/* Screen reader label */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}