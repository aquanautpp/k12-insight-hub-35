import { test, expect } from '@playwright/test'

// E2E de exemplo: verifica fluxo inicial do onboarding
// Observação: execute o app localmente (pnpm run dev) antes de rodar este teste

test('onboarding básico', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /começar/i }).click()
  await expect(page.getByText(/quem é você/i)).toBeVisible()
})
