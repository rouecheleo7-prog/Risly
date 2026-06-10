import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'CHF' | 'EUR'): string {
  const symbol = currency === 'CHF' ? 'CHF' : '€'
  return `${symbol} ${amount.toFixed(2)}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
