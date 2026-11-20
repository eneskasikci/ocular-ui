import { memo } from 'react'
import { GetItButton } from '../GetItButton'
import { MeniscusMark } from '../MeniscusMark'
import { Reveal } from '../Reveal'

const PRIVACY_CHIP_CLS =
  'inline-flex items-center min-h-[34px] px-3 rounded-full bg-[#0a2e24]/92 border border-emerald/60 font-mono font-bold text-[0.75rem] leading-none tracking-[0.06em] text-emerald-ink whitespace-nowrap reduced-transparency:bg-graphite'

export const PrivacyStage = memo(function PrivacyStage({ headingId }: { headingId: string }) {
  return (
    <div className="privacy-stage relative z-1 flex flex-col items-center text-center gap-[18px] max-w-[600px] px-6 py-8 rounded-[28px] bg-[radial-gradient(closest-side,rgba(11,12,14,.76),rgba(11,12,14,.38)_72%,rgba(11,12,14,0))]">
      <MeniscusMark className="w-14 h-14" />
      <h2
        id={headingId}
        className="font-display font-bold text-[clamp(1.85rem,5.5vw,3.15rem)] leading-[1.03] tracking-[-0.025em] max-w-[16ch] [overflow-wrap:break-word]"
      >
        Stays on your device.
      </h2>
      <p className="text-[clamp(1rem,2.1vw,1.1rem)] leading-[1.5] text-ink-muted max-w-[36ch] m-0 tracking-[-0.01em]">
        Zero tracking. Zero accounts. GPS only when you opt in.
      </p>

      <ul className="flex flex-wrap justify-center gap-2 list-none m-0 p-0" aria-label="Privacy guarantees">
        <li className={PRIVACY_CHIP_CLS}>ON-DEVICE</li>
        <li className={PRIVACY_CHIP_CLS}>NO ACCOUNTS</li>
        <li className={PRIVACY_CHIP_CLS}>NO TRACKING</li>
        <li className={PRIVACY_CHIP_CLS}>OPT-IN GPS</li>
      </ul>

      <GetItButton className="mt-2" />
      <p className="m-0 font-mono font-medium text-[0.78rem] leading-[1.5] tracking-[0.04em] text-ink-subtle">
        Free to start · 3-day Pro trial · iPhone and iPad
      </p>

      <a className="inline-flex items-center min-h-[44px] font-bold" href="/privacy">
        Read the privacy policy
      </a>
    </div>
  )
})

export function Privacy() {
  return (
    <section
      className="max-w-[1100px] mx-auto px-[var(--gutter)] py-[72px] min-h-[82svh] flex flex-col justify-center items-center text-center gap-5"
      id="privacy"
      aria-labelledby="h-privacy"
    >
      <Reveal>
        <PrivacyStage headingId="h-privacy" />
      </Reveal>
    </section>
  )
}
