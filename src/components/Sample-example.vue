/*
Below is the most basic example of a VUE.js component
Note: the template section isn't required, a developer can use JSX from within the components code.
*/

<template>

  <div>
    <h1>{{description}}</h1>
    <blah></blah>
  </div>


</template>


<script>
  import blah from 'yolo'

  export default {
    name: 'hello',
    components: {
      blah
    },
    data () {
      return {
        description: 'yolo'
      }
    },
    methods: {

    },
    computed: {

    }
}
</script>


<style scoped>



</style>
