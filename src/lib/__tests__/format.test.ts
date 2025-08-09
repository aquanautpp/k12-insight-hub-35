/// <reference types="vitest" />
import { test, expect } from 'vitest'
import i18n from '@/i18n'
import { formatNumber, formatPercent, formatCurrency, formatDate, formatRelative } from '@/lib/format'

test('formatos em pt-BR', () => {
  i18n.changeLanguage('pt-BR')
  expect(formatNumber(1234.5)).toMatch(/1\.234,5|1.234,5/)
  expect(formatPercent(0.42)).toMatch(/42/)// pode ser "42%" ou "42 %"
  expect(formatCurrency(10)).toMatch(/R\$\s?10/)
})

test('formatos em en-US', () => {
  i18n.changeLanguage('en')
  expect(formatNumber(1234.5)).toMatch(/1,234\.5|1,234.5/)
  expect(formatPercent(0.5)).toMatch(/50/)
  expect(formatCurrency(10,'USD')).toMatch(/\$\s?10/)
})

test('data e relativo', () => {
  i18n.changeLanguage('en')
  const past = new Date(Date.now() - 2 * 24 * 3600 * 1000)
  expect(formatDate(past, 'short')).toBeTruthy()
  expect(formatRelative(past)).toBeTruthy()
})
