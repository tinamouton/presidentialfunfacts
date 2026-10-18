import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ command, isPreview }) => {
  const base = command === 'build' || isPreview ? '/presidentialfunfacts/' : '/';

  return {
    base,
    plugins: [
      vue(),
      VitePWA({
        registerType: 'prompt',
        scope: base,
        includeAssets: ['mascot.svg', 'icon-192.png', 'icon-512.png', 'portraits/*'],
        manifest: {
          name: 'PresidentialFunFacts',
          short_name: 'FunFacts',
          description: 'Little-known facts. Big personalities.',
          theme_color: '#12364a',
          background_color: '#fcf6e9',
          display: 'standalone',
          start_url: base,
          scope: base,
          id: base,
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          ],
        },
        workbox: {
          clientsClaim: true,
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff,woff2}'],
          navigateFallback: `${base}index.html`,
        },
      }),
    ],
    test: { environment: 'node', include: ['src/**/*.test.ts'] },
  };
});
