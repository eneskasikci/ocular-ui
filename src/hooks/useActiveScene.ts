import { useSyncExternalStore } from 'react'
import { SCENES } from '../config'

let activeScene = 0
const noopSubscribe = () => () => {}
const getActiveScene = () => activeScene
const getServerSnapshot = () => 0

function subscribeActiveScene(onStoreChange: () => void): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const i = SCENES.findIndex((s) => s.id === e.target.id)
          if (i >= 0 && i !== activeScene) {
            activeScene = i
            onStoreChange()
          }
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
}

/** Index of the scene crossing the middle of the viewport. */
export function useActiveScene(enabled: boolean): number {
  return useSyncExternalStore(
    enabled ? subscribeActiveScene : noopSubscribe,
    getActiveScene,
    getServerSnapshot,
  )
}
