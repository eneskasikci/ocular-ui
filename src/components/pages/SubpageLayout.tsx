import type { ReactNode } from 'react'
import type { BackdropId } from '../../config'
import { Backdrop } from '../Backdrop'
import { Footer } from '../Footer'
import { SubpageHeader } from '../SubpageHeader'

interface SubpageLayoutProps {
  active: 'privacy' | 'support'
  backdrop: BackdropId
  as?: 'article' | 'div'
  children: ReactNode
}

/** Shared static shell for the /privacy and /support documentation pages. */
export function SubpageLayout({ active, backdrop, as = 'div', children }: SubpageLayoutProps) {
  const Container = as
  return (
    <>
      <Backdrop active={backdrop} />
      <a
        className="fixed left-[var(--gutter)] -top-[100px] focus:top-2 z-100 px-4 py-3 bg-silver text-obsidian rounded-lg font-bold"
        href="#main"
      >
        Skip to content
      </a>
      <SubpageHeader active={active} />

      <main
        id="main"
        className="relative z-1 min-h-[calc(100svh-140px)] pt-[calc(var(--header)+40px)] sm:pt-[calc(var(--header)+32px)] px-[var(--gutter)] pb-[72px]"
      >
        <Container className="max-w-[760px] mx-auto px-5 sm:px-9 pt-7 sm:pt-9 pb-9 sm:pb-11 rounded-[24px] bg-deep/86 border border-hair backdrop-blur-[22px] reduced-transparency:bg-graphite reduced-transparency:backdrop-blur-none">
          {children}
        </Container>
      </main>

      <Footer />
    </>
  )
}
