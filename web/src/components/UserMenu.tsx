import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, UserCircle2, Check, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { api } from '../lib/api.js'

export function UserMenu() {
  const { t } = useTranslation()
  const { user, refetch, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasName = !!user?.name

  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.name])

  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 50)

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await api.me.update({ name: name.trim() })
      await refetch()
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setOpen(false)
      }, 900)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteError('')
    setDeleting(true)
    try {
      await api.me.delete()
      await signOut()
    } catch {
      setDeleteError(t('common.error'))
      setDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors max-w-[180px] sm:max-w-xs"
        aria-expanded={open}
      >
        <UserCircle2 className="h-4 w-4 shrink-0 text-gray-400" />
        {hasName ? (
          <span className="truncate font-medium text-gray-700">{user.name}</span>
        ) : (
          <span className="truncate text-indigo-600 font-medium">
            {t('profile.add_name')}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-72 rounded-2xl border border-gray-200 bg-white dark:bg-gray-100 p-4 shadow-xl">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:text-indigo-300">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">{t('profile.your_account')}</p>
              <p className="truncate text-xs text-gray-700">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            {!hasName && (
              <p className="text-xs text-gray-500">{t('profile.add_name_hint')}</p>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('profile.display_name')}
              </label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profile.display_name_placeholder')}
                maxLength={100}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !name.trim() || name.trim() === user.name}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {t('profile.saved')}
                </>
              ) : saving ? (
                t('common.loading')
              ) : (
                t('common.save')
              )}
            </button>
          </form>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {deleteError && (
              <p className="mb-2 text-xs text-red-600">{deleteError}</p>
            )}
            {deleteConfirm ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">{t('profile.delete_account_confirm')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDeleteConfirm(false); setDeleteError('') }}
                    className="flex-1 rounded-lg border border-gray-300 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? t('profile.deleting') : t('common.confirm')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('profile.delete_account')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
