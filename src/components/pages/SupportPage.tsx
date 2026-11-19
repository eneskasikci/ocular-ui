import { type ReactNode, useEffect } from 'react'
import { Accordion } from 'radix-ui'
import { EULA_URL, SUPPORT_EMAIL } from '../../config'
import { AppLink } from '../AppLink'
import { SubpageLayout } from './SubpageLayout'

interface FaqItem {
  id: string
  question: string
  answer: ReactNode
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'faq-restore',
    question: 'How do I restore my Ocular Pro purchase or Lifetime unlock?',
    answer: (
      <p>
        Open Ocular and go to <strong>Settings &rarr; Restore Purchases</strong> (or tap{' '}
        <strong>Restore Purchases</strong> at the bottom of the Ocular Pro paywall). Make sure your device
        is signed into the same Apple Account used for the original monthly, annual, or Lifetime purchase.
      </p>
    ),
  },
  {
    id: 'faq-manage',
    question: 'How do I manage or cancel my subscription or 3-day free trial?',
    answer: (
      <p>
        Subscriptions and free trials are managed by Apple. You can tap{' '}
        <strong>Manage Subscription</strong> inside Ocular&apos;s Settings screen, or open{' '}
        <strong>iOS Settings &rarr; [Your Name] &rarr; Subscriptions &rarr; Ocular</strong> to switch plans
        or cancel at least 24 hours before renewal.
      </p>
    ),
  },
  {
    id: 'faq-recipes',
    question: 'What happens to my custom recipes if Ocular Pro ends?',
    answer: (
      <p>
        Your saved recipes are never deleted. Custom slot <strong>C1</strong> stays active on the Free tier,
        and slots <strong>C2–C7</strong> remain safely preserved on your device so they unlock immediately
        if you re-subscribe.
      </p>
    ),
  },
  {
    id: 'faq-permissions',
    question: 'How do I update Camera or Photo Library permissions?',
    answer: (
      <p>
        Open <strong>iOS Settings &rarr; Ocular</strong> to enable Camera or Photo Library access. Full Photo
        Library access allows Ocular to save shots, show recent captures, and re-develop RAW photos in the
        darkroom.
      </p>
    ),
  },
  {
    id: 'faq-storage',
    question: 'Where are my photos stored, and do I need an account?',
    answer: (
      <p>
        Ocular does not use user accounts. Captured JPEG, HEIF, and RAW/DNG photos are saved directly to your
        Apple Photos library on your device.
      </p>
    ),
  },
  {
    id: 'faq-legal',
    question: 'Where can I read the Privacy Policy and Terms of Use?',
    answer: (
      <p>
        Read the <AppLink href="/privacy">Ocular Privacy Policy</AppLink> or review Apple&apos;s{' '}
        <a href={EULA_URL} rel="noopener noreferrer">
          Standard Licensed Application End User License Agreement (EULA)
        </a>
        .
      </p>
    ),
  },
]

export default function SupportPage() {
  useEffect(() => {
    document.title = 'Support — Ocular'
  }, [])

  return (
    <SubpageLayout active="support" backdrop="silk">
      <h1 className="font-display font-bold text-[clamp(2rem,7vw,3.3rem)] leading-[1.05] tracking-[-0.025em] m-0">
        Ocular Support
      </h1>
      <p className="mt-3.5 mb-6 text-[1.1rem] leading-[1.55] text-ink-muted">
        Need help with camera settings, RAW captures, or your Ocular Pro purchase? Check the quick answers below or
        email the developer directly.
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[18px] mt-6 mb-10 p-[22px] rounded-[18px] bg-graphite/76 border border-hair reduced-transparency:bg-graphite">
        <div>
          <h2 className="font-display font-bold text-[1.22rem] leading-[1.2] mb-2">
            Direct Email Support
          </h2>
          <p className="text-ink-muted">
            When writing about a bug, please include your <strong>iPhone or iPad model</strong>,{' '}
            <strong>iOS/iPadOS version</strong>, and a short description of what happened.
          </p>
          <p className="m-0 font-mono font-semibold text-[0.98rem] leading-[1.4] [overflow-wrap:anywhere]">
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center min-h-[46px] px-[22px] rounded-full bg-burgundy border border-silver/22 text-silver font-body font-bold text-[0.96rem] leading-none no-underline whitespace-nowrap transition-[background-color,transform] duration-180 ease-ocular motion-reduce:transition-none hover:bg-[#922338] active:scale-[0.98]"
          href={`mailto:${SUPPORT_EMAIL}?subject=Ocular%20Support`}
        >
          Email Support
        </a>
      </div>

      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-display font-bold text-[clamp(1.4rem,4.5vw,2rem)] leading-[1.12] m-0"
        >
          Frequently Asked Questions
        </h2>
        <Accordion.Root
          type="single"
          collapsible
          defaultValue={FAQ_ITEMS[0].id}
          className="grid gap-2.5 mt-[18px]"
        >
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="rounded-xl bg-graphite/76 border border-hair reduced-transparency:bg-graphite"
            >
              <Accordion.Header asChild>
                <h3 className="m-0">
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-3.5 min-h-[48px] px-4 py-3 border-0 bg-transparent text-left font-bold text-silver cursor-pointer">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="flex-none font-mono font-semibold text-[1.25rem] leading-none text-amber"
                    >
                      <span className="group-data-[state=open]:hidden">+</span>
                      <span className="hidden group-data-[state=open]:inline">−</span>
                    </span>
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="px-4 pb-3 text-ink-muted [&_strong]:text-silver [&_p:last-child]:mb-0">
                {item.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </SubpageLayout>
  )
}
