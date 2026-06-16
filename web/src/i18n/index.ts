import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.js'
import ptBR from './pt-BR.js'

const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en'
const initialLang = browserLang.startsWith('pt') ? 'pt-BR' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: ptBR },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
export type { Translations } from './en.js'
