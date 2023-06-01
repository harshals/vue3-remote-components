import { fileURLToPath, URL } from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import {createReadStream} from 'node:fs';

// https://vitejs.dev/config/
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                'vue': process.env.VITE_VUE_RUNTIME,
                'sfcloader' : process.env.VITE_VUE_SFCLOADER
            }
        },
        server: {
            fs: {strict: false},
            port : process.env.VITE_SERVER_PORT,
        },
        preview: {
            fs: {strict: false},
            port : process.env.VITE_SERVER_PORT,
            proxy: {
                '^/(sfc|@)': {
                    selfHandleResponse: true,
                    target:  process.env.VITE_APP_PROXY,
                    bypass(req, resp) {

                        const sfc = req.url.replace('sfc','remote').replace('@/','')
                        //const sfc = req.url.match(/sfc\/([-\w]+)\/meta/)[1];
                        //resp.headers["Content-Type"]=  "text/plain";
                        createReadStream(`./src${sfc}`).pipe(resp);
                    },

                },
                '^/remote': {
                    selfHandleResponse: false,
                    target:  process.env.VITE_APP_PROXY,
                    rewrite: (path) => path.replace(new RegExp(process.env.VITE_API_BASE_URL, "i") , process.env.VITE_API_HOST_URL).replace(/\.js$/,'.es.js') ,
                    configure: (proxy, options) => {
                        proxy.on('proxyRes', (proxyRes, req, res) => {
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
            }
        },
        
        build: {
            target: 'esnext',
            minify:false,
            sourcemap:'hidden',
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

}
