export default function PaymentStatusScreen({ result, onContinue, onRetry, onHome }) {
	const success = result.paymentStatus === 'success'
	const failed  = result.paymentStatus === 'failed'

	const gatewayLabel = {
		razorpay: 'Razorpay',
		payu:     'PayU',
		ccavenue: 'CCAvenue',
	}[result.source] ?? result.source

	const timestamp = new Date().toLocaleString('en-IN', {
		day: '2-digit', month: 'short', year: 'numeric',
		hour: '2-digit', minute: '2-digit',
	})

	return (
		<div className="status-page">
			<div className={`status-card payment-card ${success ? 'state-success' : 'state-failed'}`}>

				{/* Icon */}
				<div className={`status-icon ${success ? 'icon-success' : 'icon-failed'}`}>
					{success ? (
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					) : (
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					)}
				</div>

				{/* Heading */}
				<div className="status-heading">
					<h1>{success ? 'Payment Successful' : 'Payment Failed'}</h1>
					{result.source && (
						<span className="gateway-badge">{gatewayLabel}</span>
					)}
				</div>

				{/* Amount (if provided) */}
				{result.amount && (
					<div className="payment-amount">
						<span className="amount-label">Amount Paid</span>
						<span className="amount-value">₹{result.amount}</span>
					</div>
				)}

				{/* Detail rows */}
				<div className="detail-table">
					{result.txnId && (
						<div className="detail-row">
							<span className="detail-key">Transaction ID</span>
							<span className="detail-val mono">{result.txnId}</span>
						</div>
					)}
					{result.orderId && (
						<div className="detail-row">
							<span className="detail-key">Order ID</span>
							<span className="detail-val mono">{result.orderId}</span>
						</div>
					)}
					<div className="detail-row">
						<span className="detail-key">Date & Time</span>
						<span className="detail-val">{timestamp}</span>
					</div>
					<div className="detail-row">
						<span className="detail-key">Status</span>
						<span className={`detail-val status-pill ${success ? 'pill-success' : 'pill-failed'}`}>
							{success ? 'Captured' : 'Failed'}
						</span>
					</div>
				</div>

				{/* Error reason */}
				{failed && result.errorDescription && (
					<div className="error-reason">
						<span className="error-icon">!</span>
						<span>{result.errorDescription}</span>
					</div>
				)}

				{/* Signature warning */}
				{success && result.signature && (
					<div className="info-banner">
						Backend must verify the payment signature before fulfilling the order.
					</div>
				)}

				{/* Actions */}
				<div className="status-actions">
					{success && (
						<button className="btn-primary" onClick={onContinue}>
							{result.screen ? `Go to ${result.screen}` : 'Continue'}
						</button>
					)}
					{failed && (
						<button className="btn-primary" onClick={onRetry}>
							Retry Payment
						</button>
					)}
					<button className="btn-ghost" onClick={onHome}>
						Back to Home
					</button>
				</div>
			</div>
		</div>
	)
}
