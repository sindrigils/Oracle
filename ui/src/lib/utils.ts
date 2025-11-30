import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d);
}

// Case conversion utilities

// Convert snake_case string to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert camelCase string to snake_case
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Recursively convert object keys to camelCase
export function snakeToCamel<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = snakeToCamel(value);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
}

// Recursively convert object keys to snake_case
export function camelToSnake<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[toSnakeCase(key)] = camelToSnake(value);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
}
