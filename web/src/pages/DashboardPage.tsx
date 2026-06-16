import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  usePageTitle(`${t('dashboard.title')} – ${t('app.name')}`)

  const welcome = user?.name
    ? t('dashboard.welcome', { name: `, ${user.name}` })
    : t('dashboard.welcome_unnamed')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{welcome}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('dashboard.subtitle')}</p>
      </div>

      {/* ── Starter placeholder ──────────────────────────────────────────────
          Replace this section with your actual features.
          The user object is available from useAuth() with: id, email, name, language.
      ────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white dark:bg-gray-100 p-8 text-center">
        <p className="text-sm text-gray-400">
          Your features go here.
        </p>
      </div>
    </div>
  )
}
