import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'

interface MaintenanceProps {
  reason: 'offline' | 'server'
  onRetry: () => void
  isRetrying: boolean
}

const COPY = {
  offline: {
    icon: 'lucide:wifi-off',
    title: "You're offline",
    description: "Slate can't reach the network right now. Check your connection — we'll pick up right where you left off.",
  },
  server: {
    icon: 'lucide:server-crash',
    title: 'Slate is taking a quick break',
    description: "Our servers are having a moment. We're already on it — this usually clears up in a few minutes.",
  },
} as const

export function Maintenance({ reason, onRetry, isRetrying }: MaintenanceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const copy = COPY[reason]

  useGSAP(
    () => {
      gsap.fromTo(
        '.maintenance-fade',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    },
    { scope: ref, dependencies: [reason] }
  )

  return (
    <div ref={ref} className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <div className="maintenance-fade flex items-center gap-2.5 text-paper">
        <img src="/slate.png" alt="Slate" className="h-8 w-8 rounded-lg" />
        <span className="text-lg font-normal tracking-tight">Slate</span>
      </div>

      <Icon icon={copy.icon} className="maintenance-fade mt-10 text-5xl text-brand-bright" />

      <h1 className="maintenance-fade mt-6 text-3xl font-normal tracking-tight text-paper sm:text-4xl">
        {copy.title}
      </h1>
      <p className="maintenance-fade mt-3 max-w-md text-sm leading-relaxed text-paper/60">
        {copy.description}
      </p>

      <Button
        size="lg"
        isDisabled={isRetrying}
        className="maintenance-fade mt-8 rounded-xl bg-brand-bright px-8 font-semibold text-paper disabled:opacity-60"
        onPress={onRetry}
      >
        {isRetrying && <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />}
        {isRetrying ? 'Checking…' : 'Try again'}
      </Button>

      <p className="maintenance-fade mt-4 text-xs text-paper/30">
        We'll also keep checking automatically.
      </p>
    </div>
  )
}