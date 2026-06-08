'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Match, Player } from '@/types'
import { enterScore, revertWalkoverToScore } from '@/actions/matches'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/FormError'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'

interface ScoreEntryModalProps {
  match: Match & { player_a_data: Player; player_b_data: Player }
  onClose: () => void
}

export function ScoreEntryModal({ match, onClose }: ScoreEntryModalProps) {
  const router = useRouter()
  const isRevert = match.status === 'walkover'
  const action   = isRevert ? revertWalkoverToScore : enterScore

  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state !== null && !state?.error) {
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  const isKnockout = match.stage !== 'league'
  const title = match.status === 'pending'   ? 'Enter Score'
    : match.status === 'walkover' ? 'Enter Actual Score'
    : 'Edit Score'

  const defaultA = match.status === 'played' ? (match.score_a ?? '') : ''
  const defaultB = match.status === 'played' ? (match.score_b ?? '') : ''

  return (
    <Modal open onClose={onClose} title={title}>
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={match.id} />

        <div className="flex items-center justify-between gap-4">
          {/* Player A */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <PlayerAvatar player={match.player_a_data} size="md" showRing />
            <span className="text-xs text-text-muted text-center leading-tight">{match.player_a_data.name}</span>
            <input
              type="number"
              name="score_a"
              min={0}
              max={20}
              defaultValue={String(defaultA)}
              required
              className="w-16 text-center text-xl font-bold bg-surface-raised border border-border rounded-lg px-2 py-2 text-text focus:outline-none focus:border-accent tabular-nums"
              aria-label={`Score for ${match.player_a_data.name}`}
            />
          </div>

          <span className="text-text-faint font-medium text-sm shrink-0">vs</span>

          {/* Player B */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <PlayerAvatar player={match.player_b_data} size="md" showRing />
            <span className="text-xs text-text-muted text-center leading-tight">{match.player_b_data.name}</span>
            <input
              type="number"
              name="score_b"
              min={0}
              max={20}
              defaultValue={String(defaultB)}
              required
              className="w-16 text-center text-xl font-bold bg-surface-raised border border-border rounded-lg px-2 py-2 text-text focus:outline-none focus:border-accent tabular-nums"
              aria-label={`Score for ${match.player_b_data.name}`}
            />
          </div>
        </div>

        {isKnockout && (
          <p className="text-xs text-text-muted text-center">
            Knockout stage — draws not allowed
          </p>
        )}

        {state?.error && <FormError message={state.error} />}

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isPending} className="flex-1">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}
