import { useState } from 'react'
import './index.css'

const EMBED_URL = 'https://ranjittech9.github.io/url-navigator/'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="wrapper">
      <header className="header">
        <div className="header-left">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <span className="url-bar">{EMBED_URL}</span>
        <a
          className="open-btn"
          href={EMBED_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open ↗
        </a>
      </header>

      <div className="frame-wrap">
        {loading && !error && (
          <div className="overlay">
            <div className="spinner" />
            <p>Loading URL Navigator…</p>
          </div>
        )}
        {error && (
          <div className="overlay error">
            <p>This page cannot be embedded.</p>
            <a href={EMBED_URL} target="_blank" rel="noopener noreferrer">
              Open in new tab ↗
            </a>
          </div>
        )}
        <iframe
          src={EMBED_URL}
          title="URL Navigator"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true) }}
        />
      </div>
    </div>
  )
}
