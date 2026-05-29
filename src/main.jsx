import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
;(function applyTheme() {
	const p = new URLSearchParams(window.location.search)
	const root = document.documentElement
	const set = (param, prop) => { const v = p.get(param); if (v) root.style.setProperty(prop, v) }

	set('primary', '--color-primary')
	set('headerBg', '--color-header-bg')
	set('headerText', '--color-header-text')
	set('tabSelected', '--color-tab-selected')
	set('buttonBackground', '--color-button-background')
	set('buttonTextColor', '--color-button-text-color')
	set('background', '--color-background')
	set('surface', '--color-surface')
	set('text', '--color-text')
	set('textLight', '--color-text-light')
	set('textSecondary', '--color-text-secondary')
	set('border', '--color-border')
	set('inputBackground', '--color-input-background')
	set('inputBorder', '--color-input-border')
	set('labelColor', '--color-label-color')
	set('cancelButtonBg', '--color-cancel-button-bg')
	set('success', '--color-success')
	set('error', '--color-error')
	set('muted', '--color-muted')

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
