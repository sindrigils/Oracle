import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/core/components';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
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
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Settings</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Manage your household and members.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Household Members</CardTitle>
              <CardDescription>Add or manage members in your household.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Member management coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
