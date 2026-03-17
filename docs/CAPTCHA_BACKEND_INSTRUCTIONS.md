# CAPTCHA (Cloudflare Turnstile) — Backend Integration Instructions

This document explains precisely what the backend must implement so the CAPTCHA flow (Turnstile) works correctly with the frontend changes. It includes required env vars, header names, verification sequence, expected responses and sample pseudocode for Node/Express and Python/Flask.

Summary
- Frontend: collects a short-lived token from the Turnstile widget and sends it to the backend on sensitive public endpoints (registration and password-reset request) using the `X-Turnstile-Token` HTTP header.
- Backend: must verify the token server-side with Cloudflare before performing the sensitive action. If verification fails, respond with a 400/403 and a clear error.

Required environment variables
- TURNSTILE_SECRET: (server-only) the Turnstile secret key provided by Cloudflare.
- CAPTCHA_ENFORCE: optional boolean (true/false) to enable/disable enforcement.

HTTP contract
- Client -> Server: POST /auth/register or POST /auth/password-reset/request
  - Body: usual fields (email, password, etc.)
  - Header: `X-Turnstile-Token: <token>` (required when CAPTCHA is enforced)
- Server -> Cloudflare Verify: POST https://challenges.cloudflare.com/turnstile/v0/siteverify
  - Form fields: `secret` (TURNSTILE_SECRET), `response` (token)
  - Optional: `remoteip` (client IP) — decide based on privacy policy
- Cloudflare -> Server: JSON response e.g.
  {
    "success": true|false,
    "challenge_ts": "2025-01-01T00:00:00Z",
    "hostname": "example.com",
    "error-codes": ["..." ]
  }

Server-side verification policy
1. Extract token from header: `const token = req.header('X-Turnstile-Token');`
2. If `CAPTCHA_ENFORCE` is true and token is missing: respond 400 { code: 'CAPTCHA_REQUIRED', message: 'CAPTCHA required' }
3. Send POST to Cloudflare verification endpoint with `secret` and `response` (token). Optionally include client IP.
4. If Cloudflare reply `success: true`: proceed with business logic (create account, send reset email)
5. If `success: false`: respond 400 with `{ code: 'CAPTCHA_INVALID', message: 'CAPTCHA verification failed', details: error-codes }`
6. Log verification attempts with (requestId, endpoint, user/email if available, provider error codes) for monitoring and debugging.

Replay / TTL notes
- Turnstile tokens are short-lived and single-use-ish. Always verify token at the time of the sensitive action. Do not try to reuse tokens.

Rate-limiting and anti-abuse
- Track failed verification counts per IP and per account/email. If a client has many failures, throttle/block further attempts.
- Consider progressive measures: after many failed attempts require additional checks (email validation, manual review).

Example pseudocode (Node/Express)

```js
// express route handler
app.post('/auth/password-reset/request', async (req, res) => {
  const token = req.header('X-Turnstile-Token');
  const email = req.body.email;

  if (process.env.CAPTCHA_ENFORCE === 'true' && !token) {
    return res.status(400).json({ code: 'CAPTCHA_REQUIRED', message: 'CAPTCHA required' });
  }

  // Verify with Cloudflare
  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.TURNSTILE_SECRET);
    params.append('response', token);
    // Optional: params.append('remoteip', req.ip);

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params
    });
    const json = await r.json();
    if (!json.success) {
      // Log error-codes for monitoring
      console.warn('Turnstile failed', json['error-codes']);
      return res.status(400).json({ code: 'CAPTCHA_INVALID', message: 'CAPTCHA verification failed', details: json['error-codes'] });
    }

    // Proceed: send reset email (do not leak whether email exists)
    // Your normal password-reset logic here
    return res.status(200).json({ message: 'If a matching account exists, instructions have been sent.' });
  } catch (err) {
    console.error('Turnstile verification error', err);
    // Decide fallback: strict = block, lenient = allow
    if (process.env.CAPTCHA_FAIL_OPEN === 'true') {
      // allow
    } else {
      return res.status(500).json({ code: 'CAPTCHA_VERIFY_ERROR', message: 'CAPTCHA provider error' });
    }
  }
});
```

Example pseudocode (Python / Flask)

```py
from flask import request, jsonify
import requests

@app.route('/auth/password-reset/request', methods=['POST'])
def password_reset_request():
    token = request.headers.get('X-Turnstile-Token')
    email = request.json.get('email')

    if os.getenv('CAPTCHA_ENFORCE') == 'true' and not token:
        return jsonify({'code': 'CAPTCHA_REQUIRED', 'message': 'CAPTCHA required'}), 400

    try:
        resp = requests.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', data={
            'secret': os.getenv('TURNSTILE_SECRET'),
            'response': token,
            # 'remoteip': request.remote_addr,
        })
        data = resp.json()
        if not data.get('success'):
            return jsonify({'code': 'CAPTCHA_INVALID', 'message': 'CAPTCHA verification failed', 'details': data.get('error-codes')}), 400
        # proceed with sending reset email (non-revealing response)
        return jsonify({'message': 'If a matching account exists, instructions have been sent.'})
    except Exception as e:
        # Fallback policy
        if os.getenv('CAPTCHA_FAIL_OPEN') == 'true':
            # proceed
            pass
        else:
            return jsonify({'code': 'CAPTCHA_VERIFY_ERROR', 'message': 'CAPTCHA provider error'}), 500
```

Manual steps you must add on your backend to make the feature functional
1. Add `TURNSTILE_SECRET` to your server environment (never commit it to source). Example: set it in your deployment/Kubernetes secrets or environment manager.
2. Add optional `CAPTCHA_ENFORCE=true` to enforce token presence and verification.
3. On the registration and password-reset endpoints, read header `X-Turnstile-Token` and verify with Cloudflare as shown above before performing the action.
4. Log verification attempts and error codes for observability.
5. Optionally add rate limiting on these endpoints and per-IP failure counters.
6. Update privacy policy to mention Cloudflare Turnstile (purpose: bot mitigation) and whether you include the client IP in verification.

Testing and staging
- Use your Turnstile staging keys (or generate site/secret keys for a staging domain) to validate the end-to-end flow before enabling in production.
- For automated tests, mock the provider (as done in the frontend unit tests) and/or stub the verify call in integration tests.

Observability
- Emit metrics: captcha.verify.success, captcha.verify.failure, captcha.verify.latency
- Alert when failure rate rises or provider is unreachable.

That's it — once you add the server secret and verify tokens server-side, the frontend widget + token forwarding I added will complete the flow.
