export function sumEffect(reforms, field) {
  return reforms.reduce((acc, r) => {
    const v = r[field]
    return typeof v === 'number' ? acc + v : acc
  }, 0)
}

// Overlap-justeringsheuristik: når flere reformer er i samme kategori,
// rammer de overlappende målgrupper og marginalskat-effekter. Vi anvender
// en grov, kategori-baseret discount-faktor.
//
// VIGTIGT: Faktorerne er konjekturelle og bygger ikke på en publiceret
// dansk overlap-analyse. Brugen markeres tydeligt i UI'en.
//
// På tværs af kategorier antages uafhængighed (faktor 1,0).
const OVERLAP_FAKTOR = {
  1: 1.0,
  2: 0.85,
  3: 0.7,
}

export function overlapFaktor(antalIKategori) {
  if (antalIKategori in OVERLAP_FAKTOR) return OVERLAP_FAKTOR[antalIKategori]
  return 0.6 // gulv for 4+ reformer i samme kategori
}

export function justeretSum(reforms, field) {
  // Grupper reformer efter kategori
  const grupper = new Map()
  for (const r of reforms) {
    if (typeof r[field] !== 'number') continue
    const k = r.kategori
    if (!grupper.has(k)) grupper.set(k, [])
    grupper.get(k).push(r[field])
  }
  // Summér hver gruppe og anvend discount
  let total = 0
  for (const [, værdier] of grupper) {
    const gruppeSum = værdier.reduce((a, b) => a + b, 0)
    const faktor = overlapFaktor(værdier.length)
    total += gruppeSum * faktor
  }
  return total
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

export function formatPersonsSigned(n) {
  if (n === null || n === undefined) return '—'
  const sign = n >= 0 ? '+' : '−'
  return `${sign}${formatNumber(Math.abs(n), { decimals: 0 })}`
}

export function formatMia(n) {
  if (n === null || n === undefined) return '—'
  const sign = n >= 0 ? '' : '−'
  return `${sign}${formatNumber(Math.abs(n), { decimals: 1 })} mia. kr`
}

export function formatMiaSigned(n) {
  if (n === null || n === undefined) return '—'
  const sign = n >= 0 ? '+' : '−'
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
  'Omfordeling og tidlig tilbagetrækning': '#155E75',
}

export function kategoriFarve(kategori) {
  return KATEGORI_FARVER[kategori] ?? '#4B5563'
}
