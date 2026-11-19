import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useRouter } from '../context/router-context'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

/** Client-navigable link for internal routes (/, /privacy, /support) while preserving standard browser modifiers. */
export function AppLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    ) {
      return
    }
    if (href.startsWith('/')) {
      e.preventDefault()
      navigate(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
