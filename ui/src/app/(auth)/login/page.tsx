"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/api/auth/context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Loader } from "@/core/components/ui/loader";
import { AxiosError } from "@/lib/axios";

interface ApiError {
  detail: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login, isLoggingIn } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check if redirected from registration
  const showRegistrationSuccess = searchParams.get("registered") === "true";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({ identifier, password });
      router.push("/");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.data?.detail) {
        setError(axiosError.response.data.detail);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Don't render form if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your Oracle account</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {showRegistrationSuccess && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
              Account created successfully! Please sign in.
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <Input
            label="Email or Username"
            type="text"
            name="identifier"
            placeholder="Enter your email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isLoggingIn}
            autoComplete="username"
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoggingIn}
            autoComplete="current-password"
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" fullWidth isLoading={isLoggingIn}>
            Sign in
          </Button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
