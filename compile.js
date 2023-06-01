const { build , loadEnv} = require('vite');
const { resolve } = require('path');
const { fileURLToPath, URL } = require('node:url');
const fs = require('fs');
const lib = require('node-forge');
//const vue = require('@vitejs/plugin-vue');
process.env = {...process.env, ...loadEnv("production", process.cwd())};


let config = {
  // Your configuration options here
  plugins: [],
  server: {},
  resolve: {
    alias: {
      '@': process.cwd().concat("/src"),
      'vue': process.env.VITE_VUE_RUNTIME,
    }
  },

  build: {
    //write: false,
    target: 'esnext',
    emptyOutDir: false,
    minify: false,
    sourcemap: "hidden",
    outDir: 'dist/libraries',
    css: {fileName : "custom-style.css"},
    lib: {
      entry: "",
      formats: ['es'],
      fileName: "",
    },
    rollupOptions: {
      external: [process.env.VITE_VUE_RUNTIME],
      output: {
        globals: {},
        exports: 'named'
      },
    },
  }
};


async function runVite(library, customConfig) {
  try {
    
    console.log(`processing ${ customConfig.build.lib.fileName }`)
    const bundle = await build(customConfig);
    //console.log(JSON.stringify(bundle,null,3));
    console.log(`Build ${library} completed successfully.`);
  } catch (error) {
    console.error(`Build failed for ${library}:`, error);
  }
}
const libraries = [];
fs.readdirSync("./src/remote").forEach(async (file) => {
  if (file.match(/\.js$/)) { 
      libraries.push(file);
  }
});

libraries.forEach(async (file) => {

  //deep copy config
  let customConfig = (JSON.parse(JSON.stringify(config)));
  let fileName = file.replace(/\.js$/,'')
  customConfig.build.lib.entry = resolve(__dirname, './src/remote/', file);
  customConfig.build.lib.fileName = fileName
  customConfig.build.rollupOptions.output.assetFileNames= `${fileName}.[ext]`
  customConfig.build.rollupOptions.output.globals[process.env.VITE_VUE_RUNTIME] = 'Vue'
  runVite(file, customConfig) 
});


