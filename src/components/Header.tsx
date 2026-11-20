import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { SCENES } from '../config'
import { EASE_OCULAR } from '../lib/motion'
import { GetItButton } from './GetItButton'
import { MeniscusMark } from './MeniscusMark'

interface Props {
  active: number
  onGoTop?: () => void
}

export function Header({ active, onGoTop }: Props) {
  const scene = SCENES[active]
  const showHeaderCta = active > 0

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header)] flex xs:grid xs:grid-cols-[1fr_auto_1fr] items-center justify-between gap-2.5 xs:gap-3.5 px-[var(--gutter)] bg-[linear-gradient(180deg,rgba(11,12,14,.94),rgba(11,12,14,.72)_68%,rgba(11,12,14,0))] reduced-transparency:bg-deep reduced-transparency:bg-none">
      <a
        className="brand inline-flex items-center gap-2 min-h-[44px] text-ink no-underline shrink-0 xs:justify-self-start"
        href="#top"
        aria-label="Ocular, back to top"
        onClick={(e) => {
          if (!onGoTop) return
          e.preventDefault()
          onGoTop()
        }}
      >
        <MeniscusMark className="w-6 h-6" />
        <span className="font-wordmark font-bold text-[0.92rem] xs:text-[1.05rem] leading-none tracking-[0.1em]">
          OCULAR
        </span>
      </a>

      <div className="flex items-center justify-center min-w-0 xs:justify-self-center">
        <AnimatePresence>
          {showHeaderCta && (
            <m.div
              key="header-cta"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OCULAR }}
            >
              <GetItButton
                variant="compact"
                className="min-h-[38px] px-3 text-[0.82rem] gap-1.5 xs:min-h-10 xs:px-4 xs:text-[0.88rem] xs:gap-2"
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden xs:flex xs:justify-self-end items-center justify-end gap-4 min-w-0">
        <span
          className="counter hidden xs:inline font-mono font-bold text-[0.76rem] tracking-[0.14em] tabular-nums text-ink-muted whitespace-nowrap"
          aria-hidden="true"
        >
          {String(active + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
          <span className="hidden deck:inline"> · {scene.label.toUpperCase()}</span>
        </span>
      </div>
    </header>
  )
}
