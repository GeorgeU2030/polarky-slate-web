import { Icon } from '@iconify/react'
import { ScoreSlider } from './ScoreSlider'
import { getScoreColor } from '@/utils/scoreColor'

interface ScoreCategoryRowProps {
  icon: string
  label: string
  description: string
  weight: number
  value: number
  onChange: (value: number) => void
}

export function ScoreCategoryRow({
  icon,
  label,
  description,
  weight,
  value,
  onChange,
}: ScoreCategoryRowProps) {
  const color = getScoreColor(value)

  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)` }}
      >
        <Icon icon={icon} className="text-xl transition-colors duration-300" style={{ color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-paper">{label}</p>
            <p className="text-xs text-paper/45">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[0.65rem] uppercase tracking-wide text-paper/30">{weight}%</span>
            <span
              className="w-8 text-right text-lg font-bold tabular-nums transition-colors duration-300"
              style={{ color }}
            >
              {value}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <ScoreSlider value={value} color={color} onChange={onChange} ariaLabel={label} />
        </div>
      </div>
    </div>
  )
}