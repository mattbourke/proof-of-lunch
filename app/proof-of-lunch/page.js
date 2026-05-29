'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchItems, saveItems, getNextId } from '../../lib/itemStorage'

export default function ProofOfLunch() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [completed, setCompleted] = useState(false)
  const [working, setWorking] = useState(false)
  const [difficulty, setDifficulty] = useState(1)
  const [blockHash, setBlockHash] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [hashCounts, setHashCounts] = useState({})
  const [copied, setCopied] = useState(false)
  const hashCountsRef = useRef({})
  const rafRef = useRef(null)
  const workersRef = useRef([])

  useEffect(() => {
    setItems(fetchItems())
    fetch('https://api.blockcypher.com/v1/btc/main')
      .then(res => res.json())
      .then(data => {
        setBlockHash(data.hash)
        setBlockNumber(data.height)
      })
  }, [])

  function resetResults() {
    setItems(items.map(item => ({ ...item, nonce: 0, completed: false, active: false, foundHash: null })))
    setCompleted(false)
  }

  function addItem() {
    if (!newItem) return
    const updated = [...items, {
      id: getNextId(),
      title: newItem,
      nonce: 0,
      active: false,
      completed: false,
      foundHash: null,
    }]
    setItems(updated)
    saveItems(updated)
    setNewItem('')
    setCompleted(false)
  }

  function deleteItem(item) {
    const updated = items.filter(i => i.id !== item.id)
    setItems(updated)
    saveItems(updated)
  }

  function startCountUpdater() {
    function tick() {
      setHashCounts({ ...hashCountsRef.current })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function stopCountUpdater() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  function startWork() {
    setWorking(true)
    setCompleted(false)
    hashCountsRef.current = {}
    setHashCounts({})

    const workingItems = items.map(item => ({ ...item, active: true, completed: false, nonce: 0, foundHash: null }))
    setItems(workingItems)
    startCountUpdater()

    const results = {}
    let doneCount = 0

    workersRef.current.forEach(w => w.terminate())
    workersRef.current = []

    workingItems.forEach(item => {
      const worker = new Worker('/miner-worker.js')
      workersRef.current.push(worker)

      worker.postMessage({
        blockHash,
        title: item.title,
        difficulty,
        id: item.id,
      })

      worker.onmessage = (e) => {
        const { type, id, nonce, foundHash } = e.data

        if (type === 'progress') {
          hashCountsRef.current[id] = nonce
        } else if (type === 'done') {
          hashCountsRef.current[id] = nonce
          results[id] = { nonce, foundHash }
          doneCount++
          worker.terminate()

          if (doneCount === workingItems.length) {
            stopCountUpdater()
            setHashCounts({ ...hashCountsRef.current })
            const finalItems = workingItems.map(it => ({
              ...it,
              active: false,
              completed: true,
              nonce: results[it.id].nonce,
              foundHash: results[it.id].foundHash,
            }))
            setItems(finalItems)
            saveItems(finalItems)
            setWorking(false)
            setCompleted(true)
            workersRef.current = []
          }
        }
      }
    })
  }

  const orderedItems = [...items].sort((a, b) => b.nonce - a.nonce)

  const jsonResult = completed ? JSON.stringify({
    blockHash,
    blockNumber,
    difficulty,
    items,
  }, null, 2) : ''

  return (
    <div>
      <h1>Randomise</h1>
      <p>Add items to your list, then mine to find a winner.</p>

      <div className="card">
        <div className="block-info">
          <div className="block-info-item">
            <div className="block-info-label">Block Height</div>
            <div className="block-info-value">{blockNumber || '...'}</div>
          </div>
          <div className="block-info-item">
            <div className="block-info-label">Block Hash</div>
            <div className="block-info-value">{blockHash || 'Loading...'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={e => { setDifficulty(Number(e.target.value)); resetResults() }}
        >
          <option value={1}>Easy peasy lemon squeezy</option>
          <option value={2}>Easy</option>
          <option value={3}>Medium</option>
          <option value={4}>Hard</option>
          <option value={5}>Difficult</option>
          <option value={6}>Crazy</option>
        </select>

        <div className="mt-16">
          <label>Add items</label>
          <div className="input-group">
            <input
              placeholder="Enter item name..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && addItem()}
            />
            <button className="btn btn-secondary" onClick={addItem}>Add</button>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Nonce</th>
                  <th>Hash</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.map((item, index) => {
                  const isWinner = completed && index === 0
                  return (
                  <tr
                    key={item.id}
                    className={isWinner ? 'row-winner' : item.completed ? 'row-completed' : item.active ? 'row-working' : 'row-waiting'}
                  >
                    <td><strong>{item.title}</strong></td>
                    <td>
                      {isWinner && <span className="badge badge-winner">Winner</span>}
                      {!isWinner && item.completed && <span className="badge badge-success">Done</span>}
                      {item.active && <span className="badge badge-working">Mining</span>}
                      {!item.completed && !item.active && <span className="badge badge-waiting">Waiting</span>}
                    </td>
                    <td>{item.active ? (hashCounts[item.id] || 0).toLocaleString() : item.nonce.toLocaleString()}</td>
                    <td><span className="hash">{item.foundHash || '—'}</span></td>
                    <td>
                      <button className="btn btn-danger" onClick={() => deleteItem(item)}>Remove</button>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-16">
            <button className="btn btn-primary" onClick={startWork} disabled={working || items.length === 0}>
              Find a winner
            </button>
          </div>

          {working && (
            <div className="mining-status mt-16">
              <span className="spinner" />
              <span>Mining... {Object.values(hashCounts).reduce((a, b) => a + b, 0).toLocaleString()} hashes computed</span>
            </div>
          )}
        </div>
      )}

      {completed && (
        <>
          <div className="winner-banner">
            <h1>Winner winner {orderedItems[0].title} dinner!</h1>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label htmlFor="jsonData" style={{ margin: 0 }}>Proof JSON (share this to let others validate)</label>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => {
                  navigator.clipboard.writeText(jsonResult)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
              >
                {copied ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                )}
              </button>
            </div>
            <textarea
              rows={10}
              id="jsonData"
              placeholder="JSON result"
              readOnly
              value={jsonResult}
            />
          </div>
        </>
      )}
    </div>
  )
}
