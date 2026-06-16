import nodemailer from 'nodemailer'
import { getEmailTranslations } from './emailTranslations.js'

// Three sending modes (evaluated in priority order):
//   1. EMAIL_HTTP_URL + EMAIL_HTTP_KEY set → generic HTTP API (use on Railway — SMTP ports are blocked)
//   2. SMTP_HOST set                       → nodemailer SMTP (MailHog in dev, any SMTP provider)
//   3. neither                             → dev mode: print links to console instead of sending
//
// To use Resend: EMAIL_HTTP_URL=https://api.resend.com/emails  EMAIL_HTTP_KEY=re_xxxx
// To use any other provider with a compatible REST API, just point EMAIL_HTTP_URL at their endpoint.

const EMAIL_HTTP_URL = process.env.EMAIL_HTTP_URL
const EMAIL_HTTP_KEY = process.env.EMAIL_HTTP_KEY
const isDev = !EMAIL_HTTP_URL && !process.env.SMTP_HOST

const smtpTransport =
  !isDev && !EMAIL_HTTP_URL
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        // Only include auth when credentials are provided. Servers like MailHog
        // accept connections without authentication and fail if auth is attempted.
        ...(process.env.SMTP_USER
          ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
          : {}),
      })
    : null

const FROM = process.env.EMAIL_FROM ?? 'noreply@starter.local'
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173'

function magicLinkUrl(token: string, redirect?: string) {
  const url = new URL('/auth/verify', WEB_URL)
  url.searchParams.set('token', token)
  if (redirect) url.searchParams.set('redirect', redirect)
  return url.toString()
}

async function send({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text: string
  html: string
}) {
  if (EMAIL_HTTP_URL) {
    let res: Response
    try {
      res = await fetch(EMAIL_HTTP_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${EMAIL_HTTP_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM, to, subject, text, html }),
      })
    } catch (err) {
      console.error({ recipient: to, subject, err }, 'Email HTTP transport: network error')
      throw err
    }
    if (!res.ok) {
      const body = await res.text()
      console.error(
        { recipient: to, subject, status: res.status },
        `Email HTTP transport: provider returned ${res.status}`,
      )
      throw new Error(`Email HTTP API error ${res.status}: ${body}`)
    }
    return
  }

  try {
    await smtpTransport!.sendMail({ from: FROM, to, subject, text, html })
  } catch (err) {
    console.error({ recipient: to, subject, err }, 'Email SMTP transport: send failed')
    throw err
  }
}

export async function sendMagicLink(email: string, token: string, redirect?: string, language?: string) {
  const link = magicLinkUrl(token, redirect)

  if (isDev) {
    console.log(`\n=== Magic Link ===\nTo: ${email}\n${link}\n=================\n`)
    return
  }

  const expiryMinutes = process.env.MAGIC_LINK_EXPIRY_MINUTES ?? '15'
  const t = getEmailTranslations(language)
  await send({
    to: email,
    subject: t.magic_link.subject,
    text: t.magic_link.text(link, expiryMinutes),
    html: t.magic_link.html(link, expiryMinutes),
  })
}
