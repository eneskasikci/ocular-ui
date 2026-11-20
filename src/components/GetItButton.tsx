import * as m from 'motion/react-m'
import { APP_STORE_URL } from '../config'
import { cn } from '../lib/cn'
import { SPRING_DETENT } from '../lib/motion'
import { AppleGlyph } from './AppleGlyph'

interface Props {
  variant?: 'default' | 'compact'
  className?: string
}

/** Primary App Store capsule rendered directly inside each view. */
export function GetItButton({ variant = 'default', className }: Props) {
  return (
    <m.a
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-amber text-obsidian border border-silver/18 no-underline font-body font-bold leading-none whitespace-nowrap cursor-pointer transition-colors duration-180 ease-ocular hover:bg-[#f09447] active:brightness-95',
        variant === 'compact'
          ? 'min-h-10 px-[15px] text-[0.88rem] gap-2'
          : 'min-h-[52px] px-6 text-base gap-2.5',
        className,
      )}
      href={APP_STORE_URL}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_DETENT}
    >
      <span className="inline-flex" aria-hidden="true">
        <AppleGlyph />
      </span>
      <span>{variant === 'compact' ? 'Get the app' : 'Download on the App Store'}</span>
    </m.a>
  )
}
