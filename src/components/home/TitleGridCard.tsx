import { useState } from 'react'
import { Icon } from '@iconify/react'
import { ScoreBadge } from './ScoreBadge'
import type { Title, MyTitle } from '@/types/Title'
import { useNavigate } from 'react-router'

interface TitleGridCardProps {
  title: Title | MyTitle
  rank?: number
  hideRatedBadge?: boolean
}

export function TitleGridCard({ title, rank, hideRatedBadge }: TitleGridCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const year = title.date ? new Date(title.date).getFullYear() : null
  const isRated = title.overallScore != null
  const isMovie = title.type.toLowerCase() === 'movie'
  const isTopRated = rank != null

  const navigate = useNavigate();

  return (
    <article
      className={`group cursor-pointer rounded-2xl ${
        isTopRated ? 'bg-linear-to-b from-accent/20 via-accent/5 to-transparent p-2' : ''
      }`}
      onClick={() => navigate('/rating', { state: { title } })}
    >
      <div
        className={`relative aspect-2/3 overflow-hidden rounded-2xl ring-1 transition-shadow ${
          isTopRated ? 'ring-accent/60 shadow-lg shadow-accent/20' : 'ring-paper/10'
        }`}
      >
        {imageFailed || !title.posterUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-ink">
            <Icon icon="icon-park-outline:theater" className="text-4xl text-paper/25" />
          </div>
        ) : (
          <img
            src={title.posterUrl}
            alt={title.name}
            loading="lazy"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink via-ink/40 to-transparent" />

        <div
          className={`absolute bottom-2 left-2 flex h-8 items-center justify-center gap-1 rounded-full bg-ink/80 text-paper/80 ${
            !isMovie && title.seasonsCount ? 'px-2.5' : 'w-8'
          }`}
        >
          <Icon icon={isMovie ? 'ph:film-slate' : 'ph:television-simple'} className="text-base" />
          {!isMovie && title.seasonsCount ? (
            <span className="text-[0.65rem] font-semibold">{title.seasonsCount}</span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2">
          <ScoreBadge score={title.overallScore} />
        </div>

        {!isMovie && title.completed != null && (
          <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80">
            <Icon
              icon={title.completed ? 'ph:check-circle-fill' : 'ph:hourglass-medium-fill'}
              aria-label={title.completed ? 'Finished' : 'Still watching'}
              className={`text-base ${title.completed ? 'text-accent' : 'text-paper/60'}`}
            />
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {isTopRated && (
            <div className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink">
              <Icon icon="ph:crown-simple-fill" className="text-xs" />
              #{rank}
            </div>
          )}
          {title.isOngoing && (
            <div className="flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-paper">
              <Icon icon="ph:broadcast-fill" className="text-xs" />
              On air
            </div>
          )}
          {isRated && !hideRatedBadge && (
            <div className="flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-accent">
              <Icon icon="ph:bookmark-simple-fill" className="text-xs" />
              Rated
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="truncate text-sm font-bold text-paper">{title.name}</h3>
        <p className="text-xs text-paper/50">
          {year}
          {title.genres[0] ? ` · ${title.genres[0]}` : ''}
        </p>
      </div>
    </article>
  )
}