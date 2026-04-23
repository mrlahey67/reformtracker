import { useMemo, useState } from 'react'
import ReformCard from './ReformCard.jsx'

export default function ReformCatalog({ reformer, valgteIds, onToggle, onOpen }) {
  const [filterKategori, setFilterKategori] = useState('Alle')
  const [filterStøtte, setFilterStøtte] = useState('Alle')
  const [søg, setSøg] = useState('')

  const kategorier = useMemo(
    () => ['Alle', ...Array.from(new Set(reformer.map((r) => r.kategori)))],
    [reformer],
  )
  const støtteAktører = useMemo(() => {
    const sæt = new Set()
    reformer.forEach((r) => (r.politisk_support ?? []).forEach((s) => sæt.add(s)))
    return ['Alle', ...Array.from(sæt).sort((a, b) => a.localeCompare(b, 'da'))]
  }, [reformer])

  const filtreret = useMemo(() => {
    return reformer.filter((r) => {
      if (filterKategori !== 'Alle' && r.kategori !== filterKategori) return false
      if (filterStøtte !== 'Alle' && !(r.politisk_support ?? []).includes(filterStøtte)) return false
      if (søg) {
        const q = søg.toLowerCase()
        const tekst = `${r.titel} ${r.beskrivelse}`.toLowerCase()
        if (!tekst.includes(q)) return false
      }
      return true
    })
  }, [reformer, filterKategori, filterStøtte, søg])

  return (
    <section aria-label="Reform-katalog" className="flex flex-col h-full">
      <header className="mb-3">
        <h2 className="text-lg font-semibold text-ink">Katalog</h2>
        <p className="text-[13px] text-ink-muted">
          {filtreret.length} af {reformer.length} reformer vist
        </p>
      </header>

      <div className="mb-3 grid grid-cols-1 gap-2">
        <input
          type="search"
          placeholder="Søg i reformer…"
          value={søg}
          onChange={(e) => setSøg(e.target.value)}
          className="w-full rounded border border-rule bg-white px-3 py-2 text-[13px] placeholder:text-ink-soft focus:border-accent focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="w-full rounded border border-rule bg-white px-2 py-1.5 text-[12px] focus:border-accent focus:outline-none"
          >
            {kategorier.map((k) => (
              <option key={k} value={k}>
                {k === 'Alle' ? 'Alle kategorier' : k}
              </option>
            ))}
          </select>
          <select
            value={filterStøtte}
            onChange={(e) => setFilterStøtte(e.target.value)}
            className="w-full rounded border border-rule bg-white px-2 py-1.5 text-[12px] focus:border-accent focus:outline-none"
          >
            {støtteAktører.map((s) => (
              <option key={s} value={s}>
                {s === 'Alle' ? 'Alle støtter' : `Støttet af: ${s}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {filtreret.length === 0 ? (
          <p className="text-sm text-ink-soft py-8 text-center">
            Ingen reformer matcher filtret.
          </p>
        ) : (
          filtreret.map((r) => (
            <ReformCard
              key={r.id}
              reform={r}
              valgt={valgteIds.includes(r.id)}
              onToggle={onToggle}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </section>
  )
}
