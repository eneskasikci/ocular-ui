import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Connect, type Plugin } from 'vite'

/** Serves static directory subpages (/privacy, /support) instead of falling back to the root SPA shell. */
function staticSubpages(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url) {
      const match = req.url.match(/^\/(privacy|support)\/?(\?.*)?$/)
      if (match) {
        req.url = `/${match[1]}/index.html${match[2] ?? ''}`
      }
    }
    next()
  }

  return {
    name: 'ocular-static-subpages',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), staticSubpages()],
})
