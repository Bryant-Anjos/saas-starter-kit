import { type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Layers } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useMutation } from '@tanstack/react-query'
import { LanguageSwitcher } from './LanguageSwitcher.js'
import { ThemeSwitcher } from './ThemeSwitcher.js'
import { UserMenu } from './UserMenu.js'
import { Footer } from './Footer.js'

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const { mutate: handleSignOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => navigate('/'),
  })

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
      >
        {t('a11y.skip_to_content')}
      </a>

      <header className="border-b border-gray-200 bg-white dark:bg-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600">
            <Layers className="h-6 w-6" aria-hidden="true" />
            <span className="font-bold text-lg">{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-1" role="toolbar" aria-label="Site controls">
            <ThemeSwitcher />
            <LanguageSwitcher />
            {user && (
              <>
                <UserMenu />
                <button
                  onClick={() => handleSignOut()}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                  title={t('auth.sign_out')}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:block">{t('auth.sign_out')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  )
}
