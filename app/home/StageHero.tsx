import type { KnockoutBracket, Standing, TournamentStage } from '@/types'
import { BracketNode } from '@/components/BracketNode'

interface StageHeroProps {
  stage: TournamentStage
  matchdayNumber: number
  standings: Standing[]
  bracket: KnockoutBracket | null
  isAdmin: boolean
}

export function StageHero({ stage, matchdayNumber, standings, bracket, isAdmin }: StageHeroProps) {
  if (stage === 'setup') {
    return (
      <div className="bg-surface border border-border rounded-card px-5 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-text-faint uppercase tracking-wider">Status</p>
          <p className="text-base font-bold text-text mt-0.5">Tournament Setup in Progress</p>
        </div>
        {isAdmin && (
          <a
            href="/admin/dashboard"
            className="text-xs font-medium text-accent hover:underline shrink-0"
          >
            Go to admin →
          </a>
        )}
      </div>
    )
  }

  if (stage === 'league') {
    return (
      <div className="bg-surface border border-border rounded-card px-5 py-5">
        <p className="text-xs font-semibold text-text-faint uppercase tracking-wider">League Phase</p>
        <p className="text-lg font-bold text-text mt-0.5">Matchday {matchdayNumber}</p>
        <div className="flex items-center gap-3 mt-3">
          {standings.slice(0, 3).map((s, i) => (
            <div key={s.player.id} className="flex items-center gap-1.5">
              <span className="text-xs text-text-faint">{i + 1}.</span>
              <div
                className="size-4 rounded-full shrink-0"
                style={{ backgroundColor: s.player.primary_color }}
                title={s.player.name}
              />
              <span className="text-xs font-medium text-text-muted">{s.points}pts</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (stage === 'knockouts' && bracket) {
    return (
      <div className="bg-surface border border-border rounded-card px-5 py-5 flex flex-col gap-3">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider">Knockout Stage</p>
        <div className="flex flex-col gap-2">
          <BracketNode
            home={bracket.sf1.home}
            away={bracket.sf1.away}
            match={bracket.sf1.match}
            label="SF 1"
            compact
          />
          <BracketNode
            home={bracket.sf2.home}
            away={bracket.sf2.away}
            match={bracket.sf2.match}
            label="SF 2"
            compact
          />
        </div>
      </div>
    )
  }

  if (stage === 'completed' && bracket?.champion) {
    return (
      <div className="bg-accent/10 border border-accent/30 rounded-card px-5 py-5 flex items-center gap-4">
        <span className="text-4xl">🏆</span>
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">Tournament Champion</p>
          <p className="text-xl font-bold text-text mt-0.5">{bracket.champion.name}</p>
          {bracket.runner_up && (
            <p className="text-xs text-text-muted mt-0.5">Runner-up: {bracket.runner_up.name}</p>
          )}
        </div>
      </div>
    )
  }

  return null
}
