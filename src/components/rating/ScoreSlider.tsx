import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ScoreSliderProps {
  value: number
  min?: number
  max?: number
  color: string
  onChange: (value: number) => void
  ariaLabel: string
}

export function ScoreSlider({ value, min = 1, max = 10, color, onChange, ariaLabel }: ScoreSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const percentFor = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max])

  const paintTo = useCallback((v: number, animate: boolean) => {
    const pct = percentFor(v)
    const target = { pct }
    if (animate) {
      gsap.to(fillRef.current, { width: `${pct}%`, duration: 0.25, ease: 'power2.out' })
      gsap.to(thumbRef.current, { left: `${pct}%`, duration: 0.25, ease: 'power2.out' })
    } else {
      gsap.set(fillRef.current, { width: `${pct}%` })
      gsap.set(thumbRef.current, { left: `${pct}%` })
    }
    void target
  }, [percentFor])

  useEffect(() => {
    if (!isDragging.current) paintTo(value, true)
  }, [value, paintTo])

  const valueFromClientX = (clientX: number) => {
    const track = trackRef.current
    if (!track) return value
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const raw = min + ratio * (max - min)
    return Math.round(raw)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const next = valueFromClientX(e.clientX)
    onChange(next)
    paintTo(next, false)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const next = valueFromClientX(e.clientX)
    onChange(next)
    paintTo(next, false)
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(max, value + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(min, value - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(max)
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative h-1.5 w-full cursor-pointer touch-none rounded-full outline-none"
      style={{ backgroundColor: 'color-mix(in oklab, var(--color-paper) 12%, transparent)' }}
    >
      <div
        ref={fillRef}
        className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color, width: `${percentFor(value)}%` }}
      />
      <div
        ref={thumbRef}
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md"
        style={{ left: `${percentFor(value)}%`, borderColor: color, backgroundColor: 'var(--color-ink)' }}
      />
    </div>
  )
}