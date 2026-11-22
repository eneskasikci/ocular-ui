import { memo } from 'react'
import { EULA_URL, SUPPORT_EMAIL } from '../config'
import { useI18n } from '../i18n'

export const Footer = memo(function Footer() {
  const { t } = useI18n()
  return (
    <footer className="site-footer relative z-2 bg-deep/92 border-t border-hair text-ink-subtle text-[0.88rem]">
      <div className="max-w-[1180px] mx-auto px-[var(--gutter)] pt-6 pb-7 flex flex-col gap-3.5 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-col gap-1">
          <span>{t.footer.tagline}</span>
          <small className="text-[0.78rem] leading-[1.45]">
            {t.footer.trademark}
          </small>
        </div>
        <nav
          aria-label={t.a11y.footerNav}
          className="flex flex-wrap gap-x-5 gap-y-0 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-[44px] [&_a]:text-ink-muted [&_a]:[overflow-wrap:anywhere] [&_a:hover]:text-ink"
        >
          <a href="/privacy">{t.footer.privacyPolicy}</a>
          <a href="/support">{t.footer.support}</a>
          <a href={EULA_URL} rel="noopener noreferrer">
            {t.footer.terms}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  )
})
