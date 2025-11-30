import Link from 'next/link';
import { Card, CardTitle, CardDescription, CardContent } from '@/core/components';
import { Wallet, TrendingUp, CreditCard, PiggyBank, Settings } from 'lucide-react';

const features = [
  {
    title: 'Monthly Budget',
    description: 'Track your monthly income and expenses by category',
    href: '/budget',
    icon: Wallet,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: 'Investments',
    description: 'Monitor your investment portfolio and transactions',
    href: '/investments',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    title: 'Loans',
    description: 'Manage loans and track payment progress',
    href: '/loans',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    title: 'Net Worth',
    description: 'View your overall financial position',
    href: '/networth',
    icon: PiggyBank,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    title: 'Settings',
    description: 'Manage household members and preferences',
    href: '/settings',
    icon: Settings,
    color: 'text-zinc-600',
    bgColor: 'bg-zinc-100 dark:bg-zinc-800',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Oracle</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome to Oracle
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Manage your household finances in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
