'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CountUp } from '@/components/CountUp'

const TOTAL_MATCHES   = 66
const MATCHES_PER_DAY = 6
const TOTAL_MATCHDAYS = 11

interface MatchdayProgressProps {
  playedCount: number
}

export function MatchdayProgress({ playedCount }: MatchdayProgressProps) {
  const shouldReduceMotion = useReducedMotion()
  const matchday    = Math.min(Math.ceil(playedCount / MATCHES_PER_DAY) || 1, TOTAL_MATCHDAYS)
  const fillPercent = Math.min((playedCount / TOTAL_MATCHES) * 100, 100)
  const isStart     = playedCount === 0

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-text">
        Matchday {matchday} of {TOTAL_MATCHDAYS}
        {isStart && <span className="text-text-muted font-normal"> — Get started!</span>}
      </p>

      <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? false : { width: '0%' }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full bg-accent rounded-full"
          role="progressbar"
          aria-valuenow={playedCount}
          aria-valuemin={0}
          aria-valuemax={TOTAL_MATCHES}
          aria-label={`${playedCount} of ${TOTAL_MATCHES} matches played`}
        />
      </div>

      <p className="text-xs text-text-muted text-right tabular-nums">
        <CountUp key={playedCount} from={0} to={playedCount} duration={800} />{' '}
        of {TOTAL_MATCHES} matches played
      </p>
    </div>
  )
}
