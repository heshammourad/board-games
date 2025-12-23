import Link from 'next/link';
import type {ReactNode} from 'react';

interface GamePageLayoutProps {
  title: string;
  children: ReactNode;
}

export default function GamePageLayout({title, children}: GamePageLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans dark:bg-black dark:text-zinc-100">
      <main className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            &larr; Back to Games
          </Link>
        </div>
        <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

        <div className="space-y-4">{children}</div>
      </main>
    </div>
  );
}