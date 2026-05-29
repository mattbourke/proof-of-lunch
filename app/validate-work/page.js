'use client'

import { useState } from 'react'
import { sha256 } from '../../lib/sha256'

export default function ValidateWork() {
  const [blockHash, setBlockHash] = useState('')
  const [blockNumber, setBlockNumber] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [items, setItems] = useState([])
  const [jsonData, setJsonData] = useState('')

  async function validateItem() {
    let parsed
    try {
      parsed = JSON.parse(jsonData)
    } catch (e) {
      alert('Invalid JSON')
      return
    }
    setBlockHash(parsed.blockHash)
    setBlockNumber(parsed.blockNumber)
    setDifficulty(parsed.difficulty)

    const validated = await Promise.all(
      parsed.items.map(async (item) => {
        const stringToHash = parsed.blockHash + item.title + item.nonce
        const hash = await sha256(stringToHash)
        return { ...item, validated: hash === item.foundHash }
      })
    )

    setItems(validated)
  }

  const orderedItems = [...items].sort((a, b) => b.nonce - a.nonce)
  const allValid = orderedItems.length > 0 && orderedItems.every(i => i.validated)

  return (
    <div>
      <h1>Validate</h1>
      <p>Paste proof JSON below to independently verify the result.</p>

      <div className="card">
        <label htmlFor="jsonData">Proof JSON</label>
        <textarea
          rows={8}
          id="jsonData"
          placeholder="Paste the JSON proof here..."
          value={jsonData}
          onChange={e => setJsonData(e.target.value)}
        />
        <div className="mt-16">
          <button className="btn btn-primary" onClick={validateItem}>Validate</button>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="card">
            <div className="block-info mb-20">
              <div className="block-info-item">
                <div className="block-info-label">Block Height</div>
                <div className="block-info-value">{blockNumber}</div>
              </div>
              <div className="block-info-item">
                <div className="block-info-label">Block Hash</div>
                <div className="block-info-value">{blockHash}</div>
              </div>
              <div className="block-info-item">
                <div className="block-info-label">Difficulty</div>
                <div className="block-info-value">{difficulty}</div>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Nonce</th>
                    <th>Hash</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedItems.map(item => (
                    <tr
                      key={item.id}
                      className={item.validated ? 'row-validated' : 'row-invalid'}
                    >
                      <td><strong>{item.title}</strong></td>
                      <td>{item.nonce.toLocaleString()}</td>
                      <td><span className="hash">{item.foundHash}</span></td>
                      <td>
                        {item.validated
                          ? <span className="badge badge-success">Valid</span>
                          : <span className="badge" style={{ background: 'rgba(255,71,87,0.2)', color: 'var(--danger)' }}>Invalid</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {allValid && (
            <div className="winner-banner">
              <h1>Winner winner {orderedItems[0].title} dinner!</h1>
            </div>
          )}
        </>
      )}
    </div>
  )
}
