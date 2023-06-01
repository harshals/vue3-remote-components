<template>
  <div>
      Current child position is {{  x }} and {{ stylesheet }}
      <component :is=currentComponent :ChildProperties="ChildProperties" @updateChildPosition="displayChildPosition"></component>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import Loading from './Loading.vue';
import Error from './Error.vue'

const props = defineProps(["componentName"]);

const stylesheet = import.meta.env.VITE_API_BASE_URL + props.componentName + ".css"

// env.PROD is being set from .env.* files
const url = import.meta.env.VITE_API_BASE_URL + props.componentName +".js"
const ChildProperties = {
  style : stylesheet,
  name : props.componentName
}
let x = ref(0);
const displayChildPosition = (xValue) => { x.value = xValue };
const currentComponent = defineAsyncComponent(() =>
  import(/* @vite-ignore */ url)
    .then((module) => module.default));

</script>

<style scoped>

</style>
