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
            arbejdsudbuddet, BNP og offentlige finanser frem mod 2030. Tallene er
            hentet fra offentligt tilgængelige publikationer fra Finansministeriet,
            Skatteministeriet, Beskæftigelsesministeriet, AE-Rådet, CEPOS, Kraka,
            Dansk Industri, Dansk Erhverv m.fl.
          </p>

          <h3 className="text-base font-semibold text-ink mt-5 mb-2">
            Konservativt skøn (overlap-justering)
          </h3>
          <p>
            Når flere reformer kombineres, overvurderer den simple sum typisk
            den samlede effekt — særligt hvor reformer rammer overlappende
            målgrupper eller marginalskatter. Værktøjet kan vise et{' '}
            <em>konservativt skøn</em> ved at anvende en kategori-baseret
            discount:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-ink-muted text-[13px] mt-2">
            <li>1 reform i en kategori: ×1,0 (ingen justering)</li>
            <li>2 reformer i samme kategori: ×0,85</li>
            <li>3 reformer i samme kategori: ×0,70</li>
            <li>4+ reformer i samme kategori: ×0,60</li>
            <li>På tværs af kategorier: antages uafhængighed</li>
          </ul>
          <p className="mt-2">
            <strong>Forbehold [konjektur]:</strong> Faktorerne er ikke baseret
            på en publiceret dansk overlap-analyse, men er en grov heuristik
            til at signalere ikke-additivitet. Den er bedre end den naive
            sum, men ikke et videnskabeligt fundament. Brug den som en
            øvelse i at vise, at <em>en eller anden</em> reduktion bør
            forventes — ikke som et præcisionsmål.
          </p>

          <h3 className="text-base font-semibold text-ink mt-5 mb-2">
            Kilde-typer
          </h3>
          <p>
            Hver kilde i værktøjet er klassificeret efter institutionel
            position. Det er <em>ikke</em> en bedømmelse af analysekvalitet,
            men en signalering af interesse:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-ink-muted text-[13px] mt-2">
            <li>
              <span className="rounded border border-violet-200 bg-violet-50 text-violet-800 px-1.5 py-0.5 text-[10px] uppercase mr-1">
                Ministeriel
              </span>{' '}
              Finansministeriet, Skatteministeriet, Beskæftigelsesministeriet,
              regeringens publikationer
            </li>
            <li>
              <span className="rounded border border-emerald-200 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 text-[10px] uppercase mr-1">
                Uafhængig
              </span>{' '}
              Forskningsuniversiteter, peer-reviewed publikationer, AE-Rådets
              egne analyser med uafhængig metode
            </li>
            <li>
              <span className="rounded border border-amber-200 bg-amber-50 text-amber-800 px-1.5 py-0.5 text-[10px] uppercase mr-1">
                Interesseret
              </span>{' '}
              Tænketanke med politisk linje (CEPOS, AE som lobby), arbejdsgiver-
              og arbejdstagerorganisationer (DI, Dansk Erhverv, FH)
            </li>
          </ul>
          <p className="mt-2 text-[13px] text-ink-soft">
            Hvor en reform har <em>flere</em> estimater fra forskellige
            institutioner, vises de alle i detaljevisningen — så du selv kan
            vurdere afstanden mellem dem.
          </p>

          <h3 className="text-base font-semibold text-ink mt-5 mb-2">
            Andre metodiske forbehold
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-muted text-[13px]">
            <li>
              <strong>Partielle ligevægtsestimater.</strong> Hver reform er
              vurderet hver for sig. Generel ligevægt og afledte
              arbejdsmarkedseffekter er typisk ikke modelleret.
            </li>
            <li>
              <strong>Spredning angives hvor muligt.</strong> Fejlbjælker i
              diagrammet og lav-høj-spændet i detaljevisningen kommer fra
              alternative offentlige estimater. Hvor kun ét estimat findes,
              vises ingen spredning.
            </li>
            <li>
              <strong>Fuldt indfaset.</strong> Effekttal angiver typisk
              effekten ved fuld indfasning (oftest 2030 eller 2035).
              Effekten i implementeringsåret er som regel mindre.
            </li>
            <li>
              <strong>Politisk gennemførlighed er ikke vurderet.</strong>{' '}
              Politisk støtte og modstand vises som kontekst, ikke som et
              gennemførlighedsmål.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-ink mt-5 mb-2">Kildekode og data</h3>
          <p className="text-[13px]">
            Data og kode er åbent på{' '}
            <a
              href="https://github.com/mrlahey67/reformtracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              github.com/mrlahey67/reformtracker
            </a>
            . Datafilen{' '}
            <code className="text-[12px] bg-paper px-1 py-0.5 rounded">reforms.json</code>{' '}
            indeholder direkte kildelinks per reform.
          </p>
        </div>
      </div>
    </div>
  )
}
