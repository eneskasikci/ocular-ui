import type { Connect, Plugin } from 'vite'
import { SITE_URL } from '../src/config.ts'
import { de } from '../src/i18n/locales/de.ts'
import { en } from '../src/i18n/locales/en.ts'
import { es } from '../src/i18n/locales/es.ts'
import { fr } from '../src/i18n/locales/fr.ts'
import { it } from '../src/i18n/locales/it.ts'
import { ja } from '../src/i18n/locales/ja.ts'
import { ko } from '../src/i18n/locales/ko.ts'
import { ptBR } from '../src/i18n/locales/pt-BR.ts'
import { tr } from '../src/i18n/locales/tr.ts'
import { zhHans } from '../src/i18n/locales/zh-Hans.ts'
import { LOCALE_META, localePath, localeUrl, SUPPORTED_LOCALES, type Locale, type Messages } from '../src/i18n/types.ts'

const MESSAGES: Record<Locale, Messages> = {
  en,
  tr,
  de,
  fr,
  es,
  it,
  ja,
  ko,
  'zh-Hans': zhHans,
  'pt-BR': ptBR,
}

const STATIC_NON_LOCALE_URLS = [
  { loc: `${SITE_URL}/support/`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE_URL}/privacy/`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/llms.txt`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/llms-full.txt`, changefreq: 'monthly', priority: '0.7' },
] as const

const LOCALE_SLUGS = SUPPORTED_LOCALES.map((code) => LOCALE_META[code].slug).filter(Boolean)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function assertReplace(input: string, pattern: RegExp, replacement: string, label: string): string {
  if (!pattern.test(input)) {
    throw new Error(`[ocular-static-i18n] Could not match ${label} in built index.html`)
  }
  return input.replace(pattern, replacement)
}

function buildHreflangTags(): string {
  const lines = SUPPORTED_LOCALES.map((code) => {
    const meta = LOCALE_META[code]
    return `    <link rel="alternate" hreflang="${meta.hreflang}" href="${localeUrl(code)}" />`
  })
  lines.push(`    <link rel="alternate" hreflang="x-default" href="${localeUrl('en')}" />`)
  return lines.join('\n')
}

function buildNoscriptLocaleNav(label: string): string {
  const links = SUPPORTED_LOCALES.map((code) => {
    const meta = LOCALE_META[code]
    return `<a href="${localePath(code)}" hreflang="${meta.hreflang}" lang="${meta.htmlLang}" style="color:#e8832a">${escapeHtml(meta.label)}</a>`
  }).join(' · ')
  return `        <nav aria-label="${escapeHtml(label)}" style="margin-top:16px;font-size:0.9rem">${links}</nav>`
}

function renderSitemapXml(): string {
  const xhtmlLinks = [
    ...SUPPORTED_LOCALES.map((code) => {
      const meta = LOCALE_META[code]
      return `    <xhtml:link rel="alternate" hreflang="${meta.hreflang}" href="${localeUrl(code)}" />`
    }),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl('en')}" />`,
  ].join('\n')

  const localeEntries = SUPPORTED_LOCALES.map(
    (code) => `  <url>
    <loc>${localeUrl(code)}</loc>
${xhtmlLinks}
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
  ).join('\n')

  const staticEntries = STATIC_NON_LOCALE_URLS.map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${localeEntries}
${staticEntries}
</urlset>
`
}

function buildJsonLd(baseHtml: string, locale: Locale, messages: Messages, canonicalUrl: string): string {
  const meta = LOCALE_META[locale]
  const match = baseHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!match) {
    throw new Error('[ocular-static-i18n] Could not match JSON-LD script in built index.html')
  }

  let data: unknown
  if (locale === 'en') {
    const parsed = JSON.parse(match[1]) as { '@graph'?: Array<Record<string, unknown>> }
    if (Array.isArray(parsed['@graph'])) {
      for (const node of parsed['@graph']) {
        const type = node['@type']
        const isWebOrApp =
          type === 'WebSite' ||
          (Array.isArray(type) && (type.includes('MobileApplication') || type.includes('SoftwareApplication')))
        if (isWebOrApp) {
          node.inLanguage = meta.htmlLang
        }
      }
    }
    data = parsed
  } else {
    data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${canonicalUrl}#website`,
          url: canonicalUrl,
          inLanguage: meta.htmlLang,
          name: 'Ocular Camera',
          description: messages.meta.description,
        },
        {
          '@type': ['MobileApplication', 'SoftwareApplication'],
          '@id': `${canonicalUrl}#app`,
          name: 'Ocular Camera',
          url: canonicalUrl,
          inLanguage: meta.htmlLang,
          operatingSystem: 'iOS, iPadOS',
          applicationCategory: 'PhotographyApplication',
          description: messages.meta.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      ],
    }
  }

  const serialized = JSON.stringify(data, null, 2).replace(/<\//g, '<\\/')
  return `<script type="application/ld+json">\n${serialized}\n    </script>`
}

function buildLocalizedNoscript(locale: Locale, messages: Messages, baseHtml: string): string {
  if (locale === 'en') {
    const match = baseHtml.match(/<noscript>[\s\S]*?<\/noscript>/)
    if (!match) {
      throw new Error('[ocular-static-i18n] Could not match <noscript> block in built index.html')
    }
    return match[0]
      .replace('href="/support"', 'href="/support/"')
      .replace('href="/privacy"', 'href="/privacy/"')
      .replace('</main>', `${buildNoscriptLocaleNav('Languages')}\n      </main>`)
  }

  const title = escapeHtml(messages.meta.title)
  const tagline = escapeHtml(messages.hero.tagline)
  const subline = escapeHtml(messages.hero.subline)
  const privacyChips = messages.privacy.chips.map((c) => escapeHtml(c)).join(' · ')

  return `<noscript>
      <main style="max-width:760px;margin:0 auto;padding:96px 20px 64px;color:#f3f1ec;font-family:system-ui,-apple-system,sans-serif;line-height:1.6">
        <h1>${title}</h1>
        <p><strong>${tagline}</strong> ${subline}</p>
        <ul>
          <li><strong>${escapeHtml(messages.recipes.heading)}</strong> — ${escapeHtml(messages.recipes.customSlots)}</li>
          <li><strong>${escapeHtml(messages.capture.heading)}</strong> — ${escapeHtml(messages.capture.lede)}</li>
          <li><strong>${escapeHtml(messages.raw.heading)}</strong> — ${escapeHtml(messages.raw.lede)}</li>
          <li><strong>${escapeHtml(messages.tiers.heading)}</strong> — ${escapeHtml(messages.tiers.lede)}</li>
          <li><strong>${escapeHtml(messages.privacy.heading)}</strong> — ${escapeHtml(messages.privacy.lede)} (${privacyChips})</li>
        </ul>
        <p><a href="/support/" style="color:#e8832a">${escapeHtml(messages.footer.support)}</a> · <a href="/privacy/" style="color:#e8832a">${escapeHtml(messages.footer.privacyPolicy)}</a> · <a href="/llms.txt" style="color:#e8832a">LLM</a></p>
${buildNoscriptLocaleNav(messages.a11y.language)}
      </main>
    </noscript>`
}

function renderLocaleHtml(
  baseHtml: string,
  locale: Locale,
  messages: Messages,
  chunkHref: string | undefined,
): string {
  const meta = LOCALE_META[locale]
  const canonicalUrl = localeUrl(locale)
  const escapedTitle = escapeHtml(messages.meta.title)
  const escapedDescription = escapeHtml(messages.meta.description)

  let html = baseHtml
  html = assertReplace(html, /<html lang="en">/, `<html lang="${meta.htmlLang}">`, '<html lang>')
  html = assertReplace(html, /<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`, '<title>')
  html = assertReplace(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapedDescription}" />`,
    'meta[name="description"]',
  )
  if (locale !== 'en') {
    html = assertReplace(
      html,
      /\s*<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/,
      '',
      'meta[name="keywords"]',
    )
  }
  html = assertReplace(
    html,
    /<link rel="canonical" href="https:\/\/ocularcamera\.com\/" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />\n${buildHreflangTags()}`,
    'link[rel="canonical"]',
  )
  html = assertReplace(
    html,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapedTitle}" />`,
    'meta[property="og:title"]',
  )
  html = assertReplace(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapedDescription}" />`,
    'meta[property="og:description"]',
  )

  const alternateOgLocales = SUPPORTED_LOCALES.filter((code) => code !== locale)
    .map((code) => `    <meta property="og:locale:alternate" content="${LOCALE_META[code].ogLocale}" />`)
    .join('\n')

  html = assertReplace(
    html,
    /<meta property="og:url" content="https:\/\/ocularcamera\.com\/" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />\n    <meta property="og:locale" content="${meta.ogLocale}" />\n${alternateOgLocales}`,
    'meta[property="og:url"]',
  )
  html = assertReplace(
    html,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    'meta[name="twitter:title"]',
  )
  html = assertReplace(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
    'meta[name="twitter:description"]',
  )
  html = assertReplace(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    buildJsonLd(baseHtml, locale, messages, canonicalUrl),
    'JSON-LD script',
  )
  html = assertReplace(
    html,
    /<noscript>[\s\S]*?<\/noscript>/,
    buildLocalizedNoscript(locale, messages, baseHtml),
    '<noscript>',
  )

  if (chunkHref) {
    html = assertReplace(
      html,
      /<\/head>/,
      `    <link rel="modulepreload" crossorigin href="${chunkHref}" />\n  </head>`,
      '</head>',
    )
  }

  return html
}

/**
 * Generates localized static HTML shells (`dist/<slug>/index.html` + `dist/index.html`)
 * with full bidirectional hreflang, canonical URLs, localized head metadata, and `dist/sitemap.xml`,
 * while also wiring dev and preview servers to resolve static subpages and locale directories.
 */
export function ocularStaticI18n(): Plugin {
  const slugPattern = LOCALE_SLUGS.join('|')
  const devRouteRe = new RegExp(`^\\/(?:${slugPattern})\\/?(\\?.*)?$`)
  const subpageRe = /^\/(privacy|support)\/?(\?.*)?$/
  const previewDirRe = new RegExp(`^\\/(privacy|support|${slugPattern})\\/?(\\?.*)?$`)

  const devRewrite: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url === '/sitemap.xml') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.end(renderSitemapXml())
      return
    }
    if (req.url) {
      const subMatch = req.url.match(subpageRe)
      if (subMatch) {
        req.url = `/${subMatch[1]}/index.html${subMatch[2] ?? ''}`
      } else {
        const localeMatch = req.url.match(devRouteRe)
        if (localeMatch) {
          req.url = `/index.html${localeMatch[1] ?? ''}`
        }
      }
    }
    next()
  }

  const previewRewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url) {
      const match = req.url.match(previewDirRe)
      if (match) {
        req.url = `/${match[1]}/index.html${match[2] ?? ''}`
      }
    }
    next()
  }

  return {
    name: 'ocular-static-i18n',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use(devRewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(previewRewrite)
    },
    generateBundle(_options, bundle) {
      const indexAsset = bundle['index.html']
      if (!indexAsset || indexAsset.type !== 'asset') {
        this.error('[ocular-static-i18n] Missing built index.html asset')
      }

      const baseHtml =
        typeof indexAsset.source === 'string'
          ? indexAsset.source
          : Buffer.from(indexAsset.source).toString('utf8')

      const chunkByLocale: Partial<Record<Locale, string>> = {}
      for (const item of Object.values(bundle)) {
        if (item.type !== 'chunk') continue
        const facade = item.facadeModuleId?.replace(/\\/g, '/') ?? ''
        const matched = SUPPORTED_LOCALES.find(
          (code) => code !== 'en' && facade.endsWith(`/src/i18n/locales/${code}.ts`),
        )
        if (matched) {
          chunkByLocale[matched] = `/${item.fileName}`
        }
      }

      indexAsset.source = renderLocaleHtml(baseHtml, 'en', MESSAGES.en, undefined)

      for (const code of SUPPORTED_LOCALES) {
        if (code === 'en') continue
        const slug = LOCALE_META[code].slug
        this.emitFile({
          type: 'asset',
          fileName: `${slug}/index.html`,
          source: renderLocaleHtml(baseHtml, code, MESSAGES[code], chunkByLocale[code]),
        })
      }

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: renderSitemapXml(),
      })
    },
  }
}
