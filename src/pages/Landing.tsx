import { useTrendingMovies, useTrendingTv } from '@/hooks/useTrending'
import { Hero } from '@/components/landing/Hero'
import { CarouselRow } from '@/components/landing/CarouselRow'
import { ScoreLedger } from '@/components/landing/ScoreLedger'
import { GUTTER } from '@/utils/layout'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router'

export const Landing = () => {
  const { data: movies, isLoading: loadingMovies } = useTrendingMovies()
  const { data: shows, isLoading: loadingShows } = useTrendingTv()

  const navigate = useNavigate();

  return (
    <div className="bg-ink">
      <Hero backdropUrls={movies?.slice(0, 3).map((m) => m.backdropUrl)} />

      <main>
        <div id="movies">
          <CarouselRow eyebrow="Trending" heading="Movies on the slate" items={movies} isLoading={loadingMovies} />
        </div>

        <div id="tv" className="border-t border-paper/5">
          <CarouselRow eyebrow="Trending" heading="Series worth a binge" items={shows} isLoading={loadingShows} />
        </div>

        <div id="score">
          <ScoreLedger exampleTitle={movies?.[1]} />
        </div>

        <section className={`border-t border-paper/10 py-24 text-center ${GUTTER}`}>
          <div className="flex items-center justify-center gap-2.5 text-paper">
            <img
              src="/slate.png"
              alt="Slate"
              className="h-8 w-8 rounded-lg shadow-sm shadow-ink/30"
            />
            <span className="text-3xl font-normal tracking-tight">
              Slate
            </span>
          </div>

          <h2 className="mx-auto mt-6 max-w-xl text-3xl font-normal tracking-tight text-paper sm:text-4xl">
            Stop guessing if it's worth the runtime.
          </h2>

          <Button
            size="lg"
            className="mt-8 rounded-full bg-brand-bright px-10 font-semibold text-paper"
            onPress={() => navigate('/register')}
          >
            Create your account
          </Button>
        </section>
      </main>

      <footer className={`border-t border-paper/10 py-10 text-sm text-paper/50 ${GUTTER}`}>
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span>Slate - developed by</span>

            <div className="flex items-center gap-2">
              <div className="bg-paper h-7 w-7 rounded-lg flex items-center justify-center">
                <img
                  src="/nephbyte.png"
                  alt="Nephbyte"
                  className="h-10 w-10 scale-125 object-contain"
                />
              </div>
              <span className="font-medium text-paper">
                Nephbyte
              </span>
            </div>
          </div>

          <p>
            © {new Date().getFullYear()} Nephbyte. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}