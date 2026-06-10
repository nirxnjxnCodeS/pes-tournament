'use client'

import type { Award } from '@/types'
import { useRealtimeMatches } from '@/hooks/useRealtimeMatches'
import { TrophyCard } from './TrophyCard'
import { AnimatedList } from '@/components/AnimatedList'

interface AwardGridProps {
  awards: Award[]
}

export function AwardGrid({ awards }: AwardGridProps) {
  useRealtimeMatches('awards-realtime')

  return (
    <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerMs={60}>
      {awards.map((award) => (
        <TrophyCard key={award.id} award={award} />
      ))}
    </AnimatedList>
  )
}
