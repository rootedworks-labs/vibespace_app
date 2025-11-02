// src/app/components/MobileNavBar.stories.tsx

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNavbar as OriginalMobileNavBar } from './MobileNavBar';

// -- Meta configuration for Storybook --
const meta: Meta = {
  title: 'Components/Navigation/MobileNavBar Prototypes',
  component: OriginalMobileNavBar,
  parameters: {
    layout: 'fullscreen',
    // Mock the Next.js router for the "Original" component
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
    // Add a dark background to better see the bars
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  // Add a decorator to simulate mobile view
  decorators: [
    (Story) => (
      <div className="w-full h-[300px] relative overflow-hidden bg-gray-800">
        <div className="absolute inset-0 border-4 border-gray-600 rounded-lg w-[375px] h-[200px] m-auto" />
        <Story />
      </div>
    ),
  ],
};

export default meta;

// --- 1. Original Component Story ---
// This story shows your existing component for comparison
export const Original: StoryObj = {
  render: () => <OriginalMobileNavBar />,
};

// --- Shared Data and Icons ---
const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/vibes/flow', icon: Compass, label: 'Discover' },
  { href: '/posts/create', icon: PlusSquare, label: 'Create' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile/me', icon: User, label: 'Profile' },
];

// --- Wrapper to make prototypes interactive in Storybook ---
// This component holds the "activePath" state
const InteractiveWrapper = ({
  PrototypeComponent,
}: {
  PrototypeComponent: React.FC<{
    activePath: string;
    onNavigate: (path: string) => void;
  }>;
}) => {
  const [activePath, setActivePath] = useState('/');
  return (
    <PrototypeComponent
      activePath={activePath}
      onNavigate={setActivePath}
    />
  );
};

// --- 2. Prototype: Elevated Action Button ---
const ElevatedActionNavBar = ({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
}) => {
  const mainItems = navItems.filter((item) => item.label !== 'Create');
  const createItem = navItems.find((item) => item.label === 'Create')!;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-full relative">
        {/* Create Button (Elevated) */}
        <a
          href={createItem.href}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(createItem.href);
          }}
          className={cn(
            'absolute left-1/2 -translate-x-1/2 -top-5',
            'flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all',
            activePath === createItem.href
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          )}
        >
          <createItem.icon className="h-7 w-7" />
        </a>

        {/* Other Items */}
        {mainItems.map((item, index) => {
          const isActive = activePath.startsWith(item.href) && (item.href !== '/' || activePath === '/');
          // Add extra margin for the 2nd item to make space for the center button
          const extraMargin = index === 1 ? 'mr-12' : '';
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.href);
              }}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-neutral-500',
                extraMargin
              )}
            >
              <item.icon
                className={cn('h-6 w-6', isActive && 'text-blue-500')}
              />
              <span
                className={cn(
                  'text-xs',
                  isActive ? 'text-blue-500' : 'text-neutral-500'
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export const ElevatedAction: StoryObj = {
  render: () => <InteractiveWrapper PrototypeComponent={ElevatedActionNavBar} />,
};

// --- 3. Prototype: Sliding Pill Indicator ---
const SlidingPillNavBar = ({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
}) => {
  const activeIndex = navItems.findIndex(
    (item) => activePath.startsWith(item.href) && (item.href !== '/' || activePath === '/')
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-full relative">
        {/* Sliding Pill */}
        <div
          className="absolute top-2 left-0 h-12 w-1/5 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          <div className="h-full w-16 mx-auto bg-blue-100 rounded-full" />
        </div>

        {navItems.map((item) => {
          const isActive = activePath.startsWith(item.href) && (item.href !== '/' || activePath === '/');
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.href);
              }}
              className="relative z-10 flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-blue-600' : 'text-neutral-500'
                )}
              />
              <span
                className={cn(
                  'text-xs transition-colors',
                  isActive ? 'text-blue-600 font-medium' : 'text-neutral-500'
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export const SlidingPill: StoryObj = {
  render: () => <InteractiveWrapper PrototypeComponent={SlidingPillNavBar} />,
};

// --- 4. Prototype: Active Label Only ---
const ActiveLabelNavBar = ({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = activePath.startsWith(item.href) && (item.href !== '/' || activePath === '/');
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.href);
              }}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon
                className={cn(
                  'h-6 w-6',
                  isActive ? 'text-blue-500' : 'text-neutral-5G00'
                )}
              />
              {/* Label is only rendered if active */}
              {isActive && (
                <span className="text-xs text-blue-500 font-medium mt-1">
                  {item.label}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export const ActiveLabelOnly: StoryObj = {
  render: () => <InteractiveWrapper PrototypeComponent={ActiveLabelNavBar} />,
};

// --- 5. Prototype: Floating Pill Bar ---
const FloatingPillNavBar = ({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate: (path: string) => void;
}) => {
  return (
    // Note: 'fixed' layout. 'bottom-4' provides the float.
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-full md:hidden">
      <div className="flex justify-around items-center h-14 px-3 gap-2">
        {navItems.map((item) => {
          const isActive = activePath.startsWith(item.href) && (item.href !== '/' || activePath === '/');
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.href);
              }}
              className={cn(
                'flex flex-col items-center justify-center rounded-full h-12 w-12 transition-all',
                isActive
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-neutral-600 hover:bg-gray-100/50'
              )}
            >
              <item.icon className="h-6 w-6" />
              {/* This design has no labels for a minimal look */}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export const FloatingPill: StoryObj = {
  render: () => <InteractiveWrapper PrototypeComponent={FloatingPillNavBar} />,
};