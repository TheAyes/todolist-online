import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        outDir: '../dist/api/',
        sourcemap: "inline",
        ssr: false,
        minify: true,
        target: 'esnext',
        lib: {
            entry: './src/api.ts',
            name: 'api',
            formats: ['es']
        },
        rollupOptions: {
            external: ['express', 'mongoose', 'dotenv', 'jsonwebtoken', 'bcrypt', 'uuid', 'path', 'fs', 'url', 'process'],
        }
    },
    plugins: [],
    esbuild: {
        loader: 'ts',
        tsconfigRaw: require('./tsconfig.json')
    }
});