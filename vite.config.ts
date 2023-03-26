import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      alias: {
        src: '/src',
        pages: '/src/pages',
        store: '/src/store',
        services: '/src/services',
        components: '/src/components',
        utils: '/src/utils',
        layouts: '/src/layouts'
      },
    },
    plugins: [react()]
  }
})