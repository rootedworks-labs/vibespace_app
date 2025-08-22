// app/layout.tsx

import { Inter, Mulish } from 'next/font/google';
import './globals.css';

// Configure the fonts with the desired weights and subsets
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Create a CSS variable for Inter
  display: 'swap',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700', '800'], // Specify the weights you'll need
  variable: '--font-mulish',   // Create a CSS variable for Mulish
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Combine the font variable class names on the <html> tag
    <html lang="en" className={`${inter.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}