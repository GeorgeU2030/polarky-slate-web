import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from '@heroui/react'
import { calculateScore } from '@/utils/scoreCalculator'
import { GUTTER } from '@/utils/layout'
import type { Title } from '@/types/Title'

gsap.registerPlugin(ScrollTrigger)

const WEIGHTS = [
  { label: 'Story', key: 'story', value: 30, color: 'var(--color-brand-bright)' },
  { label: 'Direction', key: 'direction', value: 20, color: 'var(--color-accent-dim)' },
  { label: 'Acting', key: 'acting', value: 20, color: 'var(--color-accent)' },
  { label: 'Technical', key: 'technical', value: 15, color: 'var(--color-brand-dim)' },
  { label: 'Impact', key: 'impact', value: 15, color: 'var(--color-stone-400)' },
] as const

const EXAMPLE_SCORES = { story: 9, direction: 8, acting: 8, technical: 7, impact: 8 }

interface ScoreLedgerProps {
  exampleTitle?: Title
}

export function ScoreLedger({ exampleTitle }: ScoreLedgerProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scoreTextRef = useRef<SVGTSpanElement>(null)
  const score = calculateScore(EXAMPLE_SCORES)

  useGSAP(
    () => {
      const panel = sectionRef.current?.querySelector('.ledger-panel') ?? null
      const segments = gsap.utils.toArray<HTMLElement>('.ledger-ring-segment', sectionRef.current)
      const rows = gsap.utils.toArray<HTMLElement>('.breakdown-row', sectionRef.current)

      gsap.set(panel, { opacity: 0, x: 24 })
      gsap.set(segments, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' })
      gsap.set(rows, { opacity: 0, y: 6 })

      const counter = { value: 0 }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(panel, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' })
          gsap.to(segments, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.6)', delay: 0.15 })
          gsap.to(rows, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.4 })
          gsap.to(counter, {
            value: score,
            duration: 1.1,
            delay: 0.5,
            ease: 'power2.out',
            onUpdate: () => {
              if (scoreTextRef.current) scoreTextRef.current.textContent = counter.value.toFixed(1)
            },
          })
        },
      })
    },
    { scope: sectionRef, dependencies: [score] }
  )

  const size = 140
  const radius = 58
  const stroke = 13
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulative = 0
  const segments = WEIGHTS.map((w) => {
    const length = (w.value / 100) * circumference
    const seg = { ...w, length, offset: cumulative }
    cumulative += length
    return seg
  })

  return (
    <section ref={sectionRef} className={`${GUTTER} py-20 sm:py-24`}>
      <Card className="border-none bg-paper p-8 text-ink shadow-2xl shadow-ink/40 sm:p-12">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-14">
          <div>
            <Card.Header className="p-0">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                The math behind the number
              </p>
              <Card.Title className="mt-2 text-3xl font-normal tracking-tight sm:text-4xl">
                How Slate scores a title
              </Card.Title>
              <Card.Description className="mt-4 text-sm leading-relaxed text-ink/70">
                Every score is a weighted average across five categories, not a single opinion.
                Story and direction carry the most weight, because that's what a film is built on.
              </Card.Description>
            </Card.Header>
          </div>

          <div className="ledger-panel rounded-2xl border border-ink/8 bg-ink/2 p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/5 sm:p-6">
            <div className="flex items-center gap-4">
              <svg viewBox={`0 0 ${size} ${size}`} className="h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <g transform={`rotate(-90 ${center} ${center})`}>
                  <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-ink)" strokeOpacity={0.06} strokeWidth={stroke} />
                  {segments.map((seg) => (
                    <circle
                      key={seg.label}
                      className="ledger-ring-segment"
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={stroke}
                      strokeLinecap="butt"
                      strokeDasharray={`${seg.length} ${circumference - seg.length}`}
                      strokeDashoffset={-seg.offset}
                    />
                  ))}
                </g>
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-ink text-2xl font-bold">
                  <tspan ref={scoreTextRef}>8.2</tspan>
                </text>
                <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-ink/40 text-[0.5rem] uppercase tracking-widest">
                  out of 10
                </text>
              </svg>

              {exampleTitle && (
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-wide text-ink/40">Example</p>
                  <p className="truncate text-sm font-bold leading-tight">{exampleTitle.name}</p>
                  <img
                    src={exampleTitle.posterUrl}
                    alt=""
                    className="mt-2 h-12 w-9 rounded-md object-cover opacity-90"
                  />
                </div>
              )}
            </div>

            <ul className="mt-5 space-y-1.5 border-t border-ink/8 pt-4">
              {WEIGHTS.map((w) => {
                const raw = EXAMPLE_SCORES[w.key as keyof typeof EXAMPLE_SCORES]
                const contribution = (raw * w.value) / 100
                return (
                  <li key={w.label} className="breakdown-row flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-ink/60">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: w.color }} />
                      {w.label}
                      <span className="text-ink/35">· {w.value}%</span>
                    </span>
                    <span className="flex items-center gap-2 tabular-nums">
                      <span className="text-ink/40">{raw}/10</span>
                      <span className="w-9 text-right font-semibold">+{contribution.toFixed(1)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-ink/8 pt-3 text-sm font-bold">
              <span>Final score</span>
              <span className="text-brand tabular-nums">{score.toFixed(1)} / 10</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}