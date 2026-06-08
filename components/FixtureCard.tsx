import type { Match, Player } from '@/types'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'

interface FixtureCardProps {
  match: Match
  playerA: Player
  playerB: Player
  compact?: boolean
  onAdminClick?: () => void
}

export function FixtureCard({ match, playerA, playerB, compact = false, onAdminClick }: FixtureCardProps) {
  const isPlayed   = match.status === 'played'
  const isWalkover = match.status === 'walkover'
  const isPending  = match.status === 'pending'

  const winnerA = isPlayed && match.score_a != null && match.score_b != null && match.score_a > match.score_b
  const winnerB = isPlayed && match.score_a != null && match.score_b != null && match.score_b > match.score_a
  const walkoverWinnerA = isWalkover && match.walkover_winner === playerA.id
  const walkoverWinnerB = isWalkover && match.walkover_winner === playerB.id

  const px = compact ? 'px-3 py-2' : 'px-4 py-3'
  const avatarSize = compact ? 'sm' as const : 'md' as const

  return (
    <div className={`relative flex items-center gap-3 bg-surface border border-border rounded-card ${px} group`}>

      {/* Player A */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <PlayerAvatar player={playerA} size={avatarSize} />
        <span className={[
          'truncate text-sm font-medium',
          (winnerA || walkoverWinnerA) ? 'text-text' : isPending ? 'text-text-muted' : 'text-text-muted',
        ].join(' ')}>
          {playerA.name}
        </span>
      </div>

      {/* Score / vs */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 min-w-14">
        {isPending && (
          <span className="text-xs font-semibold text-text-faint tracking-widest">vs</span>
        )}
        {isPlayed && (
          <span className="text-sm font-bold text-text tabular-nums">
            {match.score_a} – {match.score_b}
          </span>
        )}
        {isWalkover && (
          <>
            <span className="text-sm font-bold text-text">W/O</span>
            <span className="text-[10px] font-medium text-walkover leading-none">walkover</span>
          </>
        )}
        {!compact && match.played_at && (
          <span className="text-[10px] text-text-faint mt-0.5">
            {new Date(match.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Player B */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={[
          'truncate text-sm font-medium text-right',
          (winnerB || walkoverWinnerB) ? 'text-text' : isPending ? 'text-text-muted' : 'text-text-muted',
        ].join(' ')}>
          {playerB.name}
        </span>
        <PlayerAvatar player={playerB} size={avatarSize} />
      </div>

      {/* Admin pencil FAB (per-card) */}
      {onAdminClick && (
        <button
          onClick={onAdminClick}
          className="absolute -right-2 -top-2 size-7 rounded-full bg-accent text-accent-fg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-card"
          aria-label="Edit score"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M8.5 1.5l2 2L3 11H1V9L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
