<template>
  <div>
   <div class="windows">
  <button
      @click="which = it"
      v-for="(it,key) in items"  v-text="it" :class="which === it ? 'active' : ''" />
   </div>
  <div class="windows">
      <h3> Dynamic Components - {{ which }}</h3>
     <DynamicComponent :key="currentComponent" :component-name="currentComponent"/> 
  </div>

   <br>
   <div class="windows">
      <h3> Remote Components - {{ which }}</h3>
     <RemoteComponent :if="isProduction" :key="currentComponent" :component-name="currentComponent"/> 
  </div>
   <div class="windows">
      <h3> Compiled Components - {{ which }}</h3>
   <CompiledComponent :if="false" :key="currentComponent" :component-name="currentComponent"/> 
  </div>
</div>
</template>

<script>
import CompiledComponent from "./components/CompiledComponent.vue";
import DynamicComponent from "./components/DynamicComponent.vue";
import RemoteComponent from "./components/RemoteComponent.vue";
export default {
  components: { DynamicComponent, RemoteComponent, CompiledComponent },
  data(){
    return{
      items: ['simple-with-css', 'with-composible'],
      which:'simple-with-css',
    }
  },
  computed:{
    currentComponent(){
      return this.which;
    },
    isProduction(){ console.log(import.meta.env.PROD ) ; return import.meta.env.PROD }
  }
}
</script>

<style>
button{
  margin: 1rem;
  padding: .5rem 2rem;
}
.active{
  background: lightgray;
}
.windows{
  margin-top: 2rem;
  border: 1px solid black;
  padding: 1rem;
}
</style>

