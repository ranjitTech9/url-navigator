import { useState } from 'react'
import { navigateWithCallback, appReturnUrl, randomState } from './gatewayUtils'

// DigiLocker OAuth2 authorization endpoint
const DIGILOCKER_URL = 'https://digilocker.meripehchaan.gov.in/oauth2/1/authorize'

// Aadhaar eKYC via UIDAI sandbox
const UIDAI_SANDBOX_URL = 'https://developer.uidai.gov.in/uidotp/2.5'

const PROVIDERS = {
	digilocker: { label: 'DigiLocker',   color: '#f97316' },
	uidai:      { label: 'UIDAI eKYC',   color: '#3b82f6' },
}

export default function KYCInitiator() {
	const [provider, setProvider] = useState('digilocker')
	const [clientId, setClientId] = useState('')
	const [scope,    setScope]    = useState('openid')
	const [error,    setError]    = useState('')

	function handleStartKYC(e) {
		e.preventDefault()
		setError('')
		if (!clientId.trim()) { setError('Client ID is required.'); return }

		const state      = randomState()          // CSRF token
		const returnUrl  = appReturnUrl()

		if (provider === 'digilocker') {
			// DigiLocker redirects back to redirect_uri with ?code=AUTH_CODE&state=STATE
			// Your backend then exchanges code → access_token → pulls Aadhaar XML
			navigateWithCallback(DIGILOCKER_URL, {
				response_type: 'code',
				client_id:     clientId,
				redirect_uri:  returnUrl,
				state,
				scope,
			})
		}

		if (provider === 'uidai') {
			// UIDAI sandbox — adjust for your actual integration
			navigateWithCallback(UIDAI_SANDBOX_URL, {
				client_id:    clientId,
				redirect_uri: returnUrl,
				state,
			})
		}
	}

	return (
		<section className="initiator-card">
			<div className="initiator-header">
				<h2>Initiate KYC</h2>
				<span className="kyc-badge">OAuth2 / eKYC</span>
			</div>

			{/* Provider tabs */}
			<div className="gw-tabs">
				{Object.entries(PROVIDERS).map(([key, p]) => (
					<button
						key={key}
						type="button"
						className={`gw-tab ${provider === key ? 'active' : ''}`}
						style={provider === key ? { borderColor: p.color, color: p.color } : {}}
						onClick={() => { setProvider(key); setError('') }}
					>
						{p.label}
					</button>
				))}
			</div>

			<div className="info-banner" style={{ marginBottom: 0 }}>
				{provider === 'digilocker' && (
					<>
						DigiLocker redirects back with <code>?code=AUTH_CODE</code>.
						Your backend exchanges the code for an access token, then fetches
						the Aadhaar XML from DigiLocker's Drive API.
					</>
				)}
				{provider === 'uidai' && (
					<>
						UIDAI eKYC uses OTP-based authentication. The client_id and redirect
						flow are configured in the UIDAI developer portal.
					</>
				)}
			</div>

			<form className="initiator-form" onSubmit={handleStartKYC}>
				<div className="form-row">
					<label>
						Client ID
						<input
							placeholder="From DigiLocker / UIDAI developer portal"
							value={clientId}
							onChange={e => setClientId(e.target.value)}
						/>
					</label>

					{provider === 'digilocker' && (
						<label>
							Scope
							<input
								placeholder="openid"
								value={scope}
								onChange={e => setScope(e.target.value)}
							/>
							<span className="label-note">Space-separated. e.g. openid profile</span>
						</label>
					)}
				</div>

				{error && <p className="field-err" style={{ marginTop: 0 }}>{error}</p>}

				<div className="initiator-footer">
					<div className="return-url-preview">
						<span className="return-label">Redirect URI</span>
						<code>{appReturnUrl()}</code>
					</div>
					<button type="submit" className="btn-kyc">
						Verify with {PROVIDERS[provider].label}
					</button>
				</div>
			</form>
		</section>
	)
}
