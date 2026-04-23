import { useMemo, useState } from 'react'
import reformer from './data/reforms.json'
import ReformCatalog from './components/ReformCatalog.jsx'
import SelectedReforms from './components/SelectedReforms.jsx'
import EffectSummary from './components/EffectSummary.jsx'
import EffectChart from './components/EffectChart.jsx'
import ReformModal from './components/ReformModal.jsx'
import MetodeModal from './components/MetodeModal.jsx'
import { sumEffect } from './utils/calculations.js'

export default function App() {
  const [valgteIds, setValgteIds] = useState([])
  const [åbenReform, setÅbenReform] = useState(null)
  const [åbenMetode, setÅbenMetode] = useState(false)

  function toggleReform(id) {
    setValgteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function rydAlle() {
    setValgteIds([])
  }

  const valgteReformer = useMemo(
    () =>
      valgteIds
        .map((id) => reformer.find((r) => r.id === id))
        .filter(Boolean)
        .filter((r) => typeof r.arbejdsudbud_fuldtidspersoner === 'number'),
    [valgteIds],
  )

  const sumArbejdsudbud = sumEffect(valgteReformer, 'arbejdsudbud_fuldtidspersoner')
  const sumBnp = sumEffect(valgteReformer, 'bnp_mia_kr')
  const sumProvenu = sumEffect(valgteReformer, 'provenu_mia_kr')
  const antalMedBnp = valgteReformer.filter((r) => typeof r.bnp_mia_kr === 'number').length
  const antalMedProvenu = valgteReformer.filter((r) => typeof r.provenu_mia_kr === 'number').length

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-rule bg-white/70 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-1 bg-flag-red" aria-hidden="true" />
              <h1 className="text-xl md:text-2xl font-semibold text-ink">
                Reformtracker
              </h1>
              <span className="hidden md:inline text-[11px] uppercase tracking-wider text-ink-soft ml-1">
                FV2026 · arbejdsudbud mod 2030
              </span>
            </div>
            <p className="mt-1 text-[13px] text-ink-muted max-w-2xl">
              Byg din egen reformpakke og se den estimerede effekt på
              arbejdsudbud, BNP og offentlige finanser. Alle effekttal er
              hentet fra offentligt tilgængelige publikationer — klik på en
              reform for at se kilden.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <button
              type="button"
              onClick={() => setÅbenMetode(true)}
              className="text-ink-muted hover:text-ink underline underline-offset-2"
            >
              Om værktøjet
            </button>
            <a
              href="https://mrlahey67.github.io"
              className="text-ink-muted hover:text-ink underline underline-offset-2"
            >
              ← Portefølje
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
          <div className="lg:col-span-5 flex flex-col min-h-0">
            <ReformCatalog
              reformer={reformer}
              valgteIds={valgteIds}
              onToggle={toggleReform}
              onOpen={setÅbenReform}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col min-h-0 space-y-4 overflow-y-auto pr-1">
            <div>
              <h2 className="text-lg font-semibold text-ink mb-3">
                Din reformpakke
              </h2>
              <EffectSummary
                sumArbejdsudbud={sumArbejdsudbud}
                sumBnp={sumBnp}
                sumProvenu={sumProvenu}
                antalMedBnp={antalMedBnp}
                antalMedProvenu={antalMedProvenu}
                antalValgt={valgteReformer.length}
              />
            </div>

            <SelectedReforms
              valgteReformer={valgteReformer}
              onToggle={toggleReform}
              onRydAlle={rydAlle}
            />

            <EffectChart valgteReformer={valgteReformer} />

            {valgteReformer.length > 0 && (
              <div className="rounded-md border-l-2 border-amber-400 bg-amber-50 px-4 py-3 text-[12.5px] text-amber-950 leading-relaxed">
                <strong>OBS:</strong> Tallene er simple summationer af partielle
                ligevægts-estimater. Effekterne af flere reformer er
                <em> typisk ikke additive</em> — der er overlap mellem
                arbejdsudbuds- og incitamentseffekter, særligt inden for samme
                kategori. Betragt summen som en øvre grænse, ikke et punktestimat.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-rule bg-white/50 mt-4">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-[11px] text-ink-soft">
          <span>
            Reformtracker v0.1 · {reformer.length} reformer i kataloget
          </span>
          <span>
            Data opdateret april 2026 · kildehenvisninger per reform
          </span>
        </div>
      </footer>

      {åbenReform && (
        <ReformModal
          reform={åbenReform}
          valgt={valgteIds.includes(åbenReform.id)}
          onClose={() => setÅbenReform(null)}
          onToggle={toggleReform}
        />
      )}
      <MetodeModal åben={åbenMetode} onClose={() => setÅbenMetode(false)} />
    </div>
  )
}
