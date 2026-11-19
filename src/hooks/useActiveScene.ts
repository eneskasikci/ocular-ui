import { useEffect, useState } from 'react'
import { SCENES } from '../config'

/** Index of the scene crossing the middle of the viewport. */
export function useActiveScene(resetKey?: unknown): number {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = SCENES.findIndex((s) => s.id === e.target.id)
            if (i >= 0) setActive(i)
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    for (const s of SCENES) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [resetKey])
  return active
}
