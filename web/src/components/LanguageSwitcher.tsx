import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'
import { cn } from '../lib/utils.js'
import { useAuth } from '../hooks/useAuth.js'
import { api } from '../lib/api.js'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt-BR', label: 'Português (Brasil)', short: 'PT' },
] as const

type LangCode = (typeof LANGUAGES)[number]['code']

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function select(code: LangCode) {
    setOpen(false)
    await i18n.changeLanguage(code)
    if (user) {
      await api.me.update({ language: code })
    }
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-100 shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors"
            >
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
