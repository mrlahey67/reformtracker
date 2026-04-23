import { formatPersons, formatMia, kategoriFarve } from '../utils/calculations.js'

export default function SelectedReforms({ valgteReformer, onToggle, onRydAlle }) {
  if (valgteReformer.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border border-rule bg-white shadow-card">
      <header className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <h3 className="text-sm font-semibold text-ink">
          Din pakke
          <span className="ml-2 text-ink-soft font-normal">
            ({valgteReformer.length} {valgteReformer.length === 1 ? 'reform' : 'reformer'})
          </span>
        </h3>
        <button
          type="button"
          onClick={onRydAlle}
          className="text-[12px] text-ink-soft hover:text-ink underline underline-offset-2"
        >
          Ryd alle
        </button>
      </header>
      <ul className="divide-y divide-rule">
        {valgteReformer.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
          >
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: kategoriFarve(r.kategori) }}
              aria-hidden="true"
            />
            <span className="flex-1 truncate text-ink" title={r.titel}>
              {r.titel}
            </span>
            <span className="num text-ink-muted shrink-0">
              +{formatPersons(r.arbejdsudbud_fuldtidspersoner)}
            </span>
            {typeof r.provenu_mia_kr === 'number' && (
              <span
                className={`num shrink-0 text-[12px] ${
                  r.provenu_mia_kr >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {r.provenu_mia_kr > 0 ? '+' : ''}{formatMia(r.provenu_mia_kr)}
              </span>
            )}
            <button
              type="button"
              onClick={() => onToggle(r.id)}
              className="ml-1 rounded px-1.5 py-0.5 text-ink-soft hover:bg-rule hover:text-ink"
              aria-label={`Fjern ${r.titel}`}
              title="Fjern fra pakken"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
