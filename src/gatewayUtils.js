// Returns the app's base URL — this is what gateways redirect back to
export function appReturnUrl() {
	return `${window.location.origin}${window.location.pathname}`
}

// GET redirect — used for DigiLocker OAuth2
// Builds the gateway URL with your app's return URL injected as redirect_uri / callback_url
export function navigateWithCallback(gatewayUrl, ownParams = {}) {
	const target = new URL(gatewayUrl)
	Object.entries(ownParams).forEach(([k, v]) => target.searchParams.set(k, v))
	window.top.location.href = target.toString()
}

// POST redirect — used for Razorpay, PayU, CCAvenue
// Creates a hidden form, appends it to the DOM, and submits it
// Gateway receives POST fields and redirects browser to surl/callback_url on completion
export function postToGateway(actionUrl, fields = {}) {
	const form = document.createElement('form')
	form.method = 'POST'
	form.action = actionUrl

	Object.entries(fields).forEach(([name, value]) => {
		const input = document.createElement('input')
		input.type  = 'hidden'
		input.name  = name
		input.value = value ?? ''
		form.appendChild(input)
	})

	document.body.appendChild(form)
	form.submit()
}

// Generates a random alphanumeric state token for OAuth2 CSRF protection
export function randomState(len = 16) {
	return Array.from(crypto.getRandomValues(new Uint8Array(len)))
		.map(b => b.toString(36).padStart(2, '0'))
		.join('')
		.slice(0, len)
}
