import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'
import { GUTTER } from '@/utils/layout'

interface HeroProps {
  backdropUrls?: string[]
}

export function Hero({ backdropUrls = [] }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set())
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .set('.hero-line', { yPercent: 110 })
        .set('.hero-fade', { opacity: 0, y: 16 })
        .to('.hero-line', { yPercent: 0, duration: 0.9, stagger: 0.08 })
        .to('.hero-fade', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.4)
    },
    { scope: ref }
  )

  useEffect(() => {
    if (backdropUrls.length < 2) return
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % backdropUrls.length)
    }, 6000)
    return () => clearInterval(id)
  }, [backdropUrls.length])

  const markLoaded = (i: number) =>
    setLoadedSet((prev) => {
      const next = new Set(prev)
      next.add(i)
      return next
    })

  const scrollToScore = () => {
    document.getElementById('score')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header ref={ref} className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent-dim)_12%,transparent),transparent_60%)]" />

      {backdropUrls.map((url, i) => (
        <img
          key={url}
          src={url}
          alt=""
          onLoad={() => markLoaded(i)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loadedSet.has(i) && i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/20" />
      <div className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/40 to-transparent" />

      <nav className={`absolute inset-x-0 top-0 flex items-center justify-between py-6 ${GUTTER}`}>
        <div className="flex items-center gap-2.5 text-paper">
          <img src="/slate.png" alt="Slate" className="h-8 w-8 rounded-lg shadow-sm shadow-ink/30" />
          <span className="text-3xl font-normal tracking-tight">Slate</span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-paper/80 sm:flex">
          <a href="#movies" className="transition-colors hover:text-accent">Movies</a>
          <a href="#tv" className="transition-colors hover:text-accent">TV</a>
          <a href="#score" className="transition-colors hover:text-accent">How scoring works</a>
        </div>
        <Button
          variant="primary"
          className="rounded-xl bg-brand-bright font-semibold text-paper"
          onPress={() => navigate('/login')}
        >
          Sign in
        </Button>
      </nav>

      <div className={`relative z-10 max-w-3xl pb-20 sm:pb-28 ${GUTTER}`}>
        <p className="hero-fade text-xs uppercase tracking-[0.3em] text-accent">Now screening</p>
        <h1 className="mt-4 overflow-hidden">
          <span className="hero-line block text-5xl font-normal leading-[1.05] tracking-tight text-paper sm:text-7xl">
            Every title,
          </span>
          <span className="hero-line block text-5xl font-normal leading-[1.05] tracking-tight text-paper sm:text-7xl">
            scored on the <span className="text-accent">record.</span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-lg text-base text-paper/70 sm:text-lg">
          Slate tracks what's trending, breaks down the score behind every title, and keeps a
          running ledger of what's worth your time.
        </p>
        <div className="hero-fade mt-8 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            className="rounded-xl bg-brand-bright px-8 font-semibold text-paper"
            onPress={() => navigate('/register')}
          >
            Start tracking
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-paper/30 px-8 font-semibold text-paper"
            onPress={scrollToScore}
          >
            <Icon icon="tabler:play" />
            See how it works
          </Button>
        </div>
      </div>
    </header>
  )
}