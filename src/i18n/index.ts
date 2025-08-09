import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './pt-BR'
import en from './en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      en: { translation: en },
    },
    lng: localStorage.getItem('lang') || 'pt-BR',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
