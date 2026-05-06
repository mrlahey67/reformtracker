import pakker from '../data/pakker.json'

export default function Pakker({ valgteIds, onIndlæsPakke }) {
  return (
    <div className="rounded-md border border-rule bg-white shadow-card">
      <header className="border-b border-rule px-4 py-2.5">
        <h3 className="text-sm font-semibold text-ink">Hent forprogrammeret pakke</h3>
        <p className="text-[12px] text-ink-soft mt-0.5">
          Etablerede positioner som udgangspunkt for sammenligning. Du kan
          frit redigere efter indlæsning.
        </p>
      </header>
      <ul className="divide-y divide-rule">
        {pakker.map((p) => {
          const aktiv =
            p.reform_ids.length === valgteIds.length &&
            p.reform_ids.every((id) => valgteIds.includes(id))
          return (
            <li key={p.id} className="px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.farve }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ink">{p.navn}</div>
                  <div className="text-[11px] text-ink-soft">
                    {p.reform_ids.length} reformer
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onIndlæsPakke(p)}
                  className={`shrink-0 rounded px-2.5 py-1 text-[12px] font-medium transition-colors ${
                    aktiv
                      ? 'bg-ink text-white'
                      : 'border border-ink text-ink hover:bg-ink hover:text-white'
                  }`}
                  title={p.kort_beskrivelse}
                >
                  {aktiv ? 'Indlæst' : 'Indlæs'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
