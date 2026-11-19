import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { EASE_OCULAR } from '../lib/motion'

/** Enter reveal: opacity + 20px rise, once. Rendered static under reduced motion. */
export function Reveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <div>{children}</div>

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE_OCULAR }}
    >
      {children}
    </m.div>
  )
}
