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

type Tab = 'fixtures' | 'stats' | 'h2h'

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

  // H2H records against all other players
  const opponents = Array.from(playerMap.values()).filter((p) => p.id !== player.id)
  const h2hRecords = opponents.map((opponent) => {
    const h2hMatches = allMatches.filter((m) =>
      ((m.player_a === player.id && m.player_b === opponent.id) ||
       (m.player_a === opponent.id && m.player_b === player.id)) &&
      (m.status === 'played' || m.status === 'walkover'),
    )

    let w = 0, d = 0, l = 0, gf = 0, ga = 0
    for (const m of h2hMatches) {
      if (m.status === 'walkover') {
        const won = m.walkover_winner === player.id
        if (won) { w++; gf += 3 } else { l++; ga += 3 }
      } else {
        const scored   = m.player_a === player.id ? (m.score_a ?? 0) : (m.score_b ?? 0)
        const conceded = m.player_a === player.id ? (m.score_b ?? 0) : (m.score_a ?? 0)
        gf += scored
        ga += conceded
        if (scored > conceded) w++
        else if (scored === conceded) d++
        else l++
      }
    }
    return { opponent, w, d, l, gf, ga, played: h2hMatches.length }
  }).sort((a, b) => {
    if (b.w !== a.w) return b.w - a.w
    return a.opponent.name.localeCompare(b.opponent.name)
  })

  const TAB_LABELS: { id: Tab; label: string }[] = [
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'stats',    label: 'Stats'    },
    { id: 'h2h',      label: 'H2H'      },
  ]

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
          {TAB_LABELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                tab === id ? 'bg-accent text-accent-fg' : 'text-text-muted hover:bg-surface-raised',
              ].join(' ')}
            >
              {label}
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

          {tab === 'h2h' && (
            <div className="flex flex-col">
              {h2hRecords.map(({ opponent, w, d, l, gf, ga, played: h2hPlayed }) => (
                <div
                  key={opponent.id}
                  className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <PlayerAvatar player={opponent} size="sm" />
                    <span className="text-sm text-text truncate">{opponent.name}</span>
                  </div>
                  {h2hPlayed === 0 ? (
                    <span className="text-xs text-text-faint shrink-0">Not played</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-xs tabular-nums font-medium shrink-0">
                        <span className="text-win">{w}W</span>
                        <span className="text-text-muted">{d}D</span>
                        <span className="text-loss">{l}L</span>
                      </div>
                      <span className="text-xs text-text-muted tabular-nums shrink-0">
                        {gf} – {ga}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
