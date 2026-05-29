import { useState } from 'react'
import './index.css'

const EMBED_URL = 'https://ranjittech9.github.io/url-navigator/'

const THEME = {
	primary: '#606677',
	headerBg: '#e40001',
	headerText: '#FFFFFF',
	tabSelected: '#e40001',
	buttonBackground: '#e40001',
	buttonTextColor: '#FFFFFF',
	background: '#FFFFFF',
	surface: '#F5F5F5',
	text: '#333333',
	textLight: '#888888',
	textSecondary: '#999999',
	border: '#606677',
	inputBackground: '#FFFFFF',
	inputBorder: '#606677',
	labelColor: '#333333',
	cancelButtonBg: '#F5F5F5',
	success: '#4CAF50',
	error: '#D32F2F',
	muted: '#F0F0F0',
}

function buildSrc() {
	const url = new URL(EMBED_URL)
	Object.entries(THEME).forEach(([key, value]) => url.searchParams.set(key, value))
	return url.toString()
}

const SRC = buildSrc()

export default function App() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	return (
		<div className="wrapper">
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
						<a href={SRC} target="_blank" rel="noopener noreferrer">
							Open in new tab ↗
						</a>
					</div>
				)}
				<iframe
					src={SRC}
					title="URL Navigator"
					onLoad={() => setLoading(false)}
					onError={() => { setLoading(false); setError(true) }}
				/>
			</div>
		</div>
	)
}
