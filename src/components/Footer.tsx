import { memo } from 'react'
import { EULA_URL, SUPPORT_EMAIL } from '../config'
import { LOCALE_META, localePath, SUPPORTED_LOCALES, useI18n } from '../i18n'
import { cn } from '../lib/cn'

export const Footer = memo(function Footer() {
  const { locale, t } = useI18n()
  return (
    <footer className="site-footer relative z-2 bg-deep/92 border-t border-hair text-ink-subtle text-[0.88rem]">
      <div className="max-w-[1180px] mx-auto px-[var(--gutter)] pt-5 pb-4 flex flex-col gap-3.5 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-col gap-1">
          <span>{t.footer.tagline}</span>
          <small className="text-[0.78rem] leading-[1.45]">
            {t.footer.trademark}
          </small>
        </div>
        <nav
          aria-label={t.a11y.footerNav}
          className="flex flex-wrap gap-x-5 gap-y-0 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-[40px] [&_a]:text-ink-muted [&_a]:[overflow-wrap:anywhere] [&_a:hover]:text-ink"
        >
          <a href="/privacy/">{t.footer.privacyPolicy}</a>
          <a href="/support/">{t.footer.support}</a>
          <a href={EULA_URL} rel="noopener noreferrer">
            {t.footer.terms}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </nav>
      </div>
      <nav
        aria-label={t.a11y.language}
        className="max-w-[1180px] mx-auto px-[var(--gutter)] pt-2 pb-4 border-t border-hair/60 flex flex-wrap gap-x-4 gap-y-1"
      >
        {SUPPORTED_LOCALES.map((code) => {
          const meta = LOCALE_META[code]
          const active = code === locale
          return (
            <a
              key={code}
              href={localePath(code)}
              hrefLang={meta.hreflang}
              lang={meta.htmlLang}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'text-[0.76rem] leading-[1.4] py-0.5 no-underline transition-colors duration-150',
                active ? 'text-amber font-semibold' : 'text-ink-subtle hover:text-ink',
              )}
            >
              {meta.label}
            </a>
          )
        })}
      </nav>
    </footer>
  )
})
