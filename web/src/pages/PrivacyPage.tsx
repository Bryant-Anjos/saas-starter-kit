import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-1.5 text-base font-semibold text-gray-800">{title}</h3>
      <div className="text-gray-600">{children}</div>
    </div>
  )
}

export function PrivacyPage() {
  const { t } = useTranslation()
  usePageTitle(t('privacy.title'))
  usePageMeta({
    path: '/privacy',
    ogTitle: t('privacy.title'),
    ogDescription: t('privacy.intro'),
  })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">{t('privacy.heading')}</h1>
        <p className="text-sm text-gray-400">{t('privacy.last_updated', { date: 'January 2025' })}</p>
        <p className="mt-4 text-gray-600">{t('privacy.intro')}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-100 p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">{t('privacy.data_title')}</h2>

        <Section title={t('privacy.email_title')}>
          <p>{t('privacy.email_text')}</p>
        </Section>

        <Section title={t('privacy.name_title')}>
          <p>{t('privacy.name_text')}</p>
        </Section>

        <Section title={t('privacy.auth_title')}>
          <p>{t('privacy.auth_text')}</p>
        </Section>

        <Section title={t('privacy.email_delivery_title')}>
          <p>{t('privacy.email_delivery_text')}</p>
        </Section>

        <Section title={t('privacy.retention_title')}>
          <p>{t('privacy.retention_text')}</p>
        </Section>

        <Section title={t('privacy.contact_title')}>
          <p>{t('privacy.contact_text')}</p>
        </Section>
      </div>
    </div>
  )
}
