import { fileURLToPath, URL } from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const file = process.argv[ process.argv.length - 1]
const fileName = file.replace(/\.js$/,'')
const srcDir = "src/remote"
const globals = {};
globals[process.env.VITE_VUE_RUNTIME] = 'Vue'

process.env = {...process.env, ...loadEnv("production", process.cwd())};

globals[process.env.VITE_VUE_RUNTIME] = 'Vue'
export default defineConfig({
    plugins: [vue()],
    server: {fs: {strict: false}},
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue': process.env.VITE_VUE_RUNTIME,
        }
    },
    build: {
        target: 'esnext',
        minify:false,
        sourcemap: "hidden",
        outDir: 'dist/libraries',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, srcDir, file),
            formats: ['es'],
            name: fileName,
            // the proper extensions will be added
            fileName: fileName,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [process.env.VITE_VUE_RUNTIME],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                 globals: globals,
                //preserveModules: true,
                exports: 'named',
                assetFileNames : `${ fileName }.[ext]`
            },
        },
    }
})
