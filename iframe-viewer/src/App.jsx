import { useState } from 'react'
import './index.css'

const EMBED_URL = 'https://ranjittech9.github.io/url-navigator/'

const DEFAULTS = {
	primary:    '#0ea5e9',
	secondary:  '#6366f1',
	border:     '#334155',
	text:       '#e2e8f0',
	fontFamily: '',
}

function buildSrc(theme) {
	const url = new URL(EMBED_URL)
	url.searchParams.set('primary',   theme.primary)
	url.searchParams.set('secondary', theme.secondary)
	url.searchParams.set('border',    theme.border)
	url.searchParams.set('text',      theme.text)
	if (theme.fontFamily.trim()) url.searchParams.set('fontFamily', theme.fontFamily.trim())
	return url.toString()
}

const COLOR_FIELDS = [
	{ key: 'primary',   label: 'Primary' },
	{ key: 'secondary', label: 'Secondary' },
	{ key: 'border',    label: 'Border' },
	{ key: 'text',      label: 'Text' },
]

export default function App() {
	const [theme, setTheme]         = useState(DEFAULTS)
	const [appliedSrc, setAppliedSrc] = useState(buildSrc(DEFAULTS))
	const [loading, setLoading]     = useState(true)
	const [error, setError]         = useState(false)

	const set = (key, val) => setTheme(prev => ({ ...prev, [key]: val }))

	function handleApply() {
		setLoading(true)
		setError(false)
		setAppliedSrc(buildSrc(theme))
	}

	function handleReset() {
		setTheme(DEFAULTS)
		setLoading(true)
		setError(false)
		setAppliedSrc(buildSrc(DEFAULTS))
	}

	return (
		<div className="wrapper">
			<aside className="theme-panel">
				<p className="panel-title">Theme</p>

				{COLOR_FIELDS.map(({ key, label }) => (
					<label className="color-row" key={key}>
						<span className="field-label">{label}</span>
						<div className="color-input-wrap">
							<input
								type="color"
								value={theme[key]}
								onChange={e => set(key, e.target.value)}
							/>
							<span className="hex-val">{theme[key]}</span>
						</div>
					</label>
				))}

				<label className="font-row">
					<span className="field-label">Font Family</span>
					<input
						type="text"
						placeholder="e.g. Roboto"
						value={theme.fontFamily}
						onChange={e => set('fontFamily', e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleApply()}
					/>
				</label>

				<div className="panel-actions">
					<button className="apply-btn" onClick={handleApply}>Apply</button>
					<button className="reset-btn" onClick={handleReset}>Reset</button>
				</div>
			</aside>

			<div className="frame-wrap">
				{loading && !error && (
					<div className="overlay">
						<div className="spinner" />
						<p>Loading…</p>
					</div>
				)}
				{error && (
					<div className="overlay error">
						<p>This page cannot be embedded.</p>
						<a href={appliedSrc} target="_blank" rel="noopener noreferrer">
							Open in new tab ↗
						</a>
					</div>
				)}
				<iframe
					src={appliedSrc}
					title="URL Navigator"
					onLoad={() => setLoading(false)}
					onError={() => { setLoading(false); setError(true) }}
				/>
			</div>
		</div>
	)
}
