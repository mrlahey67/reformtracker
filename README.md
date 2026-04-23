# Reformtracker

Interaktivt webværktøj hvor brugeren kan sammensætte hypotetiske reformpakker og se den estimerede effekt på arbejdsudbuddet, BNP og offentlige finanser frem mod 2030.

Primær målgruppe: politiske medarbejdere, journalister, tænketanke og erhvervsorganisationer i dansk FV2026-kontekst.

## Kom i gang

```bash
npm install
npm run dev      # lokal udvikling på http://localhost:5173
npm run build    # produktionsbuild til dist/
npm run preview  # preview af produktionsbuild
```

## Teknisk stak

- **React 18** + **Vite 6** (ingen backend — alt er client-side)
- **TailwindCSS 3** til styling
- **Recharts** til visualisering
- Deploy via `gh-pages` (`npm run deploy` til GitHub Pages)

## Filstruktur

```
reformtracker/
├── src/
│   ├── App.jsx                    # hovedlayout, state og pakke-logik
│   ├── components/
│   │   ├── ReformCatalog.jsx      # venstre side: filtrerbart katalog
│   │   ├── ReformCard.jsx         # individuel reform-widget
│   │   ├── SelectedReforms.jsx    # højre side: "din pakke"
│   │   ├── EffectSummary.jsx      # KPI-kort (arbejdsudbud, BNP, provenu)
│   │   ├── EffectChart.jsx        # Recharts søjlediagram
│   │   ├── ReformModal.jsx        # detaljevisning med kilde og politik
│   │   └── MetodeModal.jsx        # "Om værktøjet" med metodiske forbehold
│   ├── data/
│   │   └── reforms.json           # reform-katalog (se nedenfor)
│   ├── utils/
│   │   └── calculations.js        # sumEffect, formateringshjælpere
│   └── index.css
└── index.html
```

## Datakilder

Alle effekttal i `reforms.json` er kildeforankrede. Hver reform indeholder felterne `kilde` og `kilde_url` med direkte link til den primære publikation. Hvor estimater varierer betydeligt mellem institutioner, er spændet noteret i feltet `usikkerhed`.

Primære kildeinstitutioner:

- **Finansministeriet** (fm.dk) — bl.a. besvarelser til Folketingets udvalg, pressemeddelelser om reformaftaler
- **Skatteministeriet** (skm.dk) — faktaark om beskæftigelsesfradrag, F&U-fradrag
- **Uddannelses- og Forskningsministeriet** (ufm.dk) — kandidatreformen
- **Beskæftigelsesministeriet** (bm.dk) — arbejdspligt-aftalen, modregning i folkepension
- **Erhvervsministeriet** (oem.dk) — international rekruttering
- **Dansk Erhverv** (danskerhverv.dk) — "Dansk Handlekraft"
- **Dansk Industri** (di.dk) — beskæftigelsesfradrags-analyser
- **CEPOS** (cepos.dk) — skatteanalyser, topskat
- **Arbejderbevægelsens Erhvervsråd** (ae.dk) — SU-analyser, kritiske vurderinger af skatteudspil
- **Kraka Advisory** — skatte- og reformanalyser

## Reform-kataloget

12 reformer i MVP'en, fordelt på fem kategorier:

| Kategori | Antal |
|---|---|
| International rekruttering | 3 |
| Tilbagetrækning | 2 |
| Uddannelse og unge | 2 |
| Skat og incitamenter | 3 |
| Kontanthjælp og aktivering | 2 |

Reformer hvor der ikke findes et troværdigt offentligt estimat er medtaget med feltet `arbejdsudbud_fuldtidspersoner: null` og kan ikke tilføjes til en pakke. Dette gælder p.t. positivliste-udvidelsen og SIRI-forenkling — begge indgår i bredere arbejdsudbudsaftaler og har ikke været isoleret beregnet.

## Metodiske forbehold

Værktøjet viser **partielle ligevægts-estimater** af hver reforms effekt på arbejdsudbuddet. Læseren bør være opmærksom på:

1. **Effekter er ikke additive.** Summen af individuelle estimater overvurderer typisk den faktiske samlede effekt — særligt hvor flere reformer overlapper inden for samme målgruppe (fx flere skatteinstrumenter der påvirker samme marginalskatter, eller flere rekrutterings-initiativer der trækker på samme virksomhedsbehov).
2. **Usikkerheden er betydelig.** Adfærdselasticiteter, timing og implementering er kilder til bred usikkerhed. Hvor relevant rapporteres spændet i feltet `usikkerhed`.
3. **Kilder kan være uenige.** Fx estimerer CEPOS ca. 8.300 fuldtidspersoner ved afskaffelse af topskatten, Kraka ca. 9.000. Beskæftigelsesministeriet og CEPOS er uenige om effekten af kontanthjælpsloftet/225-timersreglen.
4. **Politisk gennemførlighed er ikke vurderet.** Feltet `politisk_support` og `politisk_modstand` angiver alene observerede positioner og ikke et samlet gennemførlighedsmål.
5. **Værktøjet er en eksplorativ ramme, ikke et prognoseredskab.** Det er designet til at strukturere samtalen om reformpakkers omtrentlige størrelsesorden — ikke til at erstatte Finansministeriets regnearks-kørsler.

Advarslen vises også i UI'en under "Om værktøjet" og under pakke-visualiseringen.

## Fremtidige iterationer

Ikke med i MVP'en, planlagt til senere:

- [ ] Forprogrammerede sammenligningspakker (fx "Regeringens 2030-plan", "Dansk Erhvervs udspil", "Radikale 2030")
- [ ] Deling af pakker via URL-parametre
- [ ] Eksport af pakken som billede (html2canvas)
- [ ] Mobil-optimeret layout
- [ ] Flere reformer (miljø-arbejdsmarked, sundhedspersonale-optag, boligmarked)
- [ ] Overlapjustering — simple heuristikker for at reducere dobbelttælling mellem kategorier

## Licens og brug

Data og kode er åbent for genbrug i forsknings-, journalistisk og policy-sammenhæng. Ved genbrug bedes du citere de originale kilder angivet per reform — ikke Reformtracker.
