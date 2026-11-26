import { useCallback, useId, useRef, useState, type KeyboardEvent } from 'react'
import { LOCALE_META, localePath, SUPPORTED_LOCALES, useI18n } from '../i18n'
import { cn } from '../lib/cn'

export function LanguageSwitcher() {
  const { locale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''))
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pendingFocusRef = useRef<'first' | 'last' | null>(null)

  const openMenu = (focusTarget: 'first' | 'last' | null = null) => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash)
    }
    pendingFocusRef.current = focusTarget
    setOpen(true)
  }

  const closeMenu = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) {
      triggerRef.current?.focus()
    }
  }

  const attachMenu = useCallback((node: HTMLDivElement | null) => {
    menuRef.current = node
    if (!node) return

    const target = pendingFocusRef.current
    pendingFocusRef.current = null
    if (target) {
      const items = node.querySelectorAll<HTMLElement>('[role="menuitem"]')
      const el = target === 'last' ? items[items.length - 1] : items[0]
      el?.focus()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      menuRef.current = null
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      openMenu('first')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openMenu('last')
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      closeMenu(true)
    }
  }

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = menuRef.current
      ? Array.from(menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      : []
    if (!items.length) return

    const idx = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length].focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0].focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1].focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeMenu(true)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t.a11y.selectLanguage}
        onClick={() => (open ? closeMenu(false) : openMenu(null))}
        onKeyDown={onTriggerKeyDown}
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

      {open && (
        <div
          id={menuId}
          ref={attachMenu}
          role="menu"
          aria-label={t.a11y.language}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-[calc(100%+8px)] z-100 min-w-[196px] p-1.5 rounded-2xl bg-[#0f1014]/96 border border-hair-strong shadow-[0_18px_48px_rgba(0,0,0,.6)] backdrop-blur-md"
        >
          {SUPPORTED_LOCALES.map((code) => {
            const active = code === locale
            const meta = LOCALE_META[code]
            return (
              <a
                key={code}
                role="menuitem"
                href={`${localePath(code)}${hash}`}
                hrefLang={meta.hreflang}
                lang={meta.htmlLang}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
