import { fileURLToPath, URL } from 'node:url'
import {defineConfig} from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        fs: {strict: (process.env.MODE === 'production') ?true:false},
        proxy : {
            '^/remote': {
                selfHandleResponse: false,
                target: 'http://localhost:5000/',
                rewrite: (path) =>  path.replace(/^\/remote/, '/libraries').replace(/js$/,'es.js') ,
                configure: (proxy, options) => {
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log(req.url);
                        proxyRes.headers['content-type'] = (req.url.match(/css$/)) 
                                                            ? 'text/css; charset=utf-8'
                                                            : 'text/javascript; charset=utf-8'
                    })

                    proxy.on('error', (err, req) => {
                        // skip CSS errors when tryng to load build styles in dev mode
                        //console.error(err);
                    })
                }
            },
            
            "/github": {
                selfHandleResponse: false,
                target: "https://gist.githubusercontent.com/harshals/4fca48c6dc9f1da235fe01798363c6bd/raw/3ef93a20489fdc570000de6121e33c29d2bc66b4/",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/remote/, ""),
                configure: (proxy, options) => {
                    // proxy will be an instance of 'http-proxy'
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        //console.log(proxyRes.headers);
                        //res.setHeader('Access-Control-Allow-Origin', '*');
                        //res.setHeader('content-type', 'text/javascript; charset=utf-8');
                        proxyRes.headers['content-type'] = 'text/javascript; charset=utf-8';
                    })

                },
            },
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            //vue: 'vue/dist/vue.esm-bundler.js', //'https://unpkg.com/vue@3.2.0/dist/vue.esm-browser.js'
            vue: 'https://unpkg.com/vue@3.3.0/dist/vue.esm-browser.js'

        }
    },
    build: {
        target: 'esnext',
        minify: false,
        emptyOutDir: true,
        rollupOptions: {
            // // make sure to externalize deps that shouldn't be bundled
            // // into your library
            external: (id) => id.match(/styles/),
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        },
    }
})
