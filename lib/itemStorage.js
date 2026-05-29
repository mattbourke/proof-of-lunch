const STORAGE_KEY = 'feed-me-some-stuff'

let uid = 0

export function fetchItems() {
  if (typeof window === 'undefined') return []
  const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  items.forEach((item, index) => {
    item.id = index
  })
  uid = items.length
  return items
}

export function saveItems(items) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getNextId() {
  return uid++
}
