import { Icon } from '@iconify/react'
import { resolveProviders } from '@/utils/streamingProviders'
import type { Title } from '@/types/Title'

interface TitleCardProps {
  title: Title
}

export function TitleCard({ title }: TitleCardProps) {
  const year = title.date ? new Date(title.date).getFullYear() : null
  const providers = resolveProviders(title.watchProviders)

  return (
    <article className="w-52 shrink-0">
      <div className="group relative aspect-2/3 overflow-hidden rounded-2xl ring-1 ring-paper/10">
        <img
          src={title.posterUrl}
          alt={title.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink via-ink/70 to-transparent" />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {title.isOngoing && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-paper">
              On air
            </span>
          )}
          {title.recommended && (
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink">
              <Icon icon="ph:star-fill" className="text-[0.7rem]" />
              Pick
            </span>
          )}
        </div>

        {title.overallScore != null && (
          <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-accent/70 bg-ink/80 text-xs font-bold text-accent">
            {title.overallScore.toFixed(1)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-2 px-3 pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {providers.length > 0 ? (
            <div className="flex items-center gap-2">
              {providers.slice(0, 4).map((p) => (
                <span key={p.label} role="img" aria-label={p.label}>
                  <Icon icon={p.icon} className="text-lg text-paper/90" />
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[0.7rem] text-paper/50">Not streaming yet</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="truncate text-sm font-bold text-paper">{title.name}</h3>
        <p className="text-xs text-paper/50">
          {year}
          {title.genres[0] ? ` · ${title.genres[0]}` : ''}
        </p>
      </div>
    </article>
  )
}