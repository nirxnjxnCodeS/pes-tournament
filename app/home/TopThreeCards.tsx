'use client'

import { motion } from 'framer-motion'
import type { Standing } from '@/types'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'

interface TopThreeCardsProps {
  standings: Standing[]
}

const STREAK_ICONS: Record<'W' | 'D' | 'L', string> = { W: '🔥', D: '〰️', L: '📉' }

// Render order: [2nd, 1st, 3rd] — display indices into top3 array
const PODIUM = [
  { dataIdx: 1, medal: '🥈', isFirst: false, delay: 0.08, initScale: 0.92 },
  { dataIdx: 0, medal: '🥇', isFirst: true,  delay: 0,    initScale: 0.88 },
  { dataIdx: 2, medal: '🥉', isFirst: false, delay: 0.16, initScale: 0.92 },
] as const

export function TopThreeCards({ standings }: TopThreeCardsProps) {
  const top3 = standings.slice(0, 3)
  if (top3.length === 0) return null

  const entries = PODIUM.filter(({ dataIdx }) => top3[dataIdx] != null)
    .map((p) => ({ ...p, standing: top3[p.dataIdx] }))

  return (
    <div>
      <p className="text-xs font-semibold text-text-faint uppercase tracking-wider mb-3 px-1">Top 3</p>
      <div className="flex items-end gap-2">
        {entries.map(({ standing: s, medal, isFirst, delay, initScale }) => (
          <motion.div
            key={s.player.id}
            initial={{ opacity: 0, scale: initScale }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay }}
            whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
            className={[
              'flex-1 flex flex-col items-center gap-2 bg-surface border border-border rounded-card px-3 py-4 transition-colors',
              isFirst ? 'border-accent/40 bg-accent/5 pt-8' : '',
            ].join(' ')}
          >
            <span className="text-2xl">{medal}</span>
            <PlayerAvatar player={s.player} size={isFirst ? 'lg' : 'sm'} showRing />
            <div className="text-center">
              <p className="text-xs font-semibold text-text truncate w-full">{s.player.name}</p>
              <p className="text-sm font-bold text-accent tabular-nums">{s.points}pts</p>
              <p className="text-[10px] text-text-faint tabular-nums">
                {s.goal_difference > 0 ? '+' : ''}{s.goal_difference} GD
              </p>
              {s.streak.type && s.streak.count >= 2 && (
                <p className={[
                  'text-[10px] font-semibold mt-0.5',
                  s.streak.type === 'W' ? 'text-win' : s.streak.type === 'L' ? 'text-loss' : 'text-text-muted',
                ].join(' ')}>
                  {STREAK_ICONS[s.streak.type]} {s.streak.count}{s.streak.type}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
