import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
  ErrorBar,
} from 'recharts'
import { kategoriFarve, formatPersonsSigned } from '../utils/calculations.js'

function TooltipIndhold({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const negativ = d.arbejdsudbud_fuldtidspersoner < 0
  const harSpredning =
    typeof d.arbejdsudbud_lav === 'number' || typeof d.arbejdsudbud_høj === 'number'
  return (
    <div className="rounded border border-rule bg-white px-3 py-2 shadow-card text-[12px]">
      <div className="font-semibold text-ink mb-0.5">{d.titel}</div>
      <div className="text-ink-soft">{d.kategori}</div>
      <div className={`mt-1 num ${negativ ? 'text-rose-700' : ''}`}>
        {formatPersonsSigned(d.arbejdsudbud_fuldtidspersoner)} fuldtidspersoner
      </div>
      {harSpredning && (
        <div className="text-[11px] text-ink-soft mt-0.5 num">
          Spændet: {formatPersonsSigned(d.arbejdsudbud_lav)} — {formatPersonsSigned(d.arbejdsudbud_høj)}
        </div>
      )}
    </div>
  )
}

export default function EffectChart({ valgteReformer }) {
  if (valgteReformer.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-rule bg-white/50 p-8 text-center">
        <p className="text-sm text-ink-soft">
          Vælg reformer fra kataloget for at se den samlede effekt.
        </p>
      </div>
    )
  }

  const data = [...valgteReformer]
    .sort((a, b) => b.arbejdsudbud_fuldtidspersoner - a.arbejdsudbud_fuldtidspersoner)
    .map((r) => {
      const central = r.arbejdsudbud_fuldtidspersoner
      const lav = typeof r.arbejdsudbud_lav === 'number' ? r.arbejdsudbud_lav : central
      const høj = typeof r.arbejdsudbud_høj === 'number' ? r.arbejdsudbud_høj : central
      // Error = asymmetric [downward, upward] som deltaer fra central
      const errLow = Math.max(0, central - lav)
      const errHigh = Math.max(0, høj - central)
      const harSpredning = errLow > 0 || errHigh > 0
      return {
        ...r,
        error: harSpredning ? [errLow, errHigh] : null,
      }
    })

  const harNegative = data.some((d) => d.arbejdsudbud_fuldtidspersoner < 0)
  const harSpredning = data.some((d) => d.error)

  return (
    <div className="rounded-md border border-rule bg-white p-4 shadow-card">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">Bidrag per reform</h3>
        <span className="text-[11px] text-ink-soft">
          Fuldtidspersoner, fuldt indfaset{harSpredning ? ' · fejlbjælker = spændet' : ''}
        </span>
      </div>
      <div style={{ width: '100%', height: Math.max(220, data.length * 38) }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke="#E5E7EB" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickFormatter={(v) => {
                if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`
                return v
              }}
            />
            <YAxis
              type="category"
              dataKey="kort_titel"
              tick={{ fontSize: 11, fill: '#111827' }}
              width={170}
              interval={0}
            />
            <Tooltip content={<TooltipIndhold />} cursor={{ fill: '#F3F4F6' }} />
            {harNegative && (
              <ReferenceLine x={0} stroke="#9CA3AF" strokeWidth={1} />
            )}
            <Bar dataKey="arbejdsudbud_fuldtidspersoner" radius={[0, 3, 3, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.id}
                  fill={
                    d.arbejdsudbud_fuldtidspersoner < 0
                      ? '#BE123C'
                      : kategoriFarve(d.kategori)
                  }
                />
              ))}
              <ErrorBar
                dataKey="error"
                width={4}
                strokeWidth={1.5}
                stroke="rgba(17,24,39,0.55)"
                direction="x"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
