import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { api, ApiError } from '../lib/api.js'
import { LanguageSwitcher } from '../components/LanguageSwitcher.js'
import { ThemeSwitcher } from '../components/ThemeSwitcher.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

const enablePrivacy = import.meta.env.VITE_ENABLE_PRIVACY_PAGE !== 'false'
const enableTerms = import.meta.env.VITE_ENABLE_TERMS_PAGE !== 'false'

export function LoginPage() {
  const { t, i18n } = useTranslation()
  usePageTitle()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? undefined
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.auth.sendMagicLink(email, i18n.language, redirect)
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="absolute top-3 right-4 flex items-center gap-1">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            <p className="text-sm text-gray-500">{t('auth.tagline')}</p>
          </div>

          {sent ? (
            <div className="rounded-2xl bg-green-50 p-6 text-center">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {t('auth.link_sent', { email })}
              </p>
              {import.meta.env.DEV && (
                <p className="mt-2 text-xs text-green-600 dark:text-green-400">{t('auth.link_sent_dev')}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white dark:bg-gray-100 p-6 shadow-sm border border-gray-100">
              <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email_placeholder')}
                aria-describedby={error ? 'email-error' : undefined}
                aria-invalid={error ? true : undefined}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {error && <p id="email-error" role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? t('common.loading') : t('auth.send_link')}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="pb-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
          {enablePrivacy && (
            <Link to="/privacy" className="transition-colors hover:text-indigo-500">
              {t('footer.privacy')}
            </Link>
          )}
          {enablePrivacy && enableTerms && (
            <span aria-hidden="true" className="select-none text-gray-300">·</span>
          )}
          {enableTerms && (
            <Link to="/terms" className="transition-colors hover:text-indigo-500">
              {t('footer.terms')}
            </Link>
          )}
        </nav>
      </footer>
    </div>
  )
}
