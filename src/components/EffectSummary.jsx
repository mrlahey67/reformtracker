import { formatPersonsSigned, formatMiaSigned } from '../utils/calculations.js'

function Kpi({ label, value, sekundært, tone = 'default' }) {
  const toneClass = {
    default: 'text-ink',
    positive: 'text-emerald-700',
    negative: 'text-rose-700',
  }[tone]

  return (
    <div className="rounded-md border border-rule bg-white px-4 py-3 shadow-card">
      <div className="text-[11px] uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold num ${toneClass}`}>{value}</div>
      {sekundært && (
        <div className="mt-0.5 text-[12px] text-ink-soft">{sekundært}</div>
      )}
    </div>
  )
}

function tone(n) {
  if (n > 0) return 'positive'
  if (n < 0) return 'negative'
  return 'default'
}

export default function EffectSummary({ sumArbejdsudbud, sumBnp, sumProvenu, antalMedBnp, antalMedProvenu, antalValgt }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Kpi
        label="Samlet arbejdsudbud"
        value={antalValgt ? formatPersonsSigned(sumArbejdsudbud) : '—'}
        sekundært="fuldtidspersoner"
        tone={tone(sumArbejdsudbud)}
      />
      <Kpi
        label="BNP-effekt"
        value={antalValgt ? formatMiaSigned(sumBnp) : '—'}
        sekundært={`baseret på ${antalMedBnp} af ${antalValgt} reformer`}
        tone={tone(sumBnp)}
      />
      <Kpi
        label="Provenu-effekt"
        value={antalValgt ? formatMiaSigned(sumProvenu) : '—'}
        sekundært={`baseret på ${antalMedProvenu} af ${antalValgt} reformer`}
        tone={tone(sumProvenu)}
      />
    </div>
  )
}
