import { formatPersons, formatMia, kategoriFarve } from '../utils/calculations.js'

export default function ReformCard({ reform, valgt, onToggle, onOpen }) {
  const farve = kategoriFarve(reform.kategori)
  const effektUkendt = reform.arbejdsudbud_fuldtidspersoner === null

  return (
    <article
      className={`group rounded-md border bg-white p-4 shadow-card transition-all ${
        valgt ? 'border-accent ring-1 ring-accent/30' : 'border-rule hover:border-ink-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpen(reform)}
          className="flex-1 text-left"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: farve }}
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-wider text-ink-soft">
              {reform.kategori}
            </span>
            {typeof reform.kontroversgrad === 'number' && (
              <span
                className="text-[11px] text-ink-soft"
                title={`Kontroversgrad: ${reform.kontroversgrad}/5`}
              >
                {'●'.repeat(reform.kontroversgrad)}
                <span className="text-rule">
                  {'●'.repeat(Math.max(0, 5 - reform.kontroversgrad))}
                </span>
              </span>
            )}
          </div>
          <h3 className="text-[15px] leading-snug font-semibold text-ink">
            {reform.titel}
          </h3>
          <p className="mt-1.5 text-[13px] text-ink-muted line-clamp-2">
            {reform.beskrivelse}
          </p>
        </button>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <dl className="flex gap-5 text-[12px]">
          <div>
            <dt className="text-ink-soft">Arbejdsudbud</dt>
            <dd className="font-semibold num text-ink">
              {effektUkendt ? '—' : `+${formatPersons(reform.arbejdsudbud_fuldtidspersoner)}`}
            </dd>
          </div>
          {typeof reform.bnp_mia_kr === 'number' && (
            <div>
              <dt className="text-ink-soft">BNP</dt>
              <dd className="font-semibold num text-ink">
                +{formatMia(reform.bnp_mia_kr)}
              </dd>
            </div>
          )}
          {typeof reform.provenu_mia_kr === 'number' && (
            <div>
              <dt className="text-ink-soft">Provenu</dt>
              <dd className="font-semibold num text-ink">
                {reform.provenu_mia_kr > 0 ? '+' : ''}{formatMia(reform.provenu_mia_kr)}
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={() => onToggle(reform.id)}
          disabled={effektUkendt}
          className={`shrink-0 rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
            effektUkendt
              ? 'bg-rule text-ink-soft cursor-not-allowed'
              : valgt
              ? 'bg-ink text-white hover:bg-ink-muted'
              : 'border border-ink text-ink hover:bg-ink hover:text-white'
          }`}
          title={effektUkendt ? 'Effekt ikke beregnet' : valgt ? 'Fjern fra pakken' : 'Tilføj til pakken'}
        >
          {effektUkendt ? 'Effekt ikke beregnet' : valgt ? '− Fjern' : '+ Tilføj'}
        </button>
      </div>
    </article>
  )
}
