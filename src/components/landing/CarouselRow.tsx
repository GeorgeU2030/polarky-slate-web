import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button, Skeleton } from '@heroui/react'
import { Icon } from '@iconify/react'
import { TitleCard } from './TitleCard'
import type { Title } from '@/types/Title'

gsap.registerPlugin(ScrollTrigger)

const GUTTER = 'px-6 sm:px-10 lg:px-16 xl:px-20'

const SCROLL_GUTTER =
  'scroll-pl-6 sm:scroll-pl-10 lg:scroll-pl-16 xl:scroll-pl-20 ' +
  'scroll-pr-6 sm:scroll-pr-10 lg:scroll-pr-16 xl:scroll-pr-20'

interface CarouselRowProps {
  eyebrow: string
  heading: string
  items?: Title[]
  isLoading?: boolean
  compact?: boolean
}

export function CarouselRow({ eyebrow, heading, items, isLoading, compact = false }: CarouselRowProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isLoading) return;
      if (!items?.length) return;

      const scroller = scrollerRef.current;
      if (!scroller) return;

      const cards = gsap.utils.toArray<HTMLElement>(".slate-card", scroller);

      gsap.set(cards, {
          opacity: 0,
          y: 32,
      });

      ScrollTrigger.batch(cards, {
        start: 'left 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }),
      })

      let isDown = false
      let startX = 0
      let startScroll = 0

      const onPointerDown = (e: PointerEvent) => {
        isDown = true
        startX = e.clientX
        startScroll = scroller.scrollLeft
        scroller.style.scrollSnapType = 'none'
        scroller.setPointerCapture(e.pointerId)
      }
      const onPointerMove = (e: PointerEvent) => {
        if (!isDown) return
        scroller.scrollLeft = startScroll - (e.clientX - startX)
      }
      const onPointerUp = () => {
        isDown = false
        scroller.style.scrollSnapType = ''
      }

      scroller.addEventListener('pointerdown', onPointerDown)
      scroller.addEventListener('pointermove', onPointerMove)
      scroller.addEventListener('pointerup', onPointerUp)
      scroller.addEventListener('pointercancel', onPointerUp)

      return () => {
        scroller.removeEventListener('pointerdown', onPointerDown)
        scroller.removeEventListener('pointermove', onPointerMove)
        scroller.removeEventListener('pointerup', onPointerUp)
        scroller.removeEventListener('pointercancel', onPointerUp)
      }
    },
    {
      scope: sectionRef,
      dependencies: [items, isLoading],
    }
  )

  const scrollByCard = (dir: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>('.slate-card')
    const distance = (card?.offsetWidth ?? 280) + 24
    scroller.scrollBy({ left: dir * distance, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className={`relative ${compact ? 'py-8 first:pt-4' : 'py-16 sm:py-20'}`}>
      <div className={`flex items-end justify-between ${GUTTER}`}>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-normal tracking-tight text-paper sm:text-4xl">{heading}</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button
            isIconOnly
            variant="outline"
            aria-label="Previous"
            className="border-paper/15 text-paper/70 transition-colors hover:border-brand-bright hover:text-brand-bright"
            onPress={() => scrollByCard(-1)}
          >
            <Icon icon="line-md:chevron-left" />
          </Button>
          <Button
            isIconOnly
            variant="outline"
            aria-label="Next"
            className="border-paper/15 text-paper/70 transition-colors hover:border-brand-bright hover:text-brand-bright"
            onPress={() => scrollByCard(1)}
          >
            <Icon icon="line-md:chevron-right" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={`mt-8 flex cursor-grab snap-x snap-mandatory select-none gap-6 overflow-x-auto scroll-smooth ${GUTTER} ${SCROLL_GUTTER}`}
        style={{
          scrollbarWidth: 'none',
          maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
        }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-84 w-52 shrink-0 snap-start rounded-2xl bg-paper/5" />
            ))
          : items?.map((item) => (
              <div key={item.tmdbId} className="slate-card shrink-0 snap-start">
                <TitleCard title={item} />
              </div>
            ))}
      </div>
    </section>
  )
}