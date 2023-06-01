<template>
  <div class="window">
      This Component is loaded via SFC loader (Works only in Production Mode)
      <component :is=currentComponent :ChildProperties="ChildProperties" @updateChildPosition="displayChildPosition"></component>
  </div>
</template>

<script setup>

import * as Vue from 'vue';
import { defineAsyncComponent , ref} from 'vue';
import { loadModule } from 'sfcloader';
import * as Composible from '@/composibles/tracker.js';

const props = defineProps(["componentName"]);

// env.PROD is being set from .env.* files
const url = import.meta.env.VITE_API_BASE_URL + props.componentName +".vue"
const ChildProperties = {
  style : '/assets/empty.css',
  name : props.componentName,
}
let x = ref(0);


const displayChildPosition = (xValue) => { x.value = xValue };

const sfcSource = `
                  <template>
                    <div class="app1">
                      Application One {{message}}
                    </div>
                  </template>
                  <script setup >  
                    import { ref } from 'vue'
                    const message = ref("from SFC")
                  <\/script>
                  <style scoped>
                  .app1 { background-color: red;}
                  </style>
                  `;

const options = {
  moduleCache: { vue: Vue , composible : Composible},
  async getFile(url) {
        
        const res = await fetch(url);
        
        if ( !res.ok )
          throw Object.assign(new Error(res.statusText + ' ' + url), { res });

        return {
          getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
  },
  addStyle: (textContent) => {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
  },
}
const currentComponent = defineAsyncComponent(() => loadModule(url.replace('remote', 'sfc'), options))


</script>

<style scoped>

</style>
