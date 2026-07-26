import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Icon } from '@iconify/react'
import { useSearchTitles } from '@/hooks/useTitles'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { TitleGridCard } from './TitleGridCard'
import { SearchInput } from './SearchInput'

export function SearchTab() {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)
  const { data, isLoading, isFetching } = useSearchTitles(debouncedQuery)

  useGSAP(
    () => {
      gsap.fromTo(
        '.search-result-card',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      )
    },
    { scope: ref, dependencies: [data?.length] }
  )

  return (
    <div ref={ref}>
      <div className="relative max-w-md">
        <Icon
          icon="ph:magnifying-glass"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-paper/30"
        />
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any movie or show…"
        />
      </div>

      <div className="mt-8">
        {debouncedQuery.trim().length < 2 ? (
          <p className="text-sm text-paper/30">Type at least 2 characters to search.</p>
        ) : isLoading || isFetching ? (
          <p className="text-sm text-paper/40">Searching…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-paper/40">No results for "{debouncedQuery}".</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {data.map((title) => (
              <div key={`${title.type}-${title.tmdbId}`} className="search-result-card">
                <TitleGridCard title={title} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}