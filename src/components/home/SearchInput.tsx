import { Input } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { InputProps } from '@heroui/react'

export function SearchInput(props: InputProps) {
  return (
    <div className="relative">
      <Icon
        icon="ph:magnifying-glass"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-paper/30"
      />
      <Input
        {...props}
        className={`w-full rounded-xl ring-accent border border-paper/15 bg-transparent py-3 pl-11 pr-4 text-sm text-paper placeholder:text-paper/30 focus:border-paper/30 focus:outline-none ${props.className ?? ''}`}
      />
    </div>
  )
}