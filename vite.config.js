import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';
// Popup-only Manifest V3 build: bundles index.html as the extension popup
// and copies manifest.json + icons into dist/ untouched.
export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: 'manifest.json', dest: '.' },
                { src: 'public/icons', dest: '.' },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
