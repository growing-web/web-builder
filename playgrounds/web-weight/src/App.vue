<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div><button @click="host.context.unmount">unmount</button></div>
    <HelloWorld :msg="host.data.message" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default Vue.extend({
  name: 'App',
  inject: ['host'],
  components: {
    HelloWorld,
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
