import { useState } from 'react'
import { BANNER_DISMISSED_KEY, detectBrowserLocale, LOCALE_META, localePath, useI18n, type Locale } from '../i18n'

function getSuggestedLocale(currentLocale: Locale): Locale | null {
  if (currentLocale !== 'en' || typeof window === 'undefined' || window.location.pathname !== '/') {
    return null
  }

  try {
    if (window.localStorage.getItem(BANNER_DISMISSED_KEY) === '1') {
      return null
    }
  } catch {
    // Ignore storage access restrictions
  }

  const detected = detectBrowserLocale()
  return detected && detected !== 'en' ? detected : null
}

export function LanguageBanner() {
  const { locale } = useI18n()
  const [suggested, setSuggested] = useState<Locale | null>(() => getSuggestedLocale(locale))

  if (!suggested) return null

  const meta = LOCALE_META[suggested]
  const href = localePath(suggested)

  const dismiss = () => {
    try {
      window.localStorage.setItem(BANNER_DISMISSED_KEY, '1')
    } catch {
      // Ignore storage access restrictions
    }
    setSuggested(null)
  }

  return (
    <aside
      aria-label={meta.label}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2*var(--gutter))] flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-[#0f1014]/94 border border-hair-strong shadow-[0_14px_36px_rgba(0,0,0,.55)] backdrop-blur-md reduced-transparency:bg-graphite"
    >
      <a
        href={href}
        hrefLang={meta.hreflang}
        lang={meta.htmlLang}
        onClick={(e) => {
          if (typeof window !== 'undefined' && window.location.hash) {
            e.preventDefault()
            window.location.assign(`${href}${window.location.hash}`)
          }
        }}
        className="inline-flex items-center gap-1.5 text-silver hover:text-amber no-underline font-body text-[0.84rem] font-medium whitespace-nowrap"
      >
        <span>{meta.suggestCta}</span>
        <span aria-hidden="true">→</span>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss language suggestion"
        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-ink-subtle hover:text-silver hover:bg-graphite/80 cursor-pointer transition-colors duration-150"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M3 3l6 6M9 3 3 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  )
}
