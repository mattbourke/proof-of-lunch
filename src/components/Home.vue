<template>
  <div class="home">
    <h1>
      {{ msg }}
    </h1>
    <p>
      This app allows for a completely random selection from a list, verifiable as random to all remote participating parties.
    </p>
    <p>
      This app uses the Bitcoin Blockchain as a source of entropy.
      We take the hash of the most recent block and perform Proof Of Work on all the items in the specified list, the proof of work function takes the 3 following values for each item.
    </p>
    <ul>
      <li>Hash of the most recent Bitcoin Block</li>
      <li>The List item</li>
      <li>Nonce</li>
    </ul>
    <p>
      The list will be ordered by the items having the highest nonce, so the highest nonce found wins!.
      Any remote party can validate the winning result via the validate link.
    </p>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Proof of lunch - reproducible decentralised randomness'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
