<template>
  <div>
      Works on in Dev Mode : position is {{  x }} and {{ stylesheet }}
      <component :is=currentComponent :ChildProperties="ChildProperties" @updateChildPosition="displayChildPosition"></component>
  </div>
</template>

<script setup>
import {defineAsyncComponent, ref, onMounted, watch } from 'vue';
import Loading from "./Loading.vue";
import Error from "./Error.vue";

const props = defineProps(["componentName"]);
const url = "../remote/" + props.componentName + ".vue";
const ChildProperties = {
  style : '/assets/empty.css',
  name : props.componentName,
}
let x = ref(0);

const displayChildPosition = (xValue) => { x.value = xValue };

const currentComponent = defineAsyncComponent(() => import(url));

</script>
