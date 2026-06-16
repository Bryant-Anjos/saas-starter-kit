import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Check, Coffee, ExternalLink, Bitcoin } from 'lucide-react'
import QRCode from 'react-qr-code'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { buildPixPayload } from '../lib/pixBrCode.js'

const pixKey = import.meta.env.VITE_PIX_KEY as string | undefined
const bmcUrl = import.meta.env.VITE_BUY_ME_A_COFFEE_URL as string | undefined
const bitcoinAddress = import.meta.env.VITE_BITCOIN_ADDRESS as string | undefined

function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-green-600" />
        : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : label}
    </button>
  )
}

export function SupportPage() {
  const { t } = useTranslation()
  usePageTitle(t('support.page_title'))

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('support.title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{t('support.message')}</p>
      </div>

      {pixKey && (
        <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-100 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-green-700">
              PIX
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{t('support.pix_title')}</h2>
          </div>
          <p className="mb-5 text-sm text-gray-500">{t('support.pix_desc')}</p>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <QRCode value={buildPixPayload(pixKey)} size={180} />
            </div>
            <code className="block w-full rounded-lg bg-gray-200 px-3 py-2 text-center font-mono text-sm text-gray-800 break-all">
              {pixKey}
            </code>
            <CopyButton value={pixKey} label={t('support.pix_copy')} copiedLabel={t('support.pix_copied')} />
          </div>
        </div>
      )}

      {bmcUrl && (
        <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-100 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t('support.bmc_title')}</h2>
          </div>
          <p className="mb-5 text-sm text-gray-500">{t('support.bmc_desc')}</p>
          <a
            href={bmcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            <Coffee className="h-4 w-4" />
            {t('support.bmc_button')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {bitcoinAddress && (
        <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-100 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t('support.bitcoin_title')}</h2>
          </div>
          <p className="mb-5 text-sm text-gray-500">{t('support.bitcoin_desc')}</p>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <QRCode value={`bitcoin:${bitcoinAddress}`} size={180} />
            </div>
            <code className="block w-full rounded-lg bg-gray-200 px-3 py-2 text-center font-mono text-sm text-gray-800 break-all">
              {bitcoinAddress}
            </code>
            <CopyButton value={bitcoinAddress} label={t('support.bitcoin_copy')} copiedLabel={t('support.bitcoin_copied')} />
          </div>
        </div>
      )}
    </div>
  )
}
