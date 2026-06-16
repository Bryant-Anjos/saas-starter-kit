import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import { Layout } from './components/Layout.js'
import { PageSpinner } from './components/LoadingSpinner.js'

const enablePrivacy = import.meta.env.VITE_ENABLE_PRIVACY_PAGE !== 'false'
const enableTerms = import.meta.env.VITE_ENABLE_TERMS_PAGE !== 'false'
const enableSupport = import.meta.env.VITE_ENABLE_SUPPORT_PAGE === 'true'

const m = <T extends Record<string, unknown>>(mod: Promise<T>, key: keyof T) =>
  mod.then(x => ({ default: x[key] as React.ComponentType }))

const LoginPage       = lazy(() => m(import('./pages/LoginPage.js'),       'LoginPage'))
const AuthVerifyPage  = lazy(() => m(import('./pages/AuthVerifyPage.js'),  'AuthVerifyPage'))
const DashboardPage   = lazy(() => m(import('./pages/DashboardPage.js'),   'DashboardPage'))
const PrivacyPage     = lazy(() => m(import('./pages/PrivacyPage.js'),     'PrivacyPage'))
const TermsPage       = lazy(() => m(import('./pages/TermsPage.js'),       'TermsPage'))
const SupportPage     = lazy(() => m(import('./pages/SupportPage.js'),     'SupportPage'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageSpinner />
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

export function App() {
  const { user, loading } = useAuth()

  if (loading) return <PageSpinner />

  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route path="/auth/verify" element={<AuthVerifyPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Add your protected routes here:
          <Route
            path="/my-feature"
            element={
              <ProtectedRoute>
                <Layout><MyFeaturePage /></Layout>
              </ProtectedRoute>
            }
          /> */}

          {enablePrivacy && (
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
          )}
          {enableTerms && (
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
          )}
          {enableSupport && (
            <Route path="/support" element={<Layout><SupportPage /></Layout>} />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
