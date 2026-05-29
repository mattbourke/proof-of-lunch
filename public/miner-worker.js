async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

self.onmessage = async function (e) {
  const { blockHash, title, difficulty, id } = e.data
  const target = '0'.repeat(difficulty)
  let nonce = 0
  const BATCH_SIZE = 2000
  const REPORT_INTERVAL = 5000

  while (true) {
    for (let i = 0; i < BATCH_SIZE; i++) {
      const hash = await sha256(blockHash + title + nonce)
      if (hash.substring(0, difficulty) === target) {
        self.postMessage({ type: 'done', id, nonce, foundHash: hash })
        return
      }
      nonce++
    }

    if (nonce % REPORT_INTERVAL < BATCH_SIZE) {
      self.postMessage({ type: 'progress', id, nonce })
    }
  }
}
