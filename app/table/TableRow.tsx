'use client'

import type { Standing } from '@/types'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'
import { FormStrip } from '@/components/ui/FormDot'
import { Tooltip } from '@/components/ui/Tooltip'

interface TableRowProps {
  standing: Standing
  isFirstNonQualified: boolean
  onClick: () => void
}

export function TableRow({ standing: s, isFirstNonQualified, onClick }: TableRowProps) {
  const { player, position, qualified, tied } = s

  return (
    <tr
      onClick={onClick}
      className={[
        'border-b border-border-subtle cursor-pointer transition-colors hover:bg-surface-raised group',
        isFirstNonQualified ? 'border-t-2 border-t-dashed border-t-border' : '',
      ].join(' ')}
    >
      {/* Qualified accent border */}
      <td className="relative pl-0 pr-2 py-2.5 w-1">
        {qualified && (
          <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-r-full" />
        )}
      </td>

      {/* Pos */}
      <td className="pr-3 py-2.5 text-sm tabular-nums text-text-muted w-7 text-right">
        {position}
      </td>

      {/* Player */}
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-2 min-w-0">
          <PlayerAvatar player={player} size="sm" />
          <span className="text-sm font-medium text-text truncate">{player.name}</span>
          {tied && (
            <Tooltip content="Admin tiebreak required" side="top">
              <span className="text-xs cursor-help" aria-label="Tied">⚠️</span>
            </Tooltip>
          )}
        </div>
      </td>

      {/* Stats */}
      {[s.played, s.won, s.drawn, s.lost, s.goals_for, s.goals_against].map((val, i) => (
        <td key={i} className="py-2.5 px-2 text-sm tabular-nums text-text-muted text-right w-8">
          {val}
        </td>
      ))}

      {/* GD */}
      <td className="py-2.5 px-2 text-sm tabular-nums text-right w-10">
        <span className={s.goal_difference > 0 ? 'text-win' : s.goal_difference < 0 ? 'text-loss' : 'text-text-muted'}>
          {s.goal_difference > 0 ? `+${s.goal_difference}` : s.goal_difference}
        </span>
      </td>

      {/* PTS */}
      <td className="py-2.5 pl-2 pr-3 text-sm tabular-nums font-bold text-text text-right w-9">
        {s.points}
      </td>

      {/* Form */}
      <td className="py-2.5 pl-2 pr-4 w-20">
        <FormStrip form={s.form} />
      </td>
    </tr>
  )
}
