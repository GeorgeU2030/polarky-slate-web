import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LiveScoreRingProps {
  score: number
  color: string
}

export function LiveScoreRing({ score, color }: LiveScoreRingProps) {
  const scoreTextRef = useRef<SVGTSpanElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const displayedScore = useRef(score)

  const size = 160
  const radius = 66
  const stroke = 14
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const obj = { value: displayedScore.current }
    gsap.to(obj, {
      value: score,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (scoreTextRef.current) scoreTextRef.current.textContent = obj.value.toFixed(1)
        if (arcRef.current) {
          const length = (obj.value / 10) * circumference
          arcRef.current.setAttribute('stroke-dasharray', `${length} ${circumference - length}`)
        }
        displayedScore.current = obj.value
      },
    })
  }, [score, circumference])

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-36 w-36 shrink-0 sm:h-40 sm:w-40">
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-paper)" strokeOpacity={0.06} strokeWidth={stroke} />
        <circle
          ref={arcRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="transition-[stroke] duration-300"
        />
      </g>
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-paper text-3xl font-bold">
        <tspan ref={scoreTextRef}>{score.toFixed(1)}</tspan>
      </text>
      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-paper/40 text-[0.55rem] uppercase tracking-widest">
        out of 10
      </text>
    </svg>
  )
}