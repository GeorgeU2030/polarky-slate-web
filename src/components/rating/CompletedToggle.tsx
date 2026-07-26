import { Icon } from '@iconify/react'

interface CompletedToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CompletedToggle({ checked, onChange }: CompletedToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-paper/10 p-4 text-left transition-colors hover:border-paper/20"
    >
      <div className="flex items-center gap-3">
        <Icon
          icon={checked ? 'ph:check-circle-fill' : 'ph:hourglass-medium-fill'}
          className={`text-xl ${checked ? 'text-accent' : 'text-paper/40'}`}
        />
        <div>
          <p className="text-sm font-bold text-paper">Finished the series</p>
          <p className="text-xs text-paper/45">Turn this off if you haven't caught up yet</p>
        </div>
      </div>

      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? 'var(--color-brand-bright)' : 'color-mix(in oklab, var(--color-paper) 15%, transparent)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition-transform duration-200"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </span>
    </button>
  )
}
