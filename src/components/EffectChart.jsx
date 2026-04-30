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
} from 'recharts'
import { kategoriFarve, formatPersonsSigned } from '../utils/calculations.js'

function TooltipIndhold({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const negativ = d.arbejdsudbud_fuldtidspersoner < 0
  return (
    <div className="rounded border border-rule bg-white px-3 py-2 shadow-card text-[12px]">
      <div className="font-semibold text-ink mb-0.5">{d.titel}</div>
      <div className="text-ink-soft">{d.kategori}</div>
      <div className={`mt-1 num ${negativ ? 'text-rose-700' : ''}`}>
        {formatPersonsSigned(d.arbejdsudbud_fuldtidspersoner)} fuldtidspersoner
      </div>
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

  const data = [...valgteReformer].sort(
    (a, b) => b.arbejdsudbud_fuldtidspersoner - a.arbejdsudbud_fuldtidspersoner,
  )
  const harNegative = data.some((d) => d.arbejdsudbud_fuldtidspersoner < 0)

  return (
    <div className="rounded-md border border-rule bg-white p-4 shadow-card">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">
          Bidrag per reform
        </h3>
        <span className="text-[11px] text-ink-soft">
          Fuldtidspersoner, fuldt indfaset
        </span>
      </div>
      <div style={{ width: '100%', height: Math.max(220, data.length * 38) }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
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
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
