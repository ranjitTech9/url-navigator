import { useState } from 'react'
import { postToGateway, appReturnUrl } from './gatewayUtils'

// Gateway endpoint configs
const GATEWAYS = {
	razorpay: {
		label:      'Razorpay',
		actionUrl:  'https://api.razorpay.com/v1/checkout/embedded',
		env:        { test: 'rzp_test_...', live: 'rzp_live_...' },
		hashNote:   false,
	},
	payu: {
		label:      'PayU',
		actionUrl:  'https://secure.payu.in/_payment',
		testUrl:    'https://test.payu.in/_payment',
		env:        { test: 'Test merchant key from PayU dashboard', live: 'Live merchant key' },
		hashNote:   true,   // sha512 hash requires backend — show warning
	},
	ccavenue: {
		label:      'CCAvenue',
		actionUrl:  'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
		testUrl:    'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
		env:        { test: 'Test merchant ID from CCAvenue dashboard', live: 'Live merchant ID' },
		hashNote:   true,
	},
}

function buildFields(gateway, cfg) {
	const returnUrl = appReturnUrl()

	if (gateway === 'razorpay') {
		return {
			key_id:       cfg.apiKey,
			order_id:     cfg.orderId,       // must be created on backend first
			amount:       String(Number(cfg.amount) * 100), // paise
			currency:     'INR',
			name:         cfg.productInfo,
			description:  cfg.productInfo,
			prefill_name:  cfg.customerName,
			prefill_email: cfg.email,
			prefill_contact: cfg.phone,
			callback_url: returnUrl,         // Razorpay POSTs back here on success
			cancel_url:   returnUrl,
		}
	}

	if (gateway === 'payu') {
		return {
			key:          cfg.apiKey,
			txnid:        cfg.orderId || `TXN_${Date.now()}`,
			amount:       cfg.amount,
			productinfo:  cfg.productInfo,
			firstname:    cfg.customerName,
			email:        cfg.email,
			phone:        cfg.phone,
			surl:         returnUrl,         // success redirect
			furl:         returnUrl,         // failure redirect
			hash:         cfg.hash || '',    // ⚠ must be generated on your backend
		}
	}

	if (gateway === 'ccavenue') {
		return {
			merchant_id:     cfg.apiKey,
			order_id:        cfg.orderId || `ORD_${Date.now()}`,
			amount:          cfg.amount,
			currency:        'INR',
			redirect_url:    returnUrl,
			cancel_url:      returnUrl,
			billing_name:    cfg.customerName,
			billing_email:   cfg.email,
			billing_tel:     cfg.phone,
			merchant_param1: cfg.productInfo,
			// encrypted_data must be generated on your backend
		}
	}

	return {}
}

export default function PaymentInitiator() {
	const [gateway,  setGateway]  = useState('razorpay')
	const [useTest,  setUseTest]  = useState(true)
	const [cfg, setCfg] = useState({
		apiKey:       '',
		orderId:      '',
		amount:       '',
		productInfo:  '',
		customerName: '',
		email:        '',
		phone:        '',
		hash:         '',
	})
	const [errors, setErrors] = useState({})

	const gw = GATEWAYS[gateway]

	function set(key, val) { setCfg(prev => ({ ...prev, [key]: val })) }

	function validate() {
		const e = {}
		if (!cfg.apiKey.trim())      e.apiKey      = 'Required'
		if (!cfg.amount.trim() || isNaN(Number(cfg.amount))) e.amount = 'Enter a valid amount'
		if (!cfg.productInfo.trim()) e.productInfo  = 'Required'
		if (!cfg.customerName.trim()) e.customerName = 'Required'
		if (!cfg.email.includes('@')) e.email        = 'Enter a valid email'
		if (gw.hashNote && !cfg.hash.trim()) e.hash = 'Hash is required — generate on your backend'
		return e
	}

	function handlePay(e) {
		e.preventDefault()
		const errs = validate()
		if (Object.keys(errs).length) { setErrors(errs); return }
		setErrors({})

		const actionUrl = (useTest && gw.testUrl) ? gw.testUrl : gw.actionUrl
		const fields    = buildFields(gateway, cfg)
		postToGateway(actionUrl, fields)
	}

	return (
		<section className="initiator-card">
			<div className="initiator-header">
				<h2>Initiate Payment</h2>
				<div className="env-toggle">
					<button
						className={`env-btn ${useTest ? 'active' : ''}`}
						onClick={() => setUseTest(true)}
						type="button"
					>Test</button>
					<button
						className={`env-btn ${!useTest ? 'active' : ''}`}
						onClick={() => setUseTest(false)}
						type="button"
					>Live</button>
				</div>
			</div>

			{/* Gateway tabs */}
			<div className="gw-tabs">
				{Object.entries(GATEWAYS).map(([key, g]) => (
					<button
						key={key}
						type="button"
						className={`gw-tab ${gateway === key ? 'active' : ''}`}
						onClick={() => { setGateway(key); setErrors({}) }}
					>
						{g.label}
					</button>
				))}
			</div>

			{gw.hashNote && (
				<div className="warn-banner">
					<strong>Backend required:</strong> {gw.label} needs a server-generated
					SHA-512 hash before the form can be submitted. Generate it on your backend
					and paste it in the Hash field below.
				</div>
			)}

			<form className="initiator-form" onSubmit={handlePay}>
				<div className="form-row">
					<label>
						{gw.label} API Key
						<input
							placeholder={useTest ? gw.env.test : gw.env.live}
							value={cfg.apiKey}
							onChange={e => set('apiKey', e.target.value)}
						/>
						{errors.apiKey && <span className="field-err">{errors.apiKey}</span>}
					</label>
					<label>
						Amount (₹)
						<input
							placeholder="499"
							value={cfg.amount}
							onChange={e => set('amount', e.target.value)}
						/>
						{errors.amount && <span className="field-err">{errors.amount}</span>}
					</label>
				</div>

				<div className="form-row">
					<label>
						Order / Txn ID
						<input
							placeholder="Auto-generated if blank"
							value={cfg.orderId}
							onChange={e => set('orderId', e.target.value)}
						/>
					</label>
					<label>
						Product / Description
						<input
							placeholder="Subscription Plan"
							value={cfg.productInfo}
							onChange={e => set('productInfo', e.target.value)}
						/>
						{errors.productInfo && <span className="field-err">{errors.productInfo}</span>}
					</label>
				</div>

				<div className="form-row">
					<label>
						Customer Name
						<input
							placeholder="Ranjit Kumar"
							value={cfg.customerName}
							onChange={e => set('customerName', e.target.value)}
						/>
						{errors.customerName && <span className="field-err">{errors.customerName}</span>}
					</label>
					<label>
						Email
						<input
							type="email"
							placeholder="ranjit@finspring.ai"
							value={cfg.email}
							onChange={e => set('email', e.target.value)}
						/>
						{errors.email && <span className="field-err">{errors.email}</span>}
					</label>
				</div>

				<div className="form-row">
					<label>
						Phone
						<input
							placeholder="9876543210"
							value={cfg.phone}
							onChange={e => set('phone', e.target.value)}
						/>
					</label>

					{gw.hashNote && (
						<label>
							Hash <span className="label-note">(from backend)</span>
							<input
								placeholder="sha512 hash"
								value={cfg.hash}
								onChange={e => set('hash', e.target.value)}
							/>
							{errors.hash && <span className="field-err">{errors.hash}</span>}
						</label>
					)}
				</div>

				<div className="initiator-footer">
					<div className="return-url-preview">
						<span className="return-label">Return URL</span>
						<code>{appReturnUrl()}</code>
					</div>
					<button type="submit" className="btn-pay">
						Pay ₹{cfg.amount || '0'} via {gw.label}
					</button>
				</div>
			</form>
		</section>
	)
}
