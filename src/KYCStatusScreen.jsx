const KYC_STEPS = ['Submit', 'Aadhaar Verify', 'Face Match', 'Complete']

function StepBar({ currentStep }) {
	return (
		<div className="kyc-steps">
			{KYC_STEPS.map((label, i) => {
				const done    = i < currentStep
				const active  = i === currentStep
				const pending = i > currentStep
				return (
					<div key={label} className="kyc-step-item">
						<div className={`kyc-step-dot ${done ? 'dot-done' : active ? 'dot-active' : 'dot-pending'}`}>
							{done ? (
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							) : (
								<span>{i + 1}</span>
							)}
						</div>
						<span className={`kyc-step-label ${pending ? 'label-pending' : ''}`}>{label}</span>
						{i < KYC_STEPS.length - 1 && (
							<div className={`kyc-step-line ${done ? 'line-done' : ''}`} />
						)}
					</div>
				)
			})}
		</div>
	)
}

export default function KYCStatusScreen({ result, onContinue, onRetry, onHome }) {
	const pending  = result.aadharStatus === 'pending_verification'
	const verified = result.aadharStatus === 'verified'
	const failed   = result.aadharStatus === 'failed'

	// step index: 0=Submit, 1=Aadhaar Verify, 2=Face Match, 3=Complete
	const currentStep = verified ? 3 : pending ? 1 : failed ? 1 : 0

	const stateClass = pending ? 'state-pending' : verified ? 'state-success' : 'state-failed'

	return (
		<div className="status-page">
			<div className={`status-card kyc-card ${stateClass}`}>

				{/* Header */}
				<div className="kyc-header">
					<div className="kyc-brand">
						<span className="digilocker-dot" />
						DigiLocker
					</div>
					<span className="kyc-title">Aadhaar KYC Verification</span>
				</div>

				{/* Step progress */}
				<StepBar currentStep={currentStep} />

				{/* Status icon */}
				<div className={`status-icon ${pending ? 'icon-pending' : verified ? 'icon-success' : 'icon-failed'}`}>
					{pending && (
						<svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
							<path d="M12 2a10 10 0 1 0 10 10" />
						</svg>
					)}
					{verified && (
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					)}
					{failed && (
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					)}
				</div>

				{/* Message */}
				<div className="status-heading">
					<h1>
						{pending  && 'Verifying Identity…'}
						{verified && 'KYC Verified'}
						{failed   && 'Verification Failed'}
					</h1>
					<p className="status-sub">
						{pending  && 'Exchanging auth code with DigiLocker. This may take a moment.'}
						{verified && 'Your Aadhaar identity has been successfully verified.'}
						{failed   && 'We could not complete your Aadhaar verification.'}
					</p>
				</div>

				{/* Verified detail rows */}
				{verified && (
					<div className="detail-table">
						{result.aadhaarLast4 && (
							<div className="detail-row">
								<span className="detail-key">Aadhaar</span>
								<span className="detail-val mono">XXXX XXXX {result.aadhaarLast4}</span>
							</div>
						)}
						{result.name && (
							<div className="detail-row">
								<span className="detail-key">Name</span>
								<span className="detail-val">{result.name}</span>
							</div>
						)}
						<div className="detail-row">
							<span className="detail-key">KYC Status</span>
							<span className="detail-val status-pill pill-success">Verified</span>
						</div>
						<div className="detail-row">
							<span className="detail-key">Source</span>
							<span className="detail-val">DigiLocker / UIDAI</span>
						</div>
					</div>
				)}

				{/* Pending auth code info */}
				{pending && result.authCode && (
					<div className="info-banner">
						Auth code received. Your backend must exchange this with DigiLocker to complete verification.
					</div>
				)}

				{/* Error reason */}
				{failed && result.errorDescription && (
					<div className="error-reason">
						<span className="error-icon">!</span>
						<span>{result.errorDescription}</span>
					</div>
				)}

				{/* Actions */}
				<div className="status-actions">
					{verified && (
						<button className="btn-primary" onClick={onContinue}>
							{result.screen ? `Go to ${result.screen}` : 'Continue'}
						</button>
					)}
					{failed && (
						<>
							<button className="btn-primary" onClick={onRetry}>
								Retry Verification
							</button>
							<button className="btn-secondary" onClick={onRetry}>
								Try Another Method
							</button>
						</>
					)}
					{!pending && (
						<button className="btn-ghost" onClick={onHome}>
							Back to Home
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
