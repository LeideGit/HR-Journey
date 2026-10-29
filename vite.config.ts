import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the repo at /HR-Journey/. Routing uses hash links
// so no server-side fallback is needed (see FEAT-012-B1, B10).
export default defineConfig({
  base: '/HR-Journey/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
  },
});
