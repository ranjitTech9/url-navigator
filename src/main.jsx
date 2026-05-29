import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply client theme from URL params before first render (no FOUC)
;(function applyTheme() {
  const p = new URLSearchParams(window.location.search)
  const root = document.documentElement
  const set = (param, prop) => { const v = p.get(param); if (v) root.style.setProperty(prop, v) }

  set('primary',   '--color-primary')
  set('secondary', '--color-secondary')
  set('border',    '--color-border')
  set('text',      '--color-text')

  const font = p.get('fontFamily')
  if (font) {
    root.style.setProperty('--font-family', font)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;600;700&display=swap`
    document.head.appendChild(link)
  }
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
