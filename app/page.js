import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div className="home-hero">
        <h1>Proof of Lunch</h1>
        <p className="subtitle">Reproducible decentralised randomness powered by Bitcoin</p>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p>
          This app produces a deterministic ordering of a list that is unknown in advance and verifiable by all remote participating parties.
        </p>
        <p>
          It uses the Bitcoin Blockchain as a source of entropy. We take the hash of the most recent Bitcoin block and perform{' '}
          <a href="https://en.wikipedia.org/wiki/Proof-of-work_system">Proof of Work</a>{' '}
          on all items in your list. The proof of work function uses three values for each item:
        </p>
        <ul className="feature-list">
          <li>Hash of the most recent Bitcoin Block</li>
          <li>The list item name</li>
          <li><a href="https://en.wikipedia.org/wiki/Cryptographic_nonce">Nonce</a> (incremented until a valid hash is found)</li>
        </ul>
      </div>

      <div className="card">
        <h2>The result</h2>
        <p>
          The item with the highest nonce wins. Because the block hash is public and unpredictable,
          and the proof of work is deterministic, any remote party can validate the result via the{' '}
          <Link href="/validate-work">validate</Link> page.
        </p>
      </div>

      <div className="text-center mt-20">
        <Link href="/proof-of-lunch" className="btn btn-primary">Get started</Link>
      </div>
    </div>
  )
}
