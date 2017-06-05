<template>
  <div id="app">
    <img src="./assets/irrelephant.jpeg" class="image-logo">
    <pageMenu></pageMenu>
    <router-view></router-view>
  </div>
</template>

<script>
import pageMenu from './components/Menu.vue'
export default {
  name: 'app',
  components: {
    pageMenu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1000px;
  margin: 0 auto;
}

.image-logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin: 0 auto
}
</style>
