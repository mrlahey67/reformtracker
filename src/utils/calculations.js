export function sumEffect(reforms, field) {
  return reforms.reduce((acc, r) => {
    const v = r[field]
    return typeof v === 'number' ? acc + v : acc
  }, 0)
}

export function formatNumber(n, { decimals = 0, suffix = '' } = {}) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  const rounded = Number(n).toFixed(decimals)
  const [intPart, decPart] = rounded.split('.')
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const body = decPart ? `${withSep},${decPart}` : withSep
  return suffix ? `${body}${suffix}` : body
}

export function formatPersons(n) {
  if (n === null || n === undefined) return '—'
  return formatNumber(n, { decimals: 0 })
}

export function formatMia(n) {
  if (n === null || n === undefined) return '—'
  const sign = n >= 0 ? '' : '−'
  return `${sign}${formatNumber(Math.abs(n), { decimals: 1 })} mia. kr`
}

export function formatPersonsShort(n) {
  if (n === null || n === undefined) return '—'
  if (Math.abs(n) >= 1000) {
    return `${formatNumber(n / 1000, { decimals: 1 })}k`
  }
  return formatNumber(n, { decimals: 0 })
}

export const KATEGORI_FARVER = {
  'International rekruttering': '#0F4C75',
  'Tilbagetrækning': '#7C3AED',
  'Uddannelse og unge': '#0E7490',
  'Skat og incitamenter': '#B45309',
  'Kontanthjælp og aktivering': '#BE123C',
}

export function kategoriFarve(kategori) {
  return KATEGORI_FARVER[kategori] ?? '#4B5563'
}
