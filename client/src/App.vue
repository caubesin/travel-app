<template>
  <div id="app">
    <GoogleMap />
  </div>
</template>

<script>
import GoogleMap from "./components/GoogleMap.vue";

export default {
  name: "App",
  components: {
    GoogleMap,
  },
  mounted() {
    console.log("app mounted");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
