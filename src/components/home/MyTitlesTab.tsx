import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Icon } from '@iconify/react'
import { SegmentedControl } from './SegmentedControl'
import { useMyTitles } from '@/hooks/useTitles'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { groupByYear } from '@/utils/groupByYear'
import { TitleGridCard } from './TitleGridCard'
import { SearchInput } from './SearchInput';

type SectionKey = 'movies' | 'shows'

export function MyTitlesTab() {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<SectionKey>('movies')
  const debouncedQuery = useDebouncedValue(query, 300)

  const { data, isLoading } = useMyTitles({
    q: debouncedQuery.trim() || undefined,
  })

  const movies = useMemo(() => (data ?? []).filter((t) => t.type.toLowerCase() === 'movie'), [data])
  const shows = useMemo(() => (data ?? []).filter((t) => t.type.toLowerCase() === 'tv'), [data])

  const activeList = section === 'movies' ? movies : shows
  const activeGroups = useMemo(() => groupByYear(activeList), [activeList])

  const topRatedActive = useMemo(
    () => [...activeList].sort((a, b) => (b.overallScore ?? -1) - (a.overallScore ?? -1)).slice(0, 6),
    [activeList]
  )

  useGSAP(
    () => {
      gsap.fromTo(
        '.mytitles-year-group',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      )
    },
    { scope: ref, dependencies: [activeGroups.length, isLoading, section] }
  )

  return (
    <div ref={ref} className="space-y-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your titles…"
          className="sm:max-w-xs"
        />
        <SegmentedControl<SectionKey>
          options={[
            { value: 'movies', label: `Movies${movies.length ? ` · ${movies.length}` : ''}` },
            { value: 'shows', label: `TV Shows${shows.length ? ` · ${shows.length}` : ''}` },
          ]}
          value={section}
          onChange={setSection}
        />
      </div>

      {!debouncedQuery && topRatedActive.length > 0 && (
        <section>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Your best</p>
          <h2 className="mt-1 text-2xl font-normal tracking-tight text-paper">
            Top rated {section === 'movies' ? 'movies' : 'shows'}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {topRatedActive.map((title, index) => (
              <TitleGridCard key={title.titleId} title={title} rank={index + 1} hideRatedBadge />
            ))}
          </div>
        </section>
      )}

      {isLoading ? (
        <p className="text-sm text-paper/40">Loading your titles…</p>
      ) : activeGroups.length === 0 ? (
        <div className="rounded-2xl border border-paper/10 py-16 text-center">
          <Icon icon="ph:film-slate" className="mx-auto text-3xl text-paper/20" />
          <p className="mt-3 text-sm text-paper/40">
            {debouncedQuery
              ? 'No titles match your search.'
              : `You haven't rated any ${section === 'movies' ? 'movies' : 'TV shows'} yet.`}
          </p>
        </div>
      ) : (
        activeGroups.map((group) => (
          <section key={group.year} className="mytitles-year-group">
            <h2 className="text-2xl font-normal tracking-tight text-paper">{group.year}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {group.titles.map((title) => (
                <TitleGridCard key={title.titleId} title={title} hideRatedBadge />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}