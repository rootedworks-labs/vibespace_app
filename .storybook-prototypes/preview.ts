import React from 'react';
import type { Preview, Decorator } from '@storybook/nextjs-vite';
import { Inter, Mulish } from 'next/font/google';
import '@/src/app/globals.css';

// Configure the fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-mulish',
});

// Create a decorator to apply the font classes
const fontDecorator: Decorator = (Story) => {
  // Use React.createElement to avoid JSX in a .ts file
  return React.createElement('div', {
    className: `${inter.variable} ${mulish.variable} font-sans`
  }, React.createElement(Story));
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
  // Add the decorator here
  decorators: [fontDecorator],
};

export default preview;
