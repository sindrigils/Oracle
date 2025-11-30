import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-white"
          >
            Oracle
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
