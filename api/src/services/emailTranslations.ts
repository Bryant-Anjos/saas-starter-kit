const SUPPORTED_LANGUAGES = ['en', 'pt-BR'] as const
type Language = (typeof SUPPORTED_LANGUAGES)[number]

// Replace "Starter App" with your app name before shipping.
const APP_NAME = process.env.APP_NAME ?? 'Starter App'

const translations = {
  en: {
    magic_link: {
      subject: `Your ${APP_NAME} sign-in link`,
      text: (link: string, expiryMinutes: string) =>
        `Click this link to sign in to ${APP_NAME}:\n\n${link}\n\nThis link expires in ${expiryMinutes} minutes.`,
      html: (link: string, expiryMinutes: string) =>
        `<p>Click the link below to sign in to ${APP_NAME}:</p>\n<p><a href="${link}">Sign in</a></p>\n<p>This link expires in ${expiryMinutes} minutes.</p>`,
    },
  },
  'pt-BR': {
    magic_link: {
      subject: `Seu link de acesso ao ${APP_NAME}`,
      text: (link: string, expiryMinutes: string) =>
        `Clique neste link para entrar no ${APP_NAME}:\n\n${link}\n\nEste link expira em ${expiryMinutes} minutos.`,
      html: (link: string, expiryMinutes: string) =>
        `<p>Clique no link abaixo para entrar no ${APP_NAME}:</p>\n<p><a href="${link}">Entrar</a></p>\n<p>Este link expira em ${expiryMinutes} minutos.</p>`,
    },
  },
} as const

export function resolveLanguage(lang?: string | null): Language {
  if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    return lang as Language
  }
  return 'en'
}

export function getEmailTranslations(lang?: string | null) {
  return translations[resolveLanguage(lang)]
}
