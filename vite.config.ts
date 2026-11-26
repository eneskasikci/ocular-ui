import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { ocularStaticI18n } from './scripts/vite-i18n-static.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ocularStaticI18n()],
})
