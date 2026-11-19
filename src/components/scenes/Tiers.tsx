import * as m from 'motion/react-m'
import { EASE_BUTTER } from '../../lib/motion'
import { Reveal } from '../Reveal'

export type TiersStageState = 'before' | 'active' | 'after'

interface TiersStageProps {
  headingId: string
  stage?: TiersStageState
}

export function TiersStage({ headingId, stage }: TiersStageProps) {
  const animated = stage !== undefined

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-4">
      <m.div
        className="pool-scrim"
        initial={false}
        animate={
          animated
            ? stage === 'active'
              ? { opacity: 1, y: 0 }
              : stage === 'after'
                ? { opacity: 0, y: -32 }
                : { opacity: 0, y: -18 }
            : undefined
        }
        transition={
          animated
            ? stage === 'active'
              ? { duration: 0.72, delay: 0.16, ease: EASE_BUTTER }
              : { duration: 0.52, ease: EASE_BUTTER }
            : undefined
        }
      >
        <h2
          id={headingId}
          className="font-display font-bold text-[clamp(1.85rem,5.5vw,3.15rem)] leading-[1.03] tracking-[-0.025em] max-w-[22ch] [overflow-wrap:break-word]"
        >
          Start free. Go Pro anytime.
        </h2>
        <p className="text-[clamp(1rem,2.1vw,1.1rem)] leading-[1.5] text-ink-muted max-w-[36ch] mt-2.5 mb-0 tracking-[-0.01em]">
          No account required. Prices show in the app.
        </p>
      </m.div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        <m.article
          className="px-5 py-[18px] rounded-[24px] bg-[linear-gradient(180deg,rgba(22,24,30,.95),rgba(11,12,14,.98))] border border-hair shadow-[0_24px_60px_rgba(0,0,0,.48),inset_0_1px_0_rgba(243,241,236,.08)] reduced-transparency:bg-graphite reduced-transparency:bg-none"
          initial={false}
          animate={
            animated
              ? stage === 'active'
                ? { x: 0, opacity: 1 }
                : stage === 'after'
                  ? { x: -640, opacity: 0 }
                  : { x: -110, opacity: 0 }
              : undefined
          }
          transition={
            animated
              ? stage === 'active'
                ? { duration: 0.82, delay: 0.14, ease: EASE_BUTTER }
                : { duration: 0.78, ease: EASE_BUTTER }
              : undefined
          }
        >
          <header className="flex items-center justify-between gap-3 mb-2.5">
            <h3 className="font-display font-bold text-[1.32rem] leading-[1.1]">Ocular</h3>
            <span className="inline-flex items-center min-h-[26px] px-2.5 rounded-full border border-hair font-mono font-bold text-[0.72rem] leading-none tracking-[0.1em] text-ink-subtle">
              FREE
            </span>
          </header>
          <ul className="list-none m-0 p-0 [&_li]:flex [&_li]:items-baseline [&_li]:justify-between [&_li]:gap-4 [&_li]:py-[9px] [&_li]:border-t [&_li]:border-hair [&_li]:text-[0.93rem] [&_span]:text-ink-muted [&_b]:font-mono [&_b]:font-bold [&_b]:text-[0.8rem] [&_b]:leading-[1.2] [&_b]:text-silver [&_b]:text-right">
            <li><span>Film stocks</span><b>3 (STD, CC, AC)</b></li>
            <li><span>Manual dials &amp; primes</span><b>Full</b></li>
            <li><span>Output</span><b>Full resolution</b></li>
            <li><span>RAW &amp; optics</span><b>—</b></li>
            <li><span>Custom slots</span><b>1 (C1)</b></li>
          </ul>
        </m.article>

        <m.article
          className="px-5 py-[18px] rounded-[24px] bg-[radial-gradient(120%_90%_at_100%_0,rgba(122,28,46,.42),rgba(20,22,27,.96)_65%,rgba(11,12,14,.98)_100%)] border border-amber/52 shadow-[0_24px_60px_rgba(0,0,0,.48),inset_0_1px_0_rgba(243,241,236,.08)] reduced-transparency:bg-graphite reduced-transparency:bg-none"
          initial={false}
          animate={
            animated
              ? stage === 'active'
                ? { x: 0, opacity: 1 }
                : stage === 'after'
                  ? { x: 640, opacity: 0 }
                  : { x: 110, opacity: 0 }
              : undefined
          }
          transition={
            animated
              ? stage === 'active'
                ? { duration: 0.82, delay: 0.14, ease: EASE_BUTTER }
                : { duration: 0.78, ease: EASE_BUTTER }
              : undefined
          }
        >
          <header className="flex items-center justify-between gap-3 mb-2.5">
            <h3 className="font-display font-bold text-[1.32rem] leading-[1.1]">Ocular Pro</h3>
            <span className="inline-flex items-center min-h-[26px] px-2.5 rounded-full border border-amber/55 font-mono font-bold text-[0.72rem] leading-none tracking-[0.1em] text-amber">
              PRO
            </span>
          </header>
          <ul className="list-none m-0 p-0 [&_li]:flex [&_li]:items-baseline [&_li]:justify-between [&_li]:gap-4 [&_li]:py-[9px] [&_li]:border-t [&_li]:border-hair [&_li]:text-[0.93rem] [&_span]:text-ink-muted [&_b]:font-mono [&_b]:font-bold [&_b]:text-[0.8rem] [&_b]:leading-[1.2] [&_b]:text-emerald-ink [&_b]:text-right">
            <li><span>Film stocks</span><b>All 12</b></li>
            <li><span>RAW capture</span><b>14-bit &amp; ProRAW</b></li>
            <li><span>RAW darkroom</span><b>Re-develop any shot</b></li>
            <li><span>Optics &amp; framing</span><b>Halation · XPan 65:24</b></li>
            <li><span>Custom slots</span><b>7 (C1–C7)</b></li>
          </ul>
        </m.article>
      </div>

      <m.div
        className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3"
        initial={false}
        animate={
          animated
            ? stage === 'active'
              ? { opacity: 1, y: 0 }
              : stage === 'after'
                ? { opacity: 0, y: 32 }
                : { opacity: 0, y: 18 }
            : undefined
        }
        transition={
          animated
            ? stage === 'active'
              ? { duration: 0.72, delay: 0.22, ease: EASE_BUTTER }
              : { duration: 0.52, ease: EASE_BUTTER }
            : undefined
        }
      >
        <div className="flex-1 basis-[320px] flex flex-wrap items-center gap-x-3.5 gap-y-2 px-[18px] py-[13px] rounded-2xl bg-[#0a2e24]/92 border border-emerald/58 text-ink text-[0.93rem]">
          <b className="font-mono font-bold text-[0.75rem] leading-none tracking-[0.12em] text-emerald-ink whitespace-nowrap">
            3-DAY FREE TRIAL
          </b>
          <span>Monthly, annual, or Lifetime. Saved recipes stay on your device.</span>
        </div>
      </m.div>
    </div>
  )
}

export function Tiers() {
  return (
    <section className="max-w-[1100px] mx-auto px-[var(--gutter)] py-[72px] flex flex-col justify-center gap-5" id="tiers" aria-labelledby="h-tiers">
      <Reveal>
        <TiersStage headingId="h-tiers" />
      </Reveal>
    </section>
  )
}
