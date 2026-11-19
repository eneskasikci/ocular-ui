import type { SVGProps } from 'react'
import { cn } from '../lib/cn'

/** Borderless meniscus mark: two arcs and an amber core. Geometry follows the app's mark. */
export function MeniscusMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('block overflow-visible', className)}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path
        d="M 10.23 25.23 A 10.88 10.88 0 0 1 10.23 6.77"
        fill="none"
        stroke="#f3f1ec"
        strokeWidth="3.68"
        strokeLinecap="round"
      />
      <path
        d="M 21.77 6.77 A 10.88 10.88 0 0 1 21.77 25.23"
        fill="none"
        stroke="#f3f1ec"
        strokeWidth="3.68"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.52" fill="#e8832a" />
    </svg>
  )
}
