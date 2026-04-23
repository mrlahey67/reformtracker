export default function MetodeModal({ åben, onClose }) {
  if (!åben) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-2xl w-full rounded-md bg-white shadow-xl max-h-[85vh] overflow-y-auto"
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
        <div className="p-6 prose-da">
          <h2 className="text-xl font-semibold text-ink mb-3">Om værktøjet</h2>
          <p>
            <strong>Reformtracker</strong> er et interaktivt værktøj der lader dig
            sammensætte hypotetiske reformpakker og se den estimerede effekt på
            arbejdsudbuddet frem mod 2030. Tallene er hentet fra offentligt
            tilgængelige publikationer fra Finansministeriet, Dansk Erhverv, DI,
            CEPOS, AE-Rådet, Kraka, Det Økonomiske Råd m.fl.
          </p>

          <h3 className="text-base font-semibold text-ink mt-4 mb-2">
            Metodiske forbehold
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-muted text-[13px]">
            <li>
              <strong>Partielle ligevægtsestimater.</strong> De enkelte reformer er
              vurderet hver for sig. Generel ligevægt, afledte arbejdsmarkeds- og
              adfærdseffekter er typisk ikke modelleret.
            </li>
            <li>
              <strong>Ikke-additive kombinationer.</strong> Når flere reformer
              kombineres, vil effekterne ofte overlappe. Den simple sum
              overvurderer som regel den faktiske samlede effekt.
            </li>
            <li>
              <strong>Betydelig usikkerhed.</strong> Effekter af reformer er
              behæftet med usikkerhed, særligt hvad angår timing, implementering
              og adfærdsrespons.
            </li>
            <li>
              <strong>Politisk gennemførlighed er ikke vurderet.</strong> Værktøjet
              viser politisk støtte og modstand alene som kontekst og ikke som et
              samlet gennemførlighedsmål.
            </li>
            <li>
              <strong>Kilder varierer.</strong> Samme reform kan have forskellige
              estimater fra forskellige institutioner. Hver reform angiver den
              primære kilde samt en usikkerhedsnote hvor relevant.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-ink mt-4 mb-2">Kildekode</h3>
          <p className="text-[13px]">
            Data og kode er åben. Se datafilen {' '}
            <code className="text-[12px] bg-paper px-1 py-0.5 rounded">reforms.json</code>{' '}
            for direkte kildelinks til hver reform.
          </p>
        </div>
      </div>
    </div>
  )
}
