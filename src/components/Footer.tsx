import { EULA_URL, SUPPORT_EMAIL } from '../config'
import { AppLink } from './AppLink'

export function Footer() {
  return (
    <footer className="site-footer relative z-2 bg-deep/92 border-t border-hair text-ink-subtle text-[0.88rem]">
      <div className="max-w-[1180px] mx-auto px-[var(--gutter)] pt-6 pb-7 flex flex-col gap-3.5 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-col gap-1">
          <span>Ocular for iPhone &amp; iPad</span>
          <small className="text-[0.78rem] leading-[1.45]">
            Apple, iPhone, iPad and App Store are trademarks of Apple Inc.
          </small>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-5 gap-y-0 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-[44px] [&_a]:text-ink-muted [&_a]:[overflow-wrap:anywhere] [&_a:hover]:text-ink"
        >
          <AppLink href="/privacy">Privacy Policy</AppLink>
          <AppLink href="/support">Support</AppLink>
          <a href={EULA_URL} rel="noopener noreferrer">
            Terms of Use (EULA)
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  )
}
