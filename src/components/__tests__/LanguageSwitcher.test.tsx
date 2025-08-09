/// <reference types="vitest" />
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import React from 'react'

function Probe() {
  const { t } = useTranslation()
  return <h2 data-testid="title">{t('dashboard.title')}</h2>
}

test('troca para inglês e volta para pt-BR', async () => {
  const ui = (
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
      <Probe />
    </I18nextProvider>
  )
  render(ui)
  const title = () => screen.getByTestId('title')

  // Inicial deve ser pt-BR (Painel)
  expect(title().textContent?.toLowerCase()).toContain('painel')

  // Clica 🇺🇸 e confere "Dashboard"
  await userEvent.click(screen.getByRole('button', { name: /english|inglês|us|🇺🇸/i }))
  expect(title().textContent?.toLowerCase()).toContain('dashboard')

  // Volta para 🇧🇷
  await userEvent.click(screen.getByRole('button', { name: /português|portugues|brasil|🇧🇷/i }))
  expect(title().textContent?.toLowerCase()).toContain('painel')
})
