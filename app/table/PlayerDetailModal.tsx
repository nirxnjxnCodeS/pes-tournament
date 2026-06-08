'use client'

import { useState } from 'react'
import type { Match, Player, Standing } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'
import { FixtureCard } from '@/components/FixtureCard'

interface PlayerDetailModalProps {
  standing: Standing
  allMatches: Match[]
  playerMap: Map<string, Player>
  onClose: () => void
}

type Tab = 'fixtures' | 'stats'

export function PlayerDetailModal({ standing, allMatches, playerMap, onClose }: PlayerDetailModalProps) {
  const [tab, setTab] = useState<Tab>('fixtures')
  const { player } = standing

  const playerMatches = allMatches.filter(
    (m) => (m.player_a === player.id || m.player_b === player.id) &&
      (m.status === 'played' || m.status === 'walkover'),
  )

  // Stats
  const cleanSheets = playerMatches.filter((m) => {
    if (m.status === 'walkover') return m.walkover_winner === player.id
    const conceded = m.player_a === player.id ? m.score_b : m.score_a
    return conceded === 0
  }).length

  const playedMatches = playerMatches.filter((m) => m.status === 'played')
  const margins = playedMatches.map((m) => {
    const scored   = m.player_a === player.id ? (m.score_a ?? 0) : (m.score_b ?? 0)
    const conceded = m.player_a === player.id ? (m.score_b ?? 0) : (m.score_a ?? 0)
    return scored - conceded
  })
  const biggestWin  = margins.length > 0 ? Math.max(...margins) : null
  const biggestLoss = margins.length > 0 ? Math.min(...margins) : null

  return (
    <Modal open onClose={onClose} title={player.name}>
      <div className="flex flex-col gap-4 -mx-5 -mb-4">
        {/* Header */}
        <div className="flex items-center gap-4 px-5 pb-4 border-b border-border">
          <PlayerAvatar player={player} size="xl" showRing />
          <div>
            <p className="text-base font-bold text-text">{player.name}</p>
            <p className="text-sm text-text-muted">#{standing.position} · {standing.points} pts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5">
          {(['fixtures', 'stats'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
                tab === t ? 'bg-accent text-accent-fg' : 'text-text-muted hover:bg-surface-raised',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-5 pb-5 flex flex-col gap-2 max-h-80 overflow-y-auto">
          {tab === 'fixtures' && (
            playerMatches.length === 0
              ? <p className="text-sm text-text-faint text-center py-6">No results yet</p>
              : playerMatches.map((m) => {
                  const pA = playerMap.get(m.player_a)
                  const pB = playerMap.get(m.player_b)
                  if (!pA || !pB) return null
                  return <FixtureCard key={m.id} match={m} playerA={pA} playerB={pB} compact />
                })
          )}

          {tab === 'stats' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Goals For',    value: standing.goals_for        },
                { label: 'Goals Against', value: standing.goals_against    },
                { label: 'Goal Diff',    value: standing.goal_difference > 0 ? `+${standing.goal_difference}` : standing.goal_difference },
                { label: 'Clean Sheets', value: cleanSheets                },
                { label: 'Biggest Win',  value: biggestWin != null ? `+${biggestWin}` : '—' },
                { label: 'Biggest Loss', value: biggestLoss != null && biggestLoss < 0 ? biggestLoss : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-raised rounded-lg px-3 py-3">
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="text-lg font-bold text-text tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
