import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const posix = (id: string) => id.split('\\').join('/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // keep animation and framework code in long-cacheable chunks separate from app code
        codeSplitting: {
          groups: [
            { name: 'vendor-motion', test: (id: string) => posix(id).includes('/node_modules/motion') },
            { name: 'vendor-react', test: (id: string) => /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(posix(id)) },
          ],
        },
      },
    },
  },
})
