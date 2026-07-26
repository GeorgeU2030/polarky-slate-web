import { useTrendingMovies, useTrendingTv } from '@/hooks/useTrending'
import { CarouselRow } from '@/components/landing/CarouselRow'

export function TrendingTab() {
  const { data: movies, isLoading: loadingMovies } = useTrendingMovies()
  const { data: shows, isLoading: loadingShows } = useTrendingTv()

  return (
    <div>
      <p className="max-w-lg text-sm leading-relaxed text-paper/50">
        What's trending across theaters and streaming right now - pulled fresh, updated as the slate changes.
      </p>

      <div className="-mx-6 mt-6 sm:-mx-10 lg:-mx-16 xl:-mx-20">
        <CarouselRow compact eyebrow="Trending" heading="Movies right now" items={movies} isLoading={loadingMovies} />
        <CarouselRow compact eyebrow="Trending" heading="Series worth a binge" items={shows} isLoading={loadingShows} />
      </div>
    </div>
  )
}