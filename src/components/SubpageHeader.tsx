import { AppLink } from './AppLink'
import { MeniscusMark } from './MeniscusMark'

export function SubpageHeader({ active }: { active: 'privacy' | 'support' }) {
  const linkCls =
    'inline-flex items-center min-h-[44px] px-2 sm:px-3.5 font-mono font-bold text-[0.72rem] sm:text-[0.76rem] leading-none tracking-[0.06em] sm:tracking-[0.08em] uppercase text-ink-muted no-underline whitespace-nowrap transition-colors duration-180 ease-ocular motion-reduce:transition-none hover:text-silver aria-[current=page]:text-silver aria-[current=page]:shadow-[inset_0_-2px_0_var(--color-amber)]'

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-auto min-h-[var(--header)] flex xs:grid xs:grid-cols-[1fr_auto_1fr] flex-wrap sm:flex-nowrap items-center justify-between gap-x-2.5 gap-y-0 xs:gap-3.5 px-[var(--gutter)] py-1 sm:py-0 sm:h-[var(--header)] bg-[linear-gradient(180deg,rgba(11,12,14,.96),rgba(11,12,14,.84)_76%,rgba(11,12,14,0))] reduced-transparency:bg-deep reduced-transparency:bg-none">
      <AppLink
        className="inline-flex items-center gap-2 min-h-[44px] text-ink no-underline shrink-0 xs:justify-self-start"
        href="/"
        aria-label="Ocular, overview"
      >
        <MeniscusMark className="w-6 h-6" />
        <span className="font-wordmark font-bold text-[0.94rem] xs:text-[1.05rem] leading-none tracking-[0.1em]">
          OCULAR
        </span>
      </AppLink>
      <nav className="flex flex-wrap items-center gap-0.5 -mx-2 sm:-mx-3.5" aria-label="Primary navigation">
        <AppLink className={linkCls} href="/">
          Overview
        </AppLink>
        <AppLink
          className={linkCls}
          href="/privacy"
          aria-current={active === 'privacy' ? 'page' : undefined}
        >
          Privacy
        </AppLink>
        <AppLink
          className={linkCls}
          href="/support"
          aria-current={active === 'support' ? 'page' : undefined}
        >
          Support
        </AppLink>
      </nav>
    </header>
  )
}
