import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        className="px-2 py-1 rounded border hover:bg-sage"
        onClick={() => changeLang('pt-BR')}
        aria-label="Mudar idioma para Português"
      >
        🇧🇷 Português
      </button>
      <button
        className="px-2 py-1 rounded border hover:bg-sage"
        onClick={() => changeLang('en')}
        aria-label="Switch language to English"
      >
        🇺🇸 English
      </button>
    </div>
  )
}
