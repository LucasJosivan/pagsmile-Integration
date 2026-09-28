# Pagsmile Integration Tester

A local, no-build web page that walks you through Pagsmile's **Payin** and
**Payout** APIs step by step — Sandbox or Live, country, Checkout Page or
Direct Integration, payment method — and fires the real HTTP request so you
can see exactly what Pagsmile returns. It exists to help you learn and
validate the integration before you write your own backend code against it.

> ## ⚠️ Do not deploy this project to a public server
>
> This tool was built as a **local, throwaway testing aid**, not as a
> production-grade application:
>
> - Credentials (App ID / Security Key / App Key) are entered in the browser
>   and stored in plain text in the browser's `localStorage`. There is no
>   encryption, no access control, and no session isolation.
>   Sensitive data on this page is stored and viewed only through browser
>   built-ins and is not sent anywhere by this project, but it is not handled
>   the way a production secret should be handled.
> - All requests are sent **directly from the browser** to Pagsmile's API.
>   Anyone with access to the page (or to the browser's developer tools /
>   network tab) can read the App ID and Security/App Key you configured.
> - There is no authentication in front of this page itself — whoever opens
>   the URL can use whatever credentials are stored in that browser.
>
> **Run it only on `localhost` / your own machine, with Sandbox credentials
> whenever possible.** If you ever need a hosted tool for your team, build a
> proper backend that keeps credentials server-side — do not put this
> project on a public URL, an internal server reachable by others, or any
> hosting platform.

---

## 1. What you need to run it

| Tool | Why | Notes |
|---|---|---|
| A modern web browser | Runs the page (Chrome, Edge, Firefox, Safari) | Needs support for ES Modules and the Fetch API (any browser from the last few years works) |
| A local static file server | Serves the files over `http://` | The page uses JavaScript ES Modules (`import`/`export`), which browsers block on `file://`. Any of these work: <br>• [Node.js](https://nodejs.org/) (`npx serve`) <br>• Python 3 (`python -m http.server`) <br>• The "Live Server" extension in VS Code <br>• Any other static file server you already have |
| A Pagsmile account with API credentials | Needed to actually call the API | Get your App ID / Security Key (Payin) and App ID / App Key (Payout) from your Pagsmile dashboard or account manager. **Use Sandbox credentials for this tool.** |
| Git (optional) | Only if you cloned this repo via Git | Not required if you already have the files locally |

No build step, no `npm install`, no framework — it's plain HTML, CSS and
JavaScript.

## 2. Running it locally

1. Open a terminal in the project folder.
2. Start a static server. Pick one:

   ```bash
   # Option A — Node.js
   npx serve .

   # Option B — Python 3
   python -m http.server 8080
   ```

3. Open the address the terminal prints (typically `http://localhost:3000`
   or `http://localhost:8080`) in your browser.
4. Do **not** open `index.html` by double-clicking it / via `file://` — the
   ES Modules used by this project will fail to load that way.

## 3. Language

The **PT / EN** switch in the header changes the whole interface (labels,
step titles, forms, the credentials hub and error messages) and is saved in
`localStorage`. Country and payment-method names are translated when there
is a natural English equivalent (e.g. "Cartão de Crédito" ↔ "Credit Card");
proper names of methods/wallets (PIX, OXXOPay, Nequi Wallet, etc.) stay the
same in both languages.

## 4. Step-by-step: how the integration flow works

This tool mirrors the real decisions you'll make when integrating Pagsmile.
Each step below links to the official reference for that decision.

### Step 1 — Environment: Sandbox or Live

Pick **Sandbox** while you're building and testing, and only switch to
**Live** once you're ready to move real money. The two environments use
different base URLs and different credentials:

| API | Sandbox | Live |
|---|---|---|
| Payin | `https://gateway-test.pagsmile.com` | `https://gateway.pagsmile.com` |
| Payout | `https://sandbox.transfersmile.com` | `https://api.transfersmile.com` |

### Step 2 — Payin or Payout

- **Payin** — you are collecting a payment from a customer (a checkout).
- **Payout** — you are sending money out to a beneficiary (a payout/transfer).

These are two independent APIs with independent credentials and endpoints;
picking the wrong one is a common integration mistake, which is why this
tool asks for it explicitly and requires the matching credentials before
you can proceed. See:

- Payin — Checkout Page overview: https://docs.pagsmile.com/reference/payin/checkout-page/general
- Payin — Submit a Payin (direct integration): https://docs.pagsmile.com/reference/payin/submit-a-payin
- Payout — Security / request signing: https://docs.pagsmile.com/reference/payout/security
- Payout — Submit a Payout: https://docs.pagsmile.com/reference/payout/submit-a-payout

### Step 3 — Country

Payin and Payout support different sets of countries, and Payin credentials
in this tool are configured **per country** (see [Credentials](#6-credentials)
below), because in practice Pagsmile issues a separate App ID / Security Key
per country/app. Only countries you've configured credentials for (in the
selected environment) will show up here for Payin. The full supported list
for each API is documented at:

- Payin payment methods by country: https://docs.pagsmile.com/reference/payin/data/payment-method
- Payout payment methods by country: https://docs.pagsmile.com/reference/payout/payment-method

### Step 4 — Checkout Page or Direct Integration (Payin only)

Pagsmile offers two ways to integrate a payment, and this choice **only
applies to Payin** — Payout has no hosted page, it's always a direct API
call.

- **Checkout Page** (`POST /trade/create`) — Pagsmile hosts the payment
  page for you; you create an order and redirect the customer to the
  `web_url` Pagsmile returns. This is the fastest way to integrate and the
  one we recommend starting with.
  Docs: https://docs.pagsmile.com/reference/payin/checkout-page/general
- **Direct Integration** (`POST /trade/pay`) — you collect the payment
  details yourself (card token, customer/address data, etc.) and submit
  them directly to Pagsmile's API. This gives you full control over the UI
  but means you're responsible for PCI-relevant data handling for card
  payments.
  Docs: https://docs.pagsmile.com/reference/payin/submit-a-payin

### Step 5 — Payment method

Choose the payment method you want to test (PIX, credit card, boleto,
wallets, bank transfers, etc.) for the selected country. The available
options per country come straight from Pagsmile's reference tables linked
above.

**Checkout Page tip:** the `method` parameter on `/trade/create` is
**optional**. If you select **"All methods"** in this step, the tool omits
`method` from the request entirely, and Pagsmile's hosted Checkout Page will
display every payment method enabled for your account — this is the
recommended default for a real checkout, since it lets the customer pick.
This option is not available for Direct Integration (there, a specific
`method` is required) or for Payout (no Checkout Page exists there).

### Step 6 — Fill in the details and submit

Review/edit the pre-filled sample values (order data, customer/address data,
or beneficiary data for Payout) and submit. The tool sends the actual HTTP
request to Pagsmile and shows you the raw response, so you can compare it
against the documented response shape for that endpoint.

### Step 7 — Result

You'll see:

- A success/error badge and the HTTP status code.
- Key fields extracted from the response (transaction ID, status, etc.).
- A clickable payment link, QR code or copy-paste code when the response
  includes one.
- **If the call failed:** a **Suggestion** box with a best-effort,
  rule-based hint about the likely cause (bad credentials, duplicate order
  ID, amount/currency out of range, missing field, method not enabled for
  your account, Pagsmile-side outage, wrong environment, etc.) based on the
  `code` / `sub_code` / `sub_msg` / HTTP status Pagsmile returned. Treat it
  as a starting point, not a definitive diagnosis — always read the raw
  `msg` / `sub_msg` from Pagsmile shown right below it.
- The full raw JSON response, for direct comparison with the docs.

## 5. Important: CORS and calling the API from the browser

Pagsmile's APIs are designed for **server-to-server** integration. Because
this tool calls them directly from the browser via `fetch`, two things
follow:

1. **CORS** — if Pagsmile's gateway doesn't return
   `Access-Control-Allow-Origin` for the origin this page is served from,
   the browser will block reading the response (the request is still sent;
   only reading the response fails). If you hit this, options are: run a
   small local proxy that forwards the request and adds CORS headers, or
   temporarily disable CORS in your browser for local testing only.
2. **Secret exposure** — any Security Key / App Key you type into this page
   is visible to anyone who can inspect that browser's network traffic or
   `localStorage`. That's the core reason this project must stay local and
   Sandbox-only (see the warning at the top).

When you build your real integration, all of this — the credentials, the
request signing, the API calls — belongs on **your backend**, never in
client-side JavaScript shipped to end users.

## 6. Credentials

Click **Credentials** in the header to open the credentials hub:

- **Payin (per country)** — Pagsmile issues an App ID and Security Key per
  country/app. Pick the country, fill in Sandbox and/or Live (you can set
  both at once) and click "Save country". The list below shows which
  countries already have Sandbox/Live configured, with edit/remove options.
  The country step only lists Payin countries that have credentials saved
  for the currently selected environment, and you can't select the Payin
  flow at all until at least one country is configured for that environment
  — this is meant to prevent confusing failures later in the flow caused by
  missing credentials.
- **Payout (global)** — a single App ID / App Key pair, also with Sandbox
  and Live fillable at the same time (Payout is not per country).

These credentials are stored **only in your browser's `localStorage`** —
this project never sends them anywhere except the official Pagsmile /
Transfersmile endpoints. Still, prefer Sandbox keys here at all times (see
the warning at the top of this document).

## 7. Project structure

```
index.html                    page shell + credentials modal
assets/logo-pagsmile.svg      official logo (dark variant, used on the navy header block)
css/tokens.css                design tokens (colors, spacing, radii) from the Pagsmile Design System
css/styles.css                visual components (stepper, cards, buttons, forms, result, credentials hub, language switch)
js/app.js                     wizard controller (state + step navigation + language switching)
js/i18n.js                    PT/EN dictionary, country/method/message translation helpers, t()
js/core/api.js                HTTP calls for the 3 endpoints (checkout, direct payin, payout)
js/core/crypto.js             Basic Auth (payin) and SHA-256 signing (payout)
js/core/errorSuggestions.js   heuristics that turn an error code/message into a suggestion
js/core/state.js              credential persistence (per country for payin) + helpers (timestamp, ids)
js/data/payinData.js          Payin countries/methods (docs.pagsmile.com/reference/payin/data/payment-method)
js/data/payoutData.js         Payout countries/methods (docs.pagsmile.com/reference/payout/payment-method)
js/ui/dom.js                  small element-creation helpers
js/ui/credentials.js          credentials hub (payin per country + payout global, sandbox/live together)
js/ui/forms.js                form field definitions + payload construction per flow
js/ui/results.js              result rendering (success/error, suggestion, QR/copy-paste, payment link)
```

## 8. Official Pagsmile documentation

Always treat these as the source of truth — this tool is a convenience
layer on top of them, not a replacement:

- Payin — Checkout Page: https://docs.pagsmile.com/reference/payin/checkout-page/general
- Payin — Submit a Payin (direct integration): https://docs.pagsmile.com/reference/payin/submit-a-payin
- Payin — Payment methods by country: https://docs.pagsmile.com/reference/payin/data/payment-method
- Payout — Security / request signing: https://docs.pagsmile.com/reference/payout/security
- Payout — Submit a Payout: https://docs.pagsmile.com/reference/payout/submit-a-payout
- Payout — Payment methods by country: https://docs.pagsmile.com/reference/payout/payment-method
