interface RecommendToggleProps {
    checked: boolean
    onChange: (checked: boolean) => void
  }
  
  export function RecommendToggle({ checked, onChange }: RecommendToggleProps) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between rounded-2xl border border-paper/10 p-4 text-left transition-colors hover:border-paper/20"
      >
        <div>
          <p className="text-sm font-bold text-paper">Recommend it</p>
          <p className="text-xs text-paper/45">Would you tell a friend to watch this?</p>
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