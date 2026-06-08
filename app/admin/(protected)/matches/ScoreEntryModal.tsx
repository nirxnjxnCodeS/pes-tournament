'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
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
  const isRevert  = match.status === 'walkover'
  const isKnockout = match.stage !== 'league'
  const action     = isRevert ? revertWalkoverToScore : enterScore

  const [state, formAction, isPending] = useActionState(action, null)

  // Confirmation step state
  const [confirming, setConfirming] = useState(false)
  const [pendingA, setPendingA]     = useState<number | null>(null)
  const [pendingB, setPendingB]     = useState<number | null>(null)

  // Ref to the hidden form used to submit when confirmed
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state !== null && !state?.error) {
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  const title = match.status === 'pending'   ? 'Enter Score'
    : match.status === 'walkover' ? 'Enter Actual Score'
    : 'Edit Score'

  const defaultA = match.status === 'played' ? (match.score_a ?? '') : ''
  const defaultB = match.status === 'played' ? (match.score_b ?? '') : ''

  // Called when admin clicks Submit on the input screen
  function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const a = Number(fd.get('score_a'))
    const b = Number(fd.get('score_b'))
    setPendingA(a)
    setPendingB(b)
    setConfirming(true)
  }

  const isDraw = pendingA === pendingB
  const knockoutDrawError = isKnockout && isDraw && pendingA !== null

  // ── Input screen ────────────────────────────────────────────────────
  if (!confirming) {
    return (
      <Modal open onClose={onClose} title={title}>
        <form onSubmit={handleReview} className="flex flex-col gap-5">

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
                defaultValue={pendingA !== null ? String(pendingA) : String(defaultA)}
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
                defaultValue={pendingB !== null ? String(pendingB) : String(defaultB)}
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

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Review
            </Button>
          </div>
        </form>
      </Modal>
    )
  }

  // ── Confirmation screen ─────────────────────────────────────────────
  return (
    <Modal open onClose={onClose} title={title} persistent={isPending}>
      {/* Hidden form that actually submits to the server action */}
      <form ref={formRef} action={formAction} className="hidden" aria-hidden>
        <input type="hidden" name="id"      value={match.id} />
        <input type="hidden" name="score_a" value={String(pendingA ?? 0)} />
        <input type="hidden" name="score_b" value={String(pendingB ?? 0)} />
      </form>

      <div className="flex flex-col gap-6">
        {/* Score display */}
        <div className="flex items-center justify-between gap-3 bg-surface-raised rounded-card px-4 py-4">
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <PlayerAvatar player={match.player_a_data} size="md" showRing />
            <span className="text-xs text-text-muted text-center truncate w-full">{match.player_a_data.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-3xl font-bold text-accent tabular-nums">{pendingA}</span>
            <span className="text-lg text-text-faint">–</span>
            <span className="text-3xl font-bold text-accent tabular-nums">{pendingB}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <PlayerAvatar player={match.player_b_data} size="md" showRing />
            <span className="text-xs text-text-muted text-center truncate w-full">{match.player_b_data.name}</span>
          </div>
        </div>

        {knockoutDrawError && (
          <FormError message="Draws not allowed in knockout stage" />
        )}

        {state?.error && <FormError message={state.error} />}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="flex-1"
          >
            Go back
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={isPending}
            disabled={knockoutDrawError}
            onClick={() => formRef.current?.requestSubmit()}
            className="flex-1"
          >
            Confirm result
          </Button>
        </div>
      </div>
    </Modal>
  )
}
