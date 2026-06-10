import type { Match, Player } from '@/types'
import { FixtureCard } from '@/components/FixtureCard'
import { AnimatedList } from '@/components/AnimatedList'

interface UpcomingFixturesProps {
  matches: Match[]
  playerMap: Map<string, Player>
}

export function UpcomingFixtures({ matches, playerMap }: UpcomingFixturesProps) {
  if (matches.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold text-text-faint uppercase tracking-wider mb-3 px-1">Upcoming</p>
      <AnimatedList className="flex flex-col gap-2" staggerMs={45}>
        {matches.map((m) => {
          const pA = playerMap.get(m.player_a)
          const pB = playerMap.get(m.player_b)
          if (!pA || !pB) return null
          return <FixtureCard key={m.id} match={m} playerA={pA} playerB={pB} compact />
        })}
      </AnimatedList>
    </div>
  )
}
