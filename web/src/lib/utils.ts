import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, type Locale } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const locales: Record<string, Locale> = { en: enUS, 'pt-BR': ptBR }

export function getLocale(lang: string): Locale {
  return locales[lang] ?? enUS
}

export function formatDate(isoDate: string, lang: string): string {
  return format(new Date(isoDate), 'PPP', { locale: getLocale(lang) })
}

export function formatDateTime(isoDate: string, lang: string): string {
  return format(new Date(isoDate), 'PPPp', { locale: getLocale(lang) })
}

export function formatRelative(isoDate: string, lang: string): string {
  return formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: getLocale(lang),
  })
}
