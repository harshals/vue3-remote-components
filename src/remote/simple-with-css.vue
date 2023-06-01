<template>
  <!-- include style sheet which will be eventually compiled by build-->
  <!-- will probably cry foul in dev mode but it will load inline styles from SFC-->
  <link v-if="isProduction" rel="stylesheet" type="text/css" :href="props.ChildProperties.style" />

  <div class="r1">
    Loaded remote component from files - {{  message }} with stylesheet {{  props.ChildProperties.style }}
  </div>
</template>

<script setup>
import {ref, defineEmits, watch, computed} from 'vue';
const message = ref("hello world");
const props = defineProps(["ChildProperties"]);
const isProduction = computed(() => 1)

</script>

<style scoped>
.r1 { background-color: aquamarine;}
</style>
