import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useNavigate } from 'react-router'
import { Button, Tabs } from '@heroui/react'
import { Icon } from '@iconify/react'
import { TrendingTab } from '@/components/home/TrendingTab'
import { MyTitlesTab } from '@/components/home/MyTitlesTab'
import { SearchTab } from '@/components/home/SearchTab'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/services/auth'
import { GUTTER } from '@/utils/layout'

type TabKey = 'trending' | 'mine' | 'search'

const TABS: { id: TabKey; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'mine', label: 'My Titles' },
  { id: 'search', label: 'Search' },
]

export function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const clearTokens = useAuthStore((s) => s.clearTokens)
  const [tab, setTab] = useState<TabKey>('trending')

  useGSAP(
    () => {
      gsap.fromTo(
        '.home-content',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    },
    { scope: ref, dependencies: [tab] }
  )

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearTokens()
      navigate('/login')
    }
  }

  return (
    <div ref={ref} className="min-h-screen bg-ink">
      <nav className={`flex items-center justify-between py-6 ${GUTTER}`}>
        <div className="flex items-center gap-2.5 text-paper">
            <img src="/slate.png" alt="Slate" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-normal tracking-tight">Slate</span>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-paper/15 hover:bg-brand text-paper/70 hover:border-brand-bright hover:text-paper"
          onPress={handleLogout}
        >
          <Icon icon="ph:sign-out" className="mr-1.5" />
          Log out
        </Button>
      </nav>

      <main className={`pb-24 pt-4 ${GUTTER}`}>
      <Tabs
        variant="secondary"
        selectedKey={tab}
        onSelectionChange={(key) => setTab(key as TabKey)}
        >
        <Tabs.ListContainer className="border-b border-paper/10">
            <Tabs.List aria-label="Slate sections" className="flex gap-8">
            {TABS.map((item) => (
                <Tabs.Tab
                key={item.id}
                id={item.id}
                className="relative bg-transparent pb-4 text-sm font-medium text-paper/45 outline-none transition-colors data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-0 data-[selected=true]:text-paper"
                >
                {item.label}
                <Tabs.Indicator className="h-0.5 rounded-full bg-accent" />
                </Tabs.Tab>
            ))}
            </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="trending" className="home-content mt-8">
            <TrendingTab />
        </Tabs.Panel>
        <Tabs.Panel id="mine" className="home-content mt-8">
            <MyTitlesTab />
        </Tabs.Panel>
        <Tabs.Panel id="search" className="home-content mt-8">
            <SearchTab />
        </Tabs.Panel>
        </Tabs>
      </main>
    </div>
  )
}