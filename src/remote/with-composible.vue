<template>
  <!-- include style sheet which will be eventually compiled by build-->
  <!-- will probably cry foul in dev mode but it will load inline styles from SFC-->
  <link v-if="isProduction" rel="stylesheet" type="text/css" :href="props.ChildProperties.style" />

  <div class="r1">
    Loaded remote component from files {{  message }} {{ props.ChildProperties.style}}
  </div>
  Mouse position is at: {{ x }}, {{ y }}
</template>

<script setup>
import {ref, defineEmits, watch, computed} from 'vue';
import { useMouse  } from '@/composibles/tracker.js';
const message = ref("hello world");
const emits = defineEmits(["updateChildPosition"])
const { x, y } = useMouse()

watch([x], (xValue) => {
  emits("updateChildPosition", xValue)
})
const props = defineProps(["ChildProperties"]);
const isProduction = computed(() => import.meta.env.PROD)

</script>

<style scoped>
.r1 { background-color: aquamarine;}
</style>
