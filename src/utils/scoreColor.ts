export function getScoreColor(score: number): string {
    if (score >= 10) return 'var(--color-cyan-400)'
    if (score >= 9) return 'var(--color-teal-400)'
    if (score >= 7) return 'var(--color-green-500)'
    if (score >= 5) return 'var(--color-lime-500)'
    if (score >= 3) return 'var(--color-yellow-400)'
    return 'var(--color-orange-500)'
  }