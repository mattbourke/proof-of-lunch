import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Proof of Lunch',
  description: 'Verifiable randomness in a decentralised network',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <span className="nav-brand">Proof of Lunch</span>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/proof-of-lunch">Randomise</Link></li>
              <li><Link href="/validate-work">Validate</Link></li>
            </ul>
          </div>
        </nav>
        <main className="page">
          {children}
        </main>
      </body>
    </html>
  )
}
