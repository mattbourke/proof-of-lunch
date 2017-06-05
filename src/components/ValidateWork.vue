<template>
  <div class="validate-work">
    <div class="header-intro">
      <h2>Validate work.</h2>
      <p>
        Block: {{blockNumber}}
        <br/>
        Block hash: {{blockHash}}
        <br/>
        Difficulty: {{difficulty}}
      </p>
    </div>
    <div class="items-table">
      <table border="1">
        <tr>
          <th>Item Name</th>
          <th>Nonce</th>
          <th>Found Hash</th>
        </tr>
        <tr v-for="item in orderedItems"
            class="item"
            :key="item.id"
            :class="{ validated: item.completed, invalid: !item.completed }">
          <td>{{item.title}}</td>
          <td>{{item.nonce}}</td>
          <td>{{item.foundHash}}</td>
        </tr>
      </table>
    </div>
    <div class="copy-completed">
      <label for="jsonData">JSON result to share as proof:</label>
      <br/>
      <textarea rows="12" cols="80" id="jsonData" v-model="jsonData" placeholder="JSON result"></textarea>
    </div>
    <button class="validate" @click="validateItem()">Validate</button>
  </div>
</template>

<script>
import sha256 from 'async-sha256'
import _ from 'lodash'

export default {
  name: 'ValidateWork',
  data () {
    return {
      blockHash: '',
      blockNumber: null,
      item: '',
      isValid: null,
      jsonData: '',
      items: [],
      difficulty: null
    }
  },
  methods: {
    validateItem: function () {
      this.items = []
      const jsonData = JSON.parse(this.jsonData)
      this.blockHash = jsonData.blockHash
      this.blockNumber = jsonData.blockNumber
      this.difficulty = jsonData.difficulty
      this.items = this.items.concat(jsonData.items)

      this.items.forEach((item, index) => {
        const stringToHash = this.blockHash + item.title + item.nonce
        sha256(stringToHash).then((hash) => {
          item.completed = (hash === item.foundHash)
        })
      })
    },
    itemWorkCompleted: function (item) {
      return item.completed
    }
  },
  computed: {
    validated: {
      get: function () {
        return this.isValid
      },
      set: function (value) {
        this.isValid = value
      }
    },
    orderedItems: function () {
      return _.orderBy(this.items, 'nonce', 'desc')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.validate-work {
  width: 800px;
}

h1, h2 {
  font-weight: normal;
}

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

.items-table {
  margin: 10px 0px 10px 0px;
}

.validated {
  background-color: green
}

.invalid {
  background-color: red
}

</style>
