'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface CountUpProps {
  from: number
  to: number
  duration: number
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function CountUp({ from, to, duration }: CountUpProps) {
  const shouldReduceMotion = useReducedMotion()
  const [value, setValue] = useState(shouldReduceMotion ? to : from)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (shouldReduceMotion) {
      setValue(to)
      return
    }

    let startTime: number | null = null

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(from + (to - from) * easeOut(progress)))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to, duration, shouldReduceMotion])

  return <>{value}</>
}
