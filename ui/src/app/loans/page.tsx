import Link from 'next/link';
import { Card, CardContent } from '@/core/components';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function LoansPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Loans</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Loans</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Manage your loans and track payment progress.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-orange-100 p-4 dark:bg-orange-900/30">
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
              Loan Manager Coming Soon
            </h2>
            <p className="max-w-sm text-center text-sm text-zinc-500 dark:text-zinc-400">
              Track loans, record payments, and monitor outstanding balances over time.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
