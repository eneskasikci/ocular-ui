import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/app.css'
import App from './App.tsx'
import {
  applyDocumentMeta,
  getCachedMessages,
  loadMessages,
  redirectLegacyLangParam,
  resolveInitialLocale,
} from './i18n'

if (!redirectLegacyLangParam()) {
  const initialLocale = resolveInitialLocale()
  const rootEl = document.getElementById('root')!

  void loadMessages(initialLocale)
    .catch(() => getCachedMessages('en')!)
    .then((messages) => {
      applyDocumentMeta(initialLocale, messages)
      createRoot(rootEl).render(
        <StrictMode>
          <App initialLocale={initialLocale} />
        </StrictMode>,
      )
    })
}
