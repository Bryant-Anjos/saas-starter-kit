import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.js'
import { api, ApiError } from '../lib/api.js'
import { LoadingSpinner } from '../components/LoadingSpinner.js'

export function AuthVerifyPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refetch } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = params.get('token')
    const redirect = params.get('redirect') ?? '/dashboard'
    if (!token) { setError(t('auth.invalid_token')); return }

    api.auth.verify(token)
      .then(() => refetch())
      .then(() => navigate(redirect, { replace: true }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) {
          if (err.code === 'ALREADY_USED') {
            setError(t('auth.token_already_used'))
          } else {
            setError(t('auth.expired_token'))
          }
        } else {
          setError(t('auth.invalid_token'))
        }
      })
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-sm rounded-2xl bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-indigo-600 underline"
          >
            {t('common.back')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-sm text-gray-500">{t('auth.verifying')}</p>
    </div>
  )
}
