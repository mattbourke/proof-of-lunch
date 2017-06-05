<template>
  <ul class="menu">
    <li>
      <router-link to="/">Home</router-link>
    </li>
    <li>
      <router-link to="/proof-of-lunch">Proof of lunch</router-link>
    </li>
    <li>
      <router-link to="/validate-work">Validate</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'menu',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
