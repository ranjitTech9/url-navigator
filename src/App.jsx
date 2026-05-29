import { useState } from 'react'
import './App.css'

const DEFAULT_URLS = [
  { id: 1, label: 'Google', url: 'https://www.google.com', category: 'Search' },
  { id: 2, label: 'GitHub', url: 'https://www.github.com', category: 'Dev' },
  { id: 3, label: 'YouTube', url: 'https://www.youtube.com', category: 'Media' },
  { id: 4, label: 'MDN Docs', url: 'https://developer.mozilla.org', category: 'Dev' },
  { id: 5, label: 'NPM', url: 'https://www.npmjs.com', category: 'Dev' },
  { id: 6, label: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Dev' },
]

const CATEGORIES = ['All', 'Search', 'Dev', 'Media', 'Custom']

function navigateTo(url) {
  window.top.location.href = url
}

function isValidUrl(str) {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function App() {
  const [urls, setUrls] = useState(DEFAULT_URLS)
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const filtered = urls.filter(item => {
    const matchCat = filter === 'All' || item.category === filter
    const matchSearch =
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleNavigate(item) {
    setHistory(prev => [
      { ...item, visitedAt: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ])
    navigateTo(item.url)
  }

  function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!newLabel.trim()) return setError('Label is required.')
    const raw = newUrl.trim()
    const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`
    if (!isValidUrl(withProtocol)) return setError('Enter a valid URL.')
    setUrls(prev => [
      ...prev,
      { id: Date.now(), label: newLabel.trim(), url: withProtocol, category: 'Custom' },
    ])
    setNewLabel('')
    setNewUrl('')
  }

  function handleDelete(id) {
    if (confirmId === id) {
      setUrls(prev => prev.filter(u => u.id !== id))
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>URL Navigator</h1>
        <p className="subtitle">Navigate to any URL via <code>window.top.location.href</code></p>
      </header>

      <div className="layout">
        <main className="main">
          <div className="toolbar">
            <input
              className="search"
              type="text"
              placeholder="Search URLs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="url-grid">
            {filtered.length === 0 && (
              <p className="empty">No URLs found.</p>
            )}
            {filtered.map(item => (
              <div key={item.id} className="url-card">
                <div className="card-info">
                  <span className="card-label">{item.label}</span>
                  <span className={`badge badge-${item.category.toLowerCase()}`}>{item.category}</span>
                </div>
                <span className="card-url">{item.url}</span>
                <div className="card-actions">
                  <button className="btn-navigate" onClick={() => handleNavigate(item)}>
                    Navigate
                  </button>
                  <button
                    className={`btn-delete ${confirmId === item.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(item.id)}
                    onBlur={() => setConfirmId(null)}
                  >
                    {confirmId === item.id ? 'Confirm?' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="add-section">
            <h2>Add New URL</h2>
            <form className="add-form" onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Label (e.g. My Site)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL (e.g. https://example.com)"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
              />
              <button type="submit" className="btn-add">Add URL</button>
            </form>
            {error && <p className="error">{error}</p>}
          </section>
        </main>

        <aside className="sidebar">
          <h2>Recent Visits</h2>
          {history.length === 0 ? (
            <p className="empty">No visits yet.</p>
          ) : (
            <ul className="history-list">
              {history.map((h, i) => (
                <li key={i} className="history-item" onClick={() => handleNavigate(h)}>
                  <span className="h-label">{h.label}</span>
                  <span className="h-time">{h.visitedAt}</span>
                  <span className="h-url">{h.url}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
