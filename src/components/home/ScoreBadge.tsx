import { getScoreColor } from '@/utils/scoreColor'

export function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return null
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full border bg-ink/80 text-xs font-bold"
      style={{ borderColor: getScoreColor(score), color: getScoreColor(score) }}
    >
      {score.toFixed(1)}
    </span>
  )
}