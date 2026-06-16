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
      <h2 className="mb-1.5 text-base font-semibold text-gray-800">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  )
}

export function TermsPage() {
  const { t } = useTranslation()
  usePageTitle(t('terms.title'))
  usePageMeta({
    path: '/terms',
    ogTitle: t('terms.title'),
    ogDescription: t('terms.intro'),
  })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">{t('terms.heading')}</h1>
        <p className="text-sm text-gray-400">{t('terms.last_updated', { date: 'January 2025' })}</p>
        <p className="mt-4 text-gray-600">{t('terms.intro')}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-100 p-6">
        <Section title={t('terms.service_title')}>
          <p>{t('terms.service_text')}</p>
        </Section>

        <Section title={t('terms.availability_title')}>
          <p>{t('terms.availability_text')}</p>
        </Section>

        <Section title={t('terms.responsibility_title')}>
          <p>{t('terms.responsibility_text')}</p>
        </Section>

        <Section title={t('terms.acceptable_use_title')}>
          <p>{t('terms.acceptable_use_text')}</p>
        </Section>

        <Section title={t('terms.liability_title')}>
          <p>{t('terms.liability_text')}</p>
        </Section>

        <Section title={t('terms.contact_title')}>
          <p>{t('terms.contact_text')}</p>
        </Section>
      </div>
    </div>
  )
}
