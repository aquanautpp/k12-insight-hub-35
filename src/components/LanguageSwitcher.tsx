import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [lng, setLng] = useState(i18n.language)

  useEffect(() => {
    const h = () => setLng(i18n.language)
    i18n.on('languageChanged', h)
    return () => { i18n.off('languageChanged', h) }
  }, [i18n])

  const change = (code: 'pt-BR' | 'en') => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
  }

  const btn = (code: 'pt-BR' | 'en', label: string, flag: string) => (
    <button
      key={code}
      aria-label={label}
      onClick={() => change(code)}
      className={[
        'h-8 w-8 rounded-full border flex items-center justify-center',
        'text-base leading-none',
        'transition-colors',
        lng === code ? 'bg-sage border-olive' : 'bg-white hover:bg-sand'
      ].join(' ')}
      title={label}
    >
      <span role="img" aria-hidden="true">{flag}</span>
    </button>
  )

  return (
    <div className="flex items-center gap-2">
      {btn('pt-BR', 'Português (Brasil)', '🇧🇷')}
      {btn('en', 'English (US)', '🇺🇸')}
    </div>
  )
}
