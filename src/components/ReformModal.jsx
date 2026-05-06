import { useEffect } from 'react'
import { formatPersonsSigned, formatMiaSigned, kategoriFarve } from '../utils/calculations.js'

const KILDE_TYPE_STIL = {
  ministeriel: { label: 'Ministeriel', class: 'bg-violet-50 text-violet-800 border-violet-200' },
  uafhængig: { label: 'Uafhængig', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  interesseret: { label: 'Interesseret', class: 'bg-amber-50 text-amber-800 border-amber-200' },
}

function KildeTypeBadge({ type }) {
  if (!type || !KILDE_TYPE_STIL[type]) return null
  const stil = KILDE_TYPE_STIL[type]
  return (
    <span
      className={`text-[10px] uppercase tracking-wider rounded border px-1.5 py-0.5 ${stil.class}`}
      title={
        type === 'ministeriel'
          ? 'Estimat fra ministerie/regering'
          : type === 'uafhængig'
          ? 'Estimat fra uafhængig forskning eller tværinstitutionel analyse'
          : 'Estimat fra organisation med politisk eller økonomisk interesse i udfaldet'
      }
    >
      {stil.label}
    </span>
  )
}

export default function ReformModal({ reform, valgt, onClose, onToggle }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!reform) return null

  const effektUkendt = reform.arbejdsudbud_fuldtidspersoner === null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titel"
    >
      <div
        className="relative max-w-xl w-full rounded-md bg-white shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-ink-soft hover:text-ink"
          aria-label="Luk"
        >
          ✕
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: kategoriFarve(reform.kategori) }}
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-wider text-ink-soft">
              {reform.kategori}
            </span>
          </div>
          <h2 id="modal-titel" className="text-xl font-semibold text-ink">
            {reform.titel}
          </h2>
          <p className="mt-3 text-[14px] text-ink-muted leading-relaxed">
            {reform.beskrivelse}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded border border-rule px-3 py-2">
              <div className="text-[11px] uppercase text-ink-soft">Arbejdsudbud</div>
              <div
                className={`text-lg font-semibold num ${
                  !effektUkendt && reform.arbejdsudbud_fuldtidspersoner < 0
                    ? 'text-rose-700'
                    : ''
                }`}
              >
                {effektUkendt ? '—' : formatPersonsSigned(reform.arbejdsudbud_fuldtidspersoner)}
              </div>
              {(typeof reform.arbejdsudbud_lav === 'number' ||
                typeof reform.arbejdsudbud_høj === 'number') && (
                <div className="text-[11px] text-ink-soft num mt-0.5">
                  {formatPersonsSigned(reform.arbejdsudbud_lav)} – {formatPersonsSigned(reform.arbejdsudbud_høj)}
                </div>
              )}
            </div>
            <div className="rounded border border-rule px-3 py-2">
              <div className="text-[11px] uppercase text-ink-soft">BNP</div>
              <div
                className={`text-lg font-semibold num ${
                  typeof reform.bnp_mia_kr === 'number' && reform.bnp_mia_kr < 0
                    ? 'text-rose-700'
                    : ''
                }`}
              >
                {typeof reform.bnp_mia_kr === 'number' ? formatMiaSigned(reform.bnp_mia_kr) : '—'}
              </div>
            </div>
            <div className="rounded border border-rule px-3 py-2">
              <div className="text-[11px] uppercase text-ink-soft">Provenu</div>
              <div
                className={`text-lg font-semibold num ${
                  typeof reform.provenu_mia_kr === 'number' && reform.provenu_mia_kr < 0
                    ? 'text-rose-700'
                    : ''
                }`}
              >
                {typeof reform.provenu_mia_kr === 'number'
                  ? formatMiaSigned(reform.provenu_mia_kr)
                  : '—'}
              </div>
            </div>
          </div>

          {reform.usikkerhed && (
            <div className="mt-4 rounded border-l-2 border-amber-400 bg-amber-50 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-amber-900 mb-0.5">
                Usikkerhed
              </div>
              <div className="text-[13px] text-amber-950">{reform.usikkerhed}</div>
            </div>
          )}

          <div className="mt-5 space-y-3 text-[13px]">
            {reform.politisk_support?.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-soft mb-1">
                  Politisk støtte
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reform.politisk_support.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[12px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {reform.politisk_modstand?.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-soft mb-1">
                  Politisk modstand
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reform.politisk_modstand.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-rose-50 text-rose-800 px-2 py-0.5 text-[12px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-rule pt-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-2">
              Kilde{reform.kilder?.length > 1 ? 'r' : ''}
              {reform.kilde_type && (
                <KildeTypeBadge type={reform.kilde_type} />
              )}
            </div>
            {reform.kilder?.length > 0 ? (
              <ul className="space-y-2.5 text-[12.5px]">
                {reform.kilder.map((k, i) => (
                  <li key={i} className="border-l-2 border-rule pl-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-ink">{k.org}</span>
                      <KildeTypeBadge type={k.kilde_type} />
                    </div>
                    {k.url ? (
                      <a
                        href={k.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-[12px]"
                      >
                        {k.navn} ↗
                      </a>
                    ) : (
                      <div className="text-ink-muted text-[12px]">{k.navn}</div>
                    )}
                    <div className="mt-1 flex flex-wrap gap-3 text-[11.5px] num text-ink-muted">
                      {typeof k.estimat_arbejdsudbud === 'number' && (
                        <span>
                          Arbejdsudbud:{' '}
                          <span
                            className={
                              k.estimat_arbejdsudbud < 0 ? 'text-rose-700' : 'text-ink'
                            }
                          >
                            {formatPersonsSigned(k.estimat_arbejdsudbud)}
                          </span>
                        </span>
                      )}
                      {typeof k.estimat_bnp === 'number' && (
                        <span>
                          BNP:{' '}
                          <span className={k.estimat_bnp < 0 ? 'text-rose-700' : 'text-ink'}>
                            {formatMiaSigned(k.estimat_bnp)}
                          </span>
                        </span>
                      )}
                      {typeof k.estimat_provenu === 'number' && (
                        <span>
                          Provenu:{' '}
                          <span
                            className={k.estimat_provenu < 0 ? 'text-rose-700' : 'text-ink'}
                          >
                            {formatMiaSigned(k.estimat_provenu)}
                          </span>
                        </span>
                      )}
                    </div>
                    {k.noter && (
                      <div className="text-[11.5px] text-ink-soft italic mt-0.5">
                        {k.noter}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[13px]">
                {reform.kilde_url ? (
                  <a
                    href={reform.kilde_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {reform.kilde} ↗
                  </a>
                ) : (
                  <span className="text-ink-muted">{reform.kilde}</span>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-rule px-3 py-1.5 text-[13px] text-ink-muted hover:bg-rule"
            >
              Luk
            </button>
            <button
              type="button"
              onClick={() => {
                onToggle(reform.id)
                onClose()
              }}
              disabled={effektUkendt}
              className={`rounded px-3 py-1.5 text-[13px] font-medium ${
                effektUkendt
                  ? 'bg-rule text-ink-soft cursor-not-allowed'
                  : valgt
                  ? 'bg-ink text-white hover:bg-ink-muted'
                  : 'bg-accent text-white hover:bg-accent-soft'
              }`}
            >
              {effektUkendt ? 'Effekt ikke beregnet' : valgt ? 'Fjern fra pakken' : 'Tilføj til pakken'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
