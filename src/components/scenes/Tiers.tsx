import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { cn } from '../../lib/cn'
import { EASE_BUTTER } from '../../lib/motion'
import { Reveal } from '../Reveal'

export type TiersStageState = 'before' | 'active' | 'after'

interface TiersStageProps {
  headingId: string
  stage?: TiersStageState
}

/** Enter/exit poses for one element of the deck stage; `before`/`after` are offsets on `axis`. */
function stageVariants(
  axis: 'x' | 'y',
  before: number,
  after: number,
  enter: { duration: number; delay: number },
  exitDuration: number,
): Variants {
  const at = (v: number) => (axis === 'x' ? { x: v } : { y: v })
  const exit = { duration: exitDuration, ease: EASE_BUTTER }
  return {
    before: { opacity: 0, ...at(before), transition: exit },
    active: { opacity: 1, ...at(0), transition: { ...enter, ease: EASE_BUTTER } },
    after: { opacity: 0, ...at(after), transition: exit },
  }
}

const HEADING_VARIANTS = stageVariants('y', -18, -32, { duration: 0.72, delay: 0.16 }, 0.52)
const TRIAL_VARIANTS = stageVariants('y', 18, 32, { duration: 0.72, delay: 0.22 }, 0.52)

const CARD_CLS =
  'px-5 py-[18px] rounded-[24px] border shadow-[0_24px_60px_rgba(0,0,0,.48),inset_0_1px_0_rgba(243,241,236,.08)] reduced-transparency:bg-graphite reduced-transparency:bg-none'
const LIST_CLS =
  'list-none m-0 p-0 [&_li]:flex [&_li]:items-baseline [&_li]:justify-between [&_li]:gap-4 [&_li]:py-[9px] [&_li]:border-t [&_li]:border-hair [&_li]:text-[0.93rem] [&_span]:text-ink-muted [&_b]:font-mono [&_b]:font-bold [&_b]:text-[0.8rem] [&_b]:leading-[1.2] [&_b]:text-right'

const TIERS = [
  {
    name: 'Ocular',
    badge: 'FREE',
    cardCls: 'bg-[linear-gradient(180deg,rgba(22,24,30,.95),rgba(11,12,14,.98))] border-hair',
    badgeCls: 'border-hair text-ink-subtle',
    valueCls: '[&_b]:text-silver',
    variants: stageVariants('x', -110, -640, { duration: 0.82, delay: 0.14 }, 0.78),
    rows: [
      ['Film stocks', '3 (STD, CC, AC)'],
      ['Manual dials & primes', 'Full'],
      ['Output', 'Full resolution'],
      ['RAW & optics', '—'],
      ['Custom slots', '1 (C1)'],
    ],
  },
  {
    name: 'Ocular Pro',
    badge: 'PRO',
    cardCls:
      'bg-[radial-gradient(120%_90%_at_100%_0,rgba(122,28,46,.42),rgba(20,22,27,.96)_65%,rgba(11,12,14,.98)_100%)] border-amber/52',
    badgeCls: 'border-amber/55 text-amber',
    valueCls: '[&_b]:text-emerald-ink',
    variants: stageVariants('x', 110, 640, { duration: 0.82, delay: 0.14 }, 0.78),
    rows: [
      ['Film stocks', 'All 12'],
      ['RAW capture', '14-bit & ProRAW'],
      ['RAW darkroom', 'Re-develop any shot'],
      ['Optics & framing', 'Halation · XPan 65:24'],
      ['Custom slots', '7 (C1–C7)'],
    ],
  },
] as const

export function TiersStage({ headingId, stage }: TiersStageProps) {
  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-4">
      <m.div className="pool-scrim" variants={HEADING_VARIANTS} initial={false} animate={stage}>
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
        {TIERS.map((tier) => (
          <m.article
            key={tier.name}
            className={cn(CARD_CLS, tier.cardCls)}
            variants={tier.variants}
            initial={false}
            animate={stage}
          >
            <header className="flex items-center justify-between gap-3 mb-2.5">
              <h3 className="font-display font-bold text-[1.32rem] leading-[1.1]">{tier.name}</h3>
              <span
                className={cn(
                  'inline-flex items-center min-h-[26px] px-2.5 rounded-full border font-mono font-bold text-[0.72rem] leading-none tracking-[0.1em]',
                  tier.badgeCls,
                )}
              >
                {tier.badge}
              </span>
            </header>
            <ul className={cn(LIST_CLS, tier.valueCls)}>
              {tier.rows.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </li>
              ))}
            </ul>
          </m.article>
        ))}
      </div>

      <m.div
        className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3"
        variants={TRIAL_VARIANTS}
        initial={false}
        animate={stage}
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
