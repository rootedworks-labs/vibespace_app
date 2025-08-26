// src/app/(prototypes)/layout.tsx
import Link from 'next/link';

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-neutral-100 p-4 border-r">
        <h2 className="font-bold font-heading text-lg mb-4">VibeSpace Prototypes</h2>
        <nav className="flex flex-col space-y-2">
          {/* We'll add links to other prototypes here later */}
          <Link href="/prototypes/energy-stream" className="hover:underline">Energy Stream</Link>
          <Link href="/prototypes/vibe-check" className="hover:underline">Vibe Check</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}