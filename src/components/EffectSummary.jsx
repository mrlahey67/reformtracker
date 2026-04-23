import { formatPersons, formatMia } from '../utils/calculations.js'

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

export default function EffectSummary({ sumArbejdsudbud, sumBnp, sumProvenu, antalMedBnp, antalMedProvenu, antalValgt }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Kpi
        label="Samlet arbejdsudbud"
        value={antalValgt ? `+${formatPersons(sumArbejdsudbud)}` : '—'}
        sekundært="fuldtidspersoner"
        tone="positive"
      />
      <Kpi
        label="BNP-effekt"
        value={antalValgt ? `+${formatMia(sumBnp)}` : '—'}
        sekundært={`baseret på ${antalMedBnp} af ${antalValgt} reformer`}
        tone="positive"
      />
      <Kpi
        label="Provenu-effekt"
        value={antalValgt ? `${sumProvenu >= 0 ? '+' : ''}${formatMia(sumProvenu)}` : '—'}
        sekundært={`baseret på ${antalMedProvenu} af ${antalValgt} reformer`}
        tone={sumProvenu >= 0 ? 'positive' : 'negative'}
      />
    </div>
  )
}
