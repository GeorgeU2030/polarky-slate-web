import { useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLocation, useNavigate } from 'react-router'
import { Button, TextField, Label, TextArea, toast } from '@heroui/react'
import { Icon } from '@iconify/react'
import { ScoreCategoryRow } from '@/components/rating/ScoreCategoryRow'
import { LiveScoreRing } from '@/components/rating/LiveScoreRing'
import { RecommendToggle } from '@/components/rating/RecommendedToggle'
import { CompletedToggle } from '@/components/rating/CompletedToggle'
import { CommunityScoreBadge } from '@/components/rating/CommunityScoreBadge'
import { useUserTitleDetail, useRateTitle, useUpdateRating, useDeleteRating } from '@/hooks/useRating'
import { calculateScore } from '@/utils/scoreCalculator'
import { getScoreColor } from '@/utils/scoreColor'
import { resolveProviders } from '@/utils/streamingProviders'
import { GUTTER } from '@/utils/layout'
import type { Title, MyTitle } from '@/types/Title'
import type { RatingScores } from '@/types/Rating'

const CATEGORIES: {
  key: keyof RatingScores
  icon: string
  label: string
  description: string
  weight: number
}[] = [
  { key: 'storyScore', icon: 'ph:book-open-text', label: 'Story', description: 'Plot, pacing, and writing', weight: 30 },
  { key: 'directionScore', icon: 'ph:film-strip', label: 'Direction', description: 'Vision, tone, and craft behind the camera', weight: 20 },
  { key: 'actingScore', icon: 'ph:mask-happy', label: 'Acting', description: 'Performances that sell the story', weight: 20 },
  { key: 'technicalScore', icon: 'ph:sliders-horizontal', label: 'Technical', description: 'Cinematography, editing, sound, effects', weight: 15 },
  { key: 'impactScore', icon: 'ph:heart-straight', label: 'Impact', description: 'How much it stuck with you', weight: 15 },
]

const DEFAULT_SCORES: RatingScores = {
  storyScore: 5,
  actingScore: 5,
  directionScore: 5,
  technicalScore: 5,
  impactScore: 5,
}

export function Rating() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const title = location.state?.title as (Title | MyTitle) | undefined

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [scores, setScores] = useState<RatingScores>(DEFAULT_SCORES)
  const [review, setReview] = useState('')
  const [recommended, setRecommended] = useState(false)
  const [completed, setCompleted] = useState(true)

  const isTv = title?.type.toLowerCase() === 'tv'
  const isEditMode = !!title?.userTitleId
  const { data: existing, isLoading: loadingExisting } = useUserTitleDetail(title?.userTitleId ?? undefined)

  const rateMutation = useRateTitle()
  const updateMutation = useUpdateRating(title?.userTitleId ?? '')
  const deleteMutation = useDeleteRating(title?.userTitleId ?? '')

  useEffect(() => {
    if (!existing) return
    setScores({
      storyScore: existing.storyScore,
      actingScore: existing.actingScore,
      directionScore: existing.directionScore,
      technicalScore: existing.technicalScore,
      impactScore: existing.impactScore,
    })
    setReview(existing.review ?? '')
    setRecommended(existing.recommended)
    setCompleted(existing.completed ?? true)
  }, [existing])

  useGSAP(
    () => {
      gsap.fromTo(
        '.rating-fade',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      )
    },
    { scope: ref, dependencies: [loadingExisting] }
  )

  const liveScore = useMemo(
    () =>
      calculateScore({
        story: scores.storyScore,
        acting: scores.actingScore,
        direction: scores.directionScore,
        technical: scores.technicalScore,
        impact: scores.impactScore,
      }),
    [scores]
  )

  if (!title) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
        <Icon icon="ph:warning-circle" className="text-4xl text-paper/30" />
        <p className="text-paper/60">We lost track of which title you wanted to rate.</p>
        <Button variant="outline" className="border-paper/15 text-paper" onPress={() => navigate('/home')}>
          Back to Slate
        </Button>
      </div>
    )
  }

  const updateScore = (key: keyof RatingScores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (isEditMode) {
      await updateMutation.mutateAsync({ ...scores, review, recommended, ...(isTv ? { completed } : {}) })
      toast.success('Rating updated', { description: `${title.name} · ${liveScore.toFixed(1)} / 10` })
    } else {
      await rateMutation.mutateAsync({
        tmdbId: title.tmdbId,
        type: title.type.toLowerCase() as 'movie' | 'tv',
        ...scores,
        review,
        recommended,
        ...(isTv ? { completed } : {}),
      })
      toast.success('Rating saved', { description: `${title.name} · ${liveScore.toFixed(1)} / 10` })
    }
    navigate('/home')
  }
  
  const handleDelete = async () => {
    await deleteMutation.mutateAsync()
    toast('Rating deleted', { description: title.name })
    navigate('/home')
  }

  const isSaving = rateMutation.isPending || updateMutation.isPending
  const providers = resolveProviders(title.watchProviders)
  const hasAbout = !!title.overview || title.productionCompanies.length > 0 || providers.length > 0

  const averageScore = existing?.averageScore ?? title.averageScore ?? null
  const ratingsCount = existing?.ratingsCount ?? title.ratingsCount ?? 0

  return (
    <div ref={ref} className="min-h-screen bg-ink pb-24">
      <nav className={`flex items-center py-6 ${GUTTER}`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-paper"
        >
          <Icon icon="ph:arrow-left" />
          Back
        </button>
      </nav>

      <div className={GUTTER}>
        <div className="rating-fade relative overflow-hidden rounded-3xl">
          {title.backdropUrl && (
            <img src={title.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/40" />
          <div className="relative flex flex-wrap items-end justify-between gap-5 p-6 sm:p-8">
            <div className="flex items-end gap-5">
              <img
                src={title.posterUrl}
                alt={title.name}
                className="h-32 w-22 shrink-0 rounded-xl object-cover shadow-lg sm:h-40 sm:w-28"
              />
              <div className="min-w-0 pb-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {isEditMode ? 'Editing your rating' : 'Rate this title'}
                </p>
                <h1 className="mt-1 truncate text-2xl font-normal tracking-tight text-paper sm:text-3xl">
                  {title.name}
                </h1>
                <p className="mt-1 text-sm text-paper/50">
                  {title.date ? new Date(title.date).getFullYear() : ''}
                  {title.genres[0] ? ` · ${title.genres[0]}` : ''}
                  {title.type.toLowerCase() === 'tv' && title.seasonsCount
                    ? ` · ${title.seasonsCount} season${title.seasonsCount === 1 ? '' : 's'}`
                    : ''}
                </p>
              </div>
            </div>

            {averageScore != null && (
              <CommunityScoreBadge averageScore={averageScore} ratingsCount={ratingsCount} />
            )}
          </div>
        </div>

        {hasAbout && (
          <div className="rating-fade mt-6 rounded-2xl border border-paper/10 p-6">
            {title.overview && (
              <p className="text-sm leading-relaxed text-paper/60">{title.overview}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">
              {title.productionCompanies.length > 0 && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-wide text-paper/30">Production</p>
                  <div className="mt-1.5 flex h-8 items-center">
                    <p className="text-sm text-paper/70">{title.productionCompanies.join(', ')}</p>
                  </div>
                </div>
              )}

              {providers.length > 0 && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-wide text-paper/30">Where to watch</p>
                  <div className="mt-1.5 flex h-8 items-center gap-2">
                    {providers.map((p) => (
                      <span
                        key={p.label}
                        className="flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/5 px-2.5 py-1.5 text-xs text-paper/70"
                      >
                        <Icon icon={p.icon} className="text-sm" />
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="rating-fade">
            <div className="divide-y divide-paper/8">
              {CATEGORIES.map((cat) => (
                <ScoreCategoryRow
                  key={cat.key}
                  icon={cat.icon}
                  label={cat.label}
                  description={cat.description}
                  weight={cat.weight}
                  value={scores[cat.key]}
                  onChange={(v) => updateScore(cat.key, v)}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                    size="lg"
                    isDisabled={isSaving}
                    className="w-full rounded-xl bg-brand-bright px-12 font-semibold text-paper sm:w-auto"
                    onPress={handleSubmit}
                >
                    {isSaving ? 'Saving…' : isEditMode ? 'Update rating' : 'Save rating'}
                </Button>

                {isEditMode && !confirmingDelete && (
                    <button
                    onClick={() => setConfirmingDelete(true)}
                    aria-label="Delete rating"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-paper/10 text-paper/40 transition-colors hover:border-brand-bright hover:text-brand-bright"
                    >
                    <Icon icon="ph:trash" className="text-lg" />
                    </button>
                )}
            </div>

            {isEditMode && confirmingDelete && (
              <div className="mt-3 flex w-full max-w-md items-center justify-between rounded-xl border border-brand-bright/30 bg-brand-bright/5 px-4 py-3">
                <p className="text-sm text-paper/70">Delete this rating? This can't be undone.</p>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="text-sm text-paper/40 hover:text-paper/70"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="text-sm font-semibold text-brand-bright hover:opacity-80"
                  >
                    {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rating-fade space-y-6">
            <div className="flex flex-col items-center rounded-2xl border border-paper/10 p-6">
              <LiveScoreRing score={liveScore} color={getScoreColor(liveScore)} />
              <p className="mt-3 text-xs text-paper/40">Updates as you adjust the sliders</p>
            </div>

            <RecommendToggle checked={recommended} onChange={setRecommended} />

            {isTv && <CompletedToggle checked={completed} onChange={setCompleted} />}

            <TextField className="w-full">
              <Label className="text-xs font-medium uppercase tracking-wide text-paper/50">
                Your review (optional)
              </Label>
              <TextArea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What stood out to you?"
                rows={4}
                className="mt-1.5 w-full resize-none rounded-xl border border-paper/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </TextField>
          </div>
        </div>
      </div>
    </div>
  )
}