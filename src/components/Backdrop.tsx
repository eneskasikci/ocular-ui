import { useEffect, useState, type CSSProperties } from 'react'
import type { BackdropId } from '../config'
import { BASE, BLOBS } from '../data/gradients'
import { cn } from '../lib/cn'

const IDS = Object.keys(BASE) as BackdropId[]

/** Fixed full-bleed gradient canvas. Layers crossfade purely on GPU opacity. */
export function Backdrop({ active, still = false }: { active: BackdropId; still?: boolean }) {
  // Blobs mount only for the active layer and, during the crossfade, the one fading out.
  const [prev, setPrev] = useState<BackdropId | null>(null)
  const [last, setLast] = useState(active)
  if (last !== active) {
    setPrev(last)
    setLast(active)
  }
  useEffect(() => {
    if (!prev) return
    const t = setTimeout(() => setPrev(null), 950)
    return () => clearTimeout(t)
  }, [prev])

  return (
    <>
      <div
        className="fixed inset-0 -z-3 bg-obsidian overflow-hidden [contain:strict]"
        aria-hidden="true"
      >
        <div className="canvas__inner absolute inset-x-0 top-0 -bottom-[10vh]">
          {IDS.map((id) => (
            <div
              key={id}
              className={cn(
                'backdrop-layer absolute inset-0 overflow-hidden [contain:strict] transition-opacity duration-900 ease-ocular motion-reduce:transition-none',
                id === active ? 'opacity-100' : 'opacity-0',
                (id === active || id === prev) && 'is-active',
                still && 'is-still',
              )}
              style={{ background: BASE[id] }}
            >
              {(id === active || id === prev) && (
                // One drifting layer per scene: blobs paint into one texture instead of 3-4 oversized layers.
                <div className="backdrop-drift absolute inset-0">
                  {BLOBS[id].map((b, i) => (
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
              )}
            </div>
          ))}
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
