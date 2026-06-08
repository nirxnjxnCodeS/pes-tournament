'use client'

import { useState } from 'react'
import type { Match, Player, Standing } from '@/types'
import { useRealtimeMatches } from '@/hooks/useRealtimeMatches'
import { TableRow } from './TableRow'
import { PlayerDetailModal } from './PlayerDetailModal'

interface LeagueTableProps {
  standings: Standing[]
  allMatches: Match[]
}

export function LeagueTable({ standings, allMatches }: LeagueTableProps) {
  useRealtimeMatches('table-realtime')
  const [selected, setSelected] = useState<Standing | null>(null)

  const playerMap = new Map<string, Player>(
    standings.map((s) => [s.player.id, s.player]),
  )

  // Also add players from matches not yet in standings
  allMatches.forEach((m) => {
    if (m.player_a_data && !playerMap.has(m.player_a)) playerMap.set(m.player_a, m.player_a_data)
    if (m.player_b_data && !playerMap.has(m.player_b)) playerMap.set(m.player_b, m.player_b_data)
  })

  if (standings.length === 0) {
    return <p className="text-sm text-text-faint text-center py-12">No players yet</p>
  }

  const firstNonQualifiedPos = standings.find((s) => !s.qualified)?.position

  return (
    <>
      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-raised border-b border-border text-[11px] font-semibold text-text-faint uppercase tracking-wide">
              <th className="w-1" />
              <th className="pr-3 py-2.5 text-right w-7">#</th>
              <th className="py-2.5 pr-4 text-left">Player</th>
              {['P','W','D','L','GF','GA','GD','PTS'].map((h) => (
                <th key={h} className="py-2.5 px-2 text-right w-8 tabular-nums">{h}</th>
              ))}
              <th className="py-2.5 pl-2 pr-4 text-left">Form</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <TableRow
                key={s.player.id}
                standing={s}
                isFirstNonQualified={s.position === firstNonQualifiedPos}
                onClick={() => setSelected(s)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-faint px-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-[3px] h-4 bg-accent rounded-full" />
          Knockout qualified
        </span>
        <span className="flex items-center gap-1.5">
          ⚠️ Tiebreak required
        </span>
      </div>

      {selected && (
        <PlayerDetailModal
          standing={selected}
          allMatches={allMatches}
          playerMap={playerMap}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
