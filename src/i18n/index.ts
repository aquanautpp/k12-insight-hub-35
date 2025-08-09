import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './pt-BR'
import en from './en'

function resolveInitialLang() {
  const saved = localStorage.getItem('lang')
  if (saved === 'pt-BR' || saved === 'en') return saved
  const nav = (navigator.language || 'en').toLowerCase()
  if (nav.startsWith('pt')) return 'pt-BR'
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources: { 'pt-BR': { translation: ptBR }, en: { translation: en } },
    lng: resolveInitialLang(),
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false },
  })

export default i18n
