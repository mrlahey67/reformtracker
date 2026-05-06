import pakker from '../data/pakker.json'

export default function SammenligningsVælger({ valgtId, onVælg }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <label htmlFor="cmp-select" className="text-ink-soft shrink-0">
        Sammenlign med:
      </label>
      <select
        id="cmp-select"
        value={valgtId ?? ''}
        onChange={(e) => onVælg(e.target.value || null)}
        className="rounded border border-rule bg-white px-2 py-1 text-[12px] focus:border-accent focus:outline-none"
      >
        <option value="">Ingen</option>
        {pakker.map((p) => (
          <option key={p.id} value={p.id}>
            {p.navn}
          </option>
        ))}
      </select>
    </div>
  )
}
