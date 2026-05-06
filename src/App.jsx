import { useEffect, useMemo, useState } from 'react'
import reformer from './data/reforms.json'
import pakker from './data/pakker.json'
import ReformCatalog from './components/ReformCatalog.jsx'
import SelectedReforms from './components/SelectedReforms.jsx'
import EffectSummary from './components/EffectSummary.jsx'
import EffectChart from './components/EffectChart.jsx'
import ReformModal from './components/ReformModal.jsx'
import MetodeModal from './components/MetodeModal.jsx'
import Pakker from './components/Pakker.jsx'
import SammenligningsVælger from './components/SammenligningsVælger.jsx'
import { sumEffect, justeretSum } from './utils/calculations.js'

const REFORM_IDS = new Set(reformer.map((r) => r.id))
const PAKKE_IDS = new Set(pakker.map((p) => p.id))

function læsFraUrl() {
  if (typeof window === 'undefined') return { ids: [], cmp: null }
  const params = new URLSearchParams(window.location.search)
  const r = params.get('r')
  const cmp = params.get('cmp')
  return {
    ids: r ? r.split(',').filter((id) => REFORM_IDS.has(id)) : [],
    cmp: cmp && PAKKE_IDS.has(cmp) ? cmp : null,
  }
}

function skrivTilUrl(ids, cmp) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (ids.length > 0) params.set('r', ids.join(','))
  else params.delete('r')
  if (cmp) params.set('cmp', cmp)
  else params.delete('cmp')
  const qs = params.toString()
  const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}${window.location.hash}`
  window.history.replaceState({}, '', newUrl)
}

export default function App() {
  const initial = useMemo(() => læsFraUrl(), [])
  const [valgteIds, setValgteIds] = useState(initial.ids)
  const [sammenligningId, setSammenligningId] = useState(initial.cmp)
  const [visKonservativt, setVisKonservativt] = useState(false)
  const [åbenReform, setÅbenReform] = useState(null)
  const [åbenMetode, setÅbenMetode] = useState(false)
  const [delingsBesked, setDelingsBesked] = useState(null)

  // Sync state -> URL (replaceState, ingen history-spam)
  useEffect(() => {
    skrivTilUrl(valgteIds, sammenligningId)
  }, [valgteIds, sammenligningId])

  function toggleReform(id) {
    setValgteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function rydAlle() {
    setValgteIds([])
  }

  function indlæsPakke(pakke) {
    setValgteIds(pakke.reform_ids.filter((id) => REFORM_IDS.has(id)))
  }

  async function delLink() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setDelingsBesked('Link kopieret til udklipsholder')
    } catch {
      setDelingsBesked(url)
    }
    setTimeout(() => setDelingsBesked(null), 2500)
  }

  // Reformer i pakken — alle (incl. dem uden effekttal, til visning)
  const valgteReformerAlle = useMemo(
    () =>
      valgteIds
        .map((id) => reformer.find((r) => r.id === id))
        .filter(Boolean),
    [valgteIds],
  )

  // Reformer brugt til beregninger og diagram (kun med effekttal)
  const valgteReformer = useMemo(
    () =>
      valgteReformerAlle.filter(
        (r) => typeof r.arbejdsudbud_fuldtidspersoner === 'number',
      ),
    [valgteReformerAlle],
  )

  const sumArbejdsudbud = sumEffect(valgteReformer, 'arbejdsudbud_fuldtidspersoner')
  const sumBnp = sumEffect(valgteReformer, 'bnp_mia_kr')
  const sumProvenu = sumEffect(valgteReformer, 'provenu_mia_kr')
  const justeretArbejdsudbud = justeretSum(valgteReformer, 'arbejdsudbud_fuldtidspersoner')
  const justeretBnp = justeretSum(valgteReformer, 'bnp_mia_kr')
  const justeretProvenu = justeretSum(valgteReformer, 'provenu_mia_kr')
  const antalMedBnp = valgteReformer.filter((r) => typeof r.bnp_mia_kr === 'number').length
  const antalMedProvenu = valgteReformer.filter((r) => typeof r.provenu_mia_kr === 'number').length

  // Sammenligningspakke
  const sammenligningsPakke = useMemo(
    () => pakker.find((p) => p.id === sammenligningId) ?? null,
    [sammenligningId],
  )
  const sammenligningsReformer = useMemo(() => {
    if (!sammenligningsPakke) return []
    return sammenligningsPakke.reform_ids
      .map((id) => reformer.find((r) => r.id === id))
      .filter(
        (r) => r && typeof r.arbejdsudbud_fuldtidspersoner === 'number',
      )
  }, [sammenligningsPakke])
  const sammenligningsSums = useMemo(() => {
    if (!sammenligningsPakke) return null
    return {
      navn: sammenligningsPakke.navn,
      arbejdsudbud: sumEffect(sammenligningsReformer, 'arbejdsudbud_fuldtidspersoner'),
      bnp: sumEffect(sammenligningsReformer, 'bnp_mia_kr'),
      provenu: sumEffect(sammenligningsReformer, 'provenu_mia_kr'),
    }
  }, [sammenligningsPakke, sammenligningsReformer])

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
              onClick={delLink}
              disabled={valgteIds.length === 0}
              className="rounded border border-ink px-2.5 py-1 text-ink hover:bg-ink hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink"
              title="Kopiér link til denne pakke"
            >
              Del pakke
            </button>
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
        {delingsBesked && (
          <div className="bg-emerald-50 border-t border-emerald-200 text-[12px] text-emerald-900 px-6 py-1.5 text-center">
            {delingsBesked}
          </div>
        )}
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
              <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
                <h2 className="text-lg font-semibold text-ink">
                  Din reformpakke
                </h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-[12px] text-ink-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={visKonservativt}
                      onChange={(e) => setVisKonservativt(e.target.checked)}
                      className="rounded border-rule"
                    />
                    Konservativt skøn
                    <button
                      type="button"
                      onClick={() => setÅbenMetode(true)}
                      className="text-ink-soft hover:text-ink"
                      title="Læs om overlap-heuristikken"
                      aria-label="Forklaring"
                    >
                      ⓘ
                    </button>
                  </label>
                  <SammenligningsVælger
                    valgtId={sammenligningId}
                    onVælg={setSammenligningId}
                  />
                </div>
              </div>
              <EffectSummary
                sumArbejdsudbud={sumArbejdsudbud}
                sumBnp={sumBnp}
                sumProvenu={sumProvenu}
                justeretArbejdsudbud={justeretArbejdsudbud}
                justeretBnp={justeretBnp}
                justeretProvenu={justeretProvenu}
                visKonservativt={visKonservativt}
                antalMedBnp={antalMedBnp}
                antalMedProvenu={antalMedProvenu}
                antalValgt={valgteReformer.length}
                sammenligning={sammenligningsSums}
              />
            </div>

            <Pakker valgteIds={valgteIds} onIndlæsPakke={indlæsPakke} />

            <SelectedReforms
              valgteReformer={valgteReformerAlle}
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
            Reformtracker v0.2 · {reformer.length} reformer i kataloget
          </span>
          <span>
            Data opdateret maj 2026 · kildehenvisninger per reform
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
