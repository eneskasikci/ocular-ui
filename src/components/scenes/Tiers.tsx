import { memo } from 'react'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { GetItButton } from '../GetItButton'
import { Reveal } from '../Reveal'

interface TiersStageProps {
  headingId: string
}

const CARD_CLS =
  'px-5 py-[18px] rounded-[24px] border shadow-[0_24px_60px_rgba(0,0,0,.48),inset_0_1px_0_rgba(243,241,236,.08)] reduced-transparency:bg-graphite reduced-transparency:bg-none'
const LIST_CLS =
  'list-none m-0 p-0 [&_li]:flex [&_li]:items-baseline [&_li]:justify-between [&_li]:gap-4 [&_li]:py-[9px] [&_li]:border-t [&_li]:border-hair [&_li]:text-[0.93rem] [&_span]:text-ink-muted [&_b]:font-mono [&_b]:font-bold [&_b]:text-[0.8rem] [&_b]:leading-[1.2] [&_b]:text-right'

export const TiersStage = memo(function TiersStage({ headingId }: TiersStageProps) {
  const { t } = useI18n()

  const tiers = [
    {
      name: 'Ocular',
      badge: t.tiers.freeBadge,
      cardCls: 'bg-[linear-gradient(180deg,rgba(22,24,30,.95),rgba(11,12,14,.98))] border-hair',
      badgeCls: 'border-hair text-ink-subtle',
      valueCls: '[&_b]:text-silver',
      rows: t.tiers.freeRows,
    },
    {
      name: 'Ocular Pro',
      badge: t.tiers.proBadge,
      cardCls:
        'bg-[radial-gradient(120%_90%_at_100%_0,rgba(122,28,46,.42),rgba(20,22,27,.96)_65%,rgba(11,12,14,.98)_100%)] border-amber/52',
      badgeCls: 'border-amber/55 text-amber',
      valueCls: '[&_b]:text-emerald-ink',
      rows: t.tiers.proRows,
    },
  ] as const

  return (
    <div className="w-full max-w-[960px] flex flex-col gap-4">
      <div className="pool-scrim">
        <h2
          id={headingId}
          className="font-display font-bold text-[clamp(1.7rem,4.2vw,2.75rem)] leading-[1.03] tracking-[-0.025em] max-w-[22ch] [overflow-wrap:break-word]"
        >
          {t.tiers.heading}
        </h2>
        <p className="text-[clamp(1rem,2.1vw,1.1rem)] leading-[1.5] text-ink-muted max-w-[36ch] mt-2.5 mb-0 tracking-[-0.01em]">
          {t.tiers.lede}
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
        {tiers.map((tier) => (
          <article key={tier.name} className={cn(CARD_CLS, tier.cardCls)}>
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
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex-1 basis-[320px] flex flex-wrap items-center gap-x-3.5 gap-y-2 px-[18px] py-[13px] rounded-2xl bg-[#0a2e24]/92 border border-emerald/58 text-ink text-[0.93rem]">
          <b className="font-mono font-bold text-[0.75rem] leading-none tracking-[0.12em] text-emerald-ink whitespace-nowrap">
            {t.tiers.trialBadge}
          </b>
          <span>{t.tiers.trialCopy}</span>
        </div>
        <GetItButton className="shrink-0 w-full xs:w-auto" />
      </div>

      <a
        className="self-start inline-flex items-center gap-1.5 min-h-[36px] text-[0.9rem] font-semibold"
        href="/support/#faq-heading"
      >
        <span>{t.tiers.readFaq}</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>
  )
})

export function Tiers() {
  return (
    <section className="max-w-[1100px] mx-auto px-[var(--gutter)] py-[72px] flex flex-col justify-center gap-5" id="tiers" aria-labelledby="h-tiers">
      <Reveal>
        <TiersStage headingId="h-tiers" />
      </Reveal>
    </section>
  )
}
