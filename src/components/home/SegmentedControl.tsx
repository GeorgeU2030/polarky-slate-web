import { useRef, useLayoutEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)

  const movePill = (animate: boolean) => {
    const container = containerRef.current
    const pill = pillRef.current
    if (!container || !pill) return

    const activeButton = container.querySelector<HTMLElement>(`[data-value="${value}"]`)
    if (!activeButton) return

    const { offsetLeft, offsetWidth } = activeButton
    if (animate) {
      gsap.to(pill, { x: offsetLeft, width: offsetWidth, duration: 0.3, ease: 'power3.out' })
    } else {
      gsap.set(pill, { x: offsetLeft, width: offsetWidth })
    }
  }

  const labelsKey = options.map((opt) => opt.label).join('|')

  useLayoutEffect(() => {
    movePill(false)
  }, [])

  useGSAP(() => {
    movePill(true)
  }, [value, labelsKey])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full border border-paper/10 p-1"
    >
      <div
        ref={pillRef}
        className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-accent/15"
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-value={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value ? 'text-accent' : 'text-paper/45 hover:text-paper/70'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}