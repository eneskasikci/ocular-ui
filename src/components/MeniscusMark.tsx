import type { SVGProps } from 'react'
import { cn } from '../lib/cn'

/** Borderless Knurled Film Dial + Lens mark matching the iOS app's `OcularMeniscusMark`. */
export function MeniscusMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('block overflow-visible', className)}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <g stroke="#f3f1ec" strokeWidth="2.05" strokeLinecap="round">
        <line x1="21.51" y1="2.70" x2="20.41" y2="5.36" />
        <line x1="25.40" y1="6.60" x2="23.36" y2="8.64" />
        <line x1="29.30" y1="10.49" x2="26.64" y2="11.59" />
        <line x1="30.40" y1="16.00" x2="27.52" y2="16.00" />
        <line x1="29.30" y1="21.51" x2="26.64" y2="20.41" />
        <line x1="25.40" y1="25.40" x2="23.36" y2="23.36" />
        <line x1="21.51" y1="29.30" x2="20.41" y2="26.64" />
        <line x1="16.00" y1="30.40" x2="16.00" y2="27.52" />
        <line x1="10.49" y1="29.30" x2="11.59" y2="26.64" />
        <line x1="6.60" y1="25.40" x2="8.64" y2="23.36" />
        <line x1="2.70" y1="21.51" x2="5.36" y2="20.41" />
        <line x1="1.60" y1="16.00" x2="4.48" y2="16.00" />
        <line x1="2.70" y1="10.49" x2="5.36" y2="11.59" />
        <line x1="6.60" y1="6.60" x2="8.64" y2="8.64" />
        <line x1="10.49" y1="2.70" x2="11.59" y2="5.36" />
      </g>
      <polygon points="13.12,1.28 18.88,1.28 16,5.76" fill="#e8832a" />
      <circle cx="16" cy="16" r="8.0" fill="none" stroke="#f3f1ec" strokeWidth="2.72" />
      <circle cx="16" cy="16" r="2.56" fill="#f3f1ec" fillOpacity="0.45" />
    </svg>
  )
}
