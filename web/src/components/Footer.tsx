import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const enablePrivacy = import.meta.env.VITE_ENABLE_PRIVACY_PAGE !== 'false'
const enableTerms = import.meta.env.VITE_ENABLE_TERMS_PAGE !== 'false'
const enableSupport = import.meta.env.VITE_ENABLE_SUPPORT_PAGE === 'true'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white dark:bg-gray-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row sm:justify-between">
        <p>{t('footer.copyright', { year })}</p>
        <nav aria-label={t('footer.nav_label')} className="flex gap-5">
          {enablePrivacy && (
            <Link to="/privacy" className="transition-colors hover:text-indigo-600">
              {t('footer.privacy')}
            </Link>
          )}
          {enableTerms && (
            <Link to="/terms" className="transition-colors hover:text-indigo-600">
              {t('footer.terms')}
            </Link>
          )}
          {enableSupport && (
            <Link to="/support" className="transition-colors hover:text-indigo-600">
              {t('footer.support')}
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
