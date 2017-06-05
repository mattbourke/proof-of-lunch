<template>
  <div class="proof-of-lunch">
    <div class="header-intro">
      <h2>Create a list, to find a random item.</h2>
      <p>
        Most recent Block: {{blockNumber}}
        <br/>
        Block hash: {{blockHash}}
      </p>
    </div>
    <div class="form-fields">
      <label for="difficulty">Difficulty: harder = greater security, but longer to run</label>
      <br/>
      <select v-model="difficulty" id="difficulty" @change="clear()">
        <option value="1">Easy peasy lemon squeezy</option>
        <option value="2">Easy</option>
        <option value="3">Medium</option>
        <option value="4">Hard</option>
        <option value="5">Difficult</option>
        <option value="6">Crazy</option>
      </select>
      <br/>
      <br/>
      <input class="new-item" placeholder="Add item to list" v-model="newItem" @keyup.enter="addItem()">
      <button class="add" @click="addItem()">Add</button>
    </div>

    <div class="items-table">
      <table border="1">
        <tr>
          <th>Delete</th>
          <th>Item Name</th>
          <th>Difficulty</th>
          <th>Nonce</th>
          <th>Found Hash</th>
        </tr>
        <tr v-for="item in orderedItems"
            class="item"
            :key="item.id"
            :class="{ completed: item.completed, working: item.active, awaitingWork: !item.completed && !item.active }">
          <td>
            <button class="delete" @click="deleteItem(item)">Delete</button>
          </td>
          <td>{{item.title}}</td>
          <td>{{difficulty}}</td>
          <td>{{item.nonce}}</td>
          <td>{{item.foundHash}}</td>
        </tr>
      </table>
    </div>
    <div class="find-button">
      <label for="findButton">Highest nonce wins:</label>
      <button id="findButton" class="start-work" @click="startWork()">Find a winner</button>
    </div>
    <div class="copy-completed" v-show="completed">
      <label for="jsonData">JSON result to share as proof:</label>
      <br/>
      <textarea rows="12" cols="80" id="jsonData" placeholder="JSON result">{{getItemsJSON}}</textarea>
    </div>
  </div>
</template>

<script>
import sha256 from 'async-sha256'
import axios from 'axios'
import _ from 'lodash'
import itemStorage from './itemStorage'

var blockAPI = axios.create({
  baseURL: 'https://api.blockcypher.com/v1/btc/main',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  name: 'proof-of-lunch',
  data () {
    return {
      items: itemStorage.fetch(),
      newItem: '',
      completed: false,
      difficulty: 1,
      workingItem: 0,
      blockHash: null,
      blockNumber: 0
    }
  },
  watch () {

  },
  created () {
    blockAPI.get().then(response => {
      this.blockHash = response.data.hash
      this.blockNumber = response.data.height
    })
  },

  methods: {
    setToIncomplete: function () {
      this.completed = false
    },
    clear: function () {
      this.items = []
      this.setToIncomplete()
    },
    addItem: function () {
      let value = this.newItem
      if (!value) {
        return
      }
      this.items.push({
        id: itemStorage.uid++,
        title: value,
        nonce: 0,
        active: false,
        completed: false
      })
      itemStorage.save(this.items)
      this.newItem = ''
      this.setToIncomplete()
    },
    deleteItem: function (item) {
      this.items.splice(this.items.indexOf(item), 1)
      itemStorage.save(this.items)
    },
    itemWorkCompleted: function (item) {
      return item.completed
    },
    startWork: function () {
      this.items.forEach(async(item, index) => {
        await (async function (blockHash, currentItem, difficulty) {
          let nonce = 0
          currentItem.active = true

          while (true) {
            const stringToHash = blockHash + currentItem.title + nonce
            let hash = await sha256(stringToHash)
            currentItem.nonce = nonce

            if (hash.substring(0, difficulty) === '0'.repeat(difficulty)) {
              currentItem.completed = true
              currentItem.active = false
              currentItem.foundHash = hash
              return false
            } else {
              nonce++
            }
          }
        })(this.blockHash, item, this.difficulty)

        if (this.items.every(this.itemWorkCompleted)) {
          itemStorage.save(this.items)
          this.completed = true
        }
      })
    }
  },

  computed: {
    orderedItems: function () {
      return _.orderBy(this.items, 'nonce', 'desc')
    },
    getItemsJSON: function () {
      let returnItem = ''
      if (this.completed) {
        const workData = {
          blockHash: this.blockHash,
          blockNumber: this.blockNumber,
          difficulty: this.difficulty,
          items: this.items
        }
        returnItem = JSON.stringify(workData)
      }
      return returnItem
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}

.find-button {
  margin: 10px 0px 10px 0px;
}

.items-table {
  margin: 10px 0px 10px 0px;
}

.completed {
  background-color: green
}
.working {
  background-color: orange
}
.awaitingWork {
  background-color: #f5f5f5
}
</style>
