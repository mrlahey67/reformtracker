import { formatPersonsSigned, formatMiaSigned } from '../utils/calculations.js'

function Kpi({ label, value, sekundært, tone = 'default', sammenligning, justeret }) {
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
      {justeret && (
        <div className="mt-1 flex items-baseline gap-1.5 text-[11px]">
          <span className="text-ink-soft uppercase tracking-wider">
            Konservativt
          </span>
          <span
            className={`num font-medium ${
              justeret.tone === 'positive'
                ? 'text-emerald-700'
                : justeret.tone === 'negative'
                ? 'text-rose-700'
                : 'text-ink'
            }`}
          >
            {justeret.værdi}
          </span>
        </div>
      )}
      {sekundært && !sammenligning && (
        <div className="mt-0.5 text-[12px] text-ink-soft">{sekundært}</div>
      )}
      {sammenligning && (
        <div className="mt-2 pt-2 border-t border-rule space-y-0.5 text-[11.5px]">
          <div className="flex items-baseline justify-between">
            <span className="text-ink-soft truncate" title={sammenligning.navn}>
              vs. {sammenligning.navn}
            </span>
            <span className="num text-ink-muted shrink-0 ml-2">
              {sammenligning.værdi}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-ink-soft">Forskel (Δ)</span>
            <span
              className={`num font-medium shrink-0 ml-2 ${
                sammenligning.deltaTone === 'positive'
                  ? 'text-emerald-700'
                  : sammenligning.deltaTone === 'negative'
                  ? 'text-rose-700'
                  : 'text-ink'
              }`}
            >
              {sammenligning.delta}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function tone(n) {
  if (n > 0) return 'positive'
  if (n < 0) return 'negative'
  return 'default'
}

export default function EffectSummary({
  sumArbejdsudbud,
  sumBnp,
  sumProvenu,
  antalMedBnp,
  antalMedProvenu,
  antalValgt,
  sammenligning,
  justeretArbejdsudbud,
  justeretBnp,
  justeretProvenu,
  visKonservativt,
}) {
  function lavSammenligning(felt, formatter) {
    if (!sammenligning) return null
    const aVal = felt === 'arbejdsudbud' ? sumArbejdsudbud : felt === 'bnp' ? sumBnp : sumProvenu
    const bVal = sammenligning[felt]
    const delta = aVal - bVal
    return {
      navn: sammenligning.navn,
      værdi: formatter(bVal),
      delta: formatter(delta),
      deltaTone: tone(delta),
    }
  }

  function lavJusteret(naivVal, justeretVal, formatter) {
    if (!visKonservativt || !antalValgt) return null
    if (Math.abs(justeretVal - naivVal) < 0.01) return null
    return {
      værdi: formatter(justeretVal),
      tone: tone(justeretVal),
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Kpi
        label="Samlet arbejdsudbud"
        value={antalValgt ? formatPersonsSigned(sumArbejdsudbud) : '—'}
        sekundært="fuldtidspersoner"
        tone={tone(sumArbejdsudbud)}
        sammenligning={lavSammenligning('arbejdsudbud', formatPersonsSigned)}
        justeret={lavJusteret(sumArbejdsudbud, justeretArbejdsudbud, formatPersonsSigned)}
      />
      <Kpi
        label="BNP-effekt"
        value={antalValgt ? formatMiaSigned(sumBnp) : '—'}
        sekundært={`baseret på ${antalMedBnp} af ${antalValgt} reformer`}
        tone={tone(sumBnp)}
        sammenligning={lavSammenligning('bnp', formatMiaSigned)}
        justeret={lavJusteret(sumBnp, justeretBnp, formatMiaSigned)}
      />
      <Kpi
        label="Provenu-effekt"
        value={antalValgt ? formatMiaSigned(sumProvenu) : '—'}
        sekundært={`baseret på ${antalMedProvenu} af ${antalValgt} reformer`}
        tone={tone(sumProvenu)}
        sammenligning={lavSammenligning('provenu', formatMiaSigned)}
        justeret={lavJusteret(sumProvenu, justeretProvenu, formatMiaSigned)}
      />
    </div>
  )
}
