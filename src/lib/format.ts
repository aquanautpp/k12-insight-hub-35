import i18n from '@/i18n'

function locale() {
  const lng = i18n.language || 'en'
  return lng === 'pt-BR' ? 'pt-BR' : 'en-US'
}

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale(), opts).format(n)
}

export function formatPercent(frac: number, digits = 0) {
  return new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: digits }).format(frac)
}

export function formatCurrency(amount: number, currency?: 'BRL'|'USD') {
  const cur = currency ?? (locale() === 'pt-BR' ? 'BRL' : 'USD')
  return new Intl.NumberFormat(locale(), { style: 'currency', currency: cur }).format(amount)
}

export function formatDate(d: Date | string | number, style: 'short'|'medium'|'long' = 'medium') {
  const date = d instanceof Date ? d : new Date(d)
  const map: Record<typeof style, Intl.DateTimeFormatOptions> = {
    short: { year: '2-digit', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: '2-digit' },
  }
  return new Intl.DateTimeFormat(locale(), map[style]).format(date)
}

export function formatTime(d: Date | string | number) {
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(date)
}

export function formatDateTime(d: Date | string | number) {
  const date = d instanceof Date ? d : new Date(d)
  return new Intl.DateTimeFormat(locale(), {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

export function formatRelative(d: Date | string | number) {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = date.getTime() - Date.now()
  const abs = Math.abs(diffMs)
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' })

  const sec = 1000, min = 60*sec, hr = 60*min, day = 24*hr, week = 7*day
  if (abs < min) return rtf.format(Math.round(diffMs / sec), 'second')
  if (abs < hr)  return rtf.format(Math.round(diffMs / min), 'minute')
  if (abs < day) return rtf.format(Math.round(diffMs / hr), 'hour')
  if (abs < week) return rtf.format(Math.round(diffMs / day), 'day')
  return rtf.format(Math.round(diffMs / week), 'week')
}

export function formatDuration(ms: number) {
  const totalSec = Math.max(0, Math.round(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const L = locale()
  const H = L === 'pt-BR' ? 'h' : 'h'
  const M = L === 'pt-BR' ? 'm' : 'm'
  const S = L === 'pt-BR' ? 's' : 's'
  if (h) return `${h}${H} ${m}${M}`
  if (m) return `${m}${M} ${s}${S}`
  return `${s}${S}`
}
