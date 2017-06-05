// inspired/ripped by/from some todo app.
var STORAGE_KEY = 'feed-me-some-stuff'
var itemStorage = {
  fetch: function () {
    var items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    items.forEach(function (item, index) {
      item.id = index
    })
    itemStorage.uid = items.length
    return items
  },
  save: function (items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

export default itemStorage
