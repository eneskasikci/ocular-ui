import { useState } from 'react'
import { DropdownMenu } from 'radix-ui'
import { LOCALE_META, localePath, SUPPORTED_LOCALES, useI18n } from '../i18n'
import { cn } from '../lib/cn'

export function LanguageSwitcher() {
  const { locale, t } = useI18n()
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''))

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={(open) => {
        if (open && typeof window !== 'undefined') {
          setHash(window.location.hash)
        }
      }}
    >
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t.a11y.selectLanguage}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 rounded-full bg-obsidian/84 border border-hair text-silver font-mono font-bold text-[0.74rem] leading-none tracking-[0.06em] cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{LOCALE_META[locale].short}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 4.5 6 7.5 9 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          aria-label={t.a11y.language}
          className="z-100 min-w-[196px] p-1.5 rounded-2xl bg-[#0f1014]/96 border border-hair-strong shadow-[0_18px_48px_rgba(0,0,0,.6)] backdrop-blur-md"
        >
          {SUPPORTED_LOCALES.map((code) => {
            const active = code === locale
            const meta = LOCALE_META[code]
            return (
              <DropdownMenu.Item key={code} asChild>
                <a
                  href={`${localePath(code)}${hash}`}
                  hrefLang={meta.hreflang}
                  lang={meta.htmlLang}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-[0.86rem] font-body font-medium no-underline cursor-pointer outline-none transition-colors duration-150',
                    active
                      ? 'text-amber bg-amber/14 font-semibold'
                      : 'text-silver/90 hover:bg-graphite/80 hover:text-silver focus:bg-graphite/80',
                  )}
                >
                  <span>{meta.label}</span>
                  <span className="font-mono font-bold text-[0.7rem] tracking-[0.06em] opacity-75">
                    {meta.short}
                  </span>
                </a>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
