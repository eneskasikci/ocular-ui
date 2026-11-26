import type { CSSProperties } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { BackdropId } from '../config'
import { BASE, BLOBS } from '../data/gradients'
import { cn } from '../lib/cn'
import { EASE_OCULAR } from '../lib/motion'

/** Fixed full-bleed gradient canvas. Layers crossfade purely on GPU opacity. */
export function Backdrop({ active, still = false }: { active: BackdropId; still?: boolean }) {
  return (
    <>
      <div
        className="fixed inset-0 -z-3 bg-obsidian overflow-hidden [contain:strict]"
        aria-hidden="true"
      >
        <div className="canvas__inner absolute inset-x-0 top-0 -bottom-[10vh]">
          <AnimatePresence initial={false}>
            <m.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE_OCULAR }}
              className={cn(
                'backdrop-layer is-active absolute inset-0 overflow-hidden [contain:strict]',
                still && 'is-still',
              )}
              style={{ background: BASE[active] }}
            >
              {/* One drifting layer per scene: blobs paint into one texture instead of 3-4 oversized layers. */}
              <div className="backdrop-drift absolute inset-0">
                {BLOBS[active].map((b, i) => (
                  <div
                    key={i}
                    className={cn('backdrop-blob', b.ember && 'backdrop-blob--ember')}
                    style={{ '--x': b.x, '--y': b.y, '--w': b.w } as CSSProperties}
                  >
                    <div
                      className="backdrop-blob-shape"
                      style={
                        {
                          background: b.fill,
                          '--r': b.r ?? '0deg',
                          '--sx': b.sx ?? 1,
                          '--sy': b.sy ?? 1,
                        } as CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
      <div
        className="fixed inset-0 -z-2 pointer-events-none bg-[linear-gradient(180deg,rgba(11,12,14,.42),rgba(11,12,14,.3)_45%,rgba(11,12,14,.55))]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 -z-1 pointer-events-none opacity-[0.045] bg-grain-backdrop"
        aria-hidden="true"
      />
    </>
  )
}
