import { useEffect } from 'react'
import { formatPersonsSigned, formatMiaSigned, kategoriFarve } from '../utils/calculations.js'

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
            <div className="text-[11px] uppercase tracking-wider text-ink-soft mb-1">
              Kilde
            </div>
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
