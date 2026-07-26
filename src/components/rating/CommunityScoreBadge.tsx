import { getScoreColor } from '@/utils/scoreColor'

interface CommunityScoreBadgeProps {
  averageScore: number
  ratingsCount: number
}

export function CommunityScoreBadge({ averageScore, ratingsCount }: CommunityScoreBadgeProps) {
  const color = getScoreColor(averageScore)
  const size = 52
  const radius = 22
  const stroke = 4
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const filled = (averageScore / 10) * circumference

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-ink/60 px-4 py-3">
      <div className="relative shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-13 w-13">
          <g transform={`rotate(-90 ${center} ${center})`}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-paper)" strokeOpacity={0.08} strokeWidth={stroke} />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference - filled}`}
            />
          </g>
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums"
          style={{ color }}
        >
          {averageScore.toFixed(1)}
        </span>
      </div>

      <div className="text-xs leading-tight">
        <p className="font-semibold text-paper/80">Community avg</p>
        <p className="text-paper/40">
          {ratingsCount} rating{ratingsCount === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  )
}