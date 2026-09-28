const CREDS_KEY = "pagsmile_test_creds_v2";

export function loadCreds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CREDS_KEY));
    return {
      payin: parsed?.payin || {},
      payout: parsed?.payout || {},
    };
  } catch {
    return { payin: {}, payout: {} };
  }
}

export function saveCreds(creds) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}

export function countryKey(country) {
  return country?.code || "GLOBAL";
}

export function getPayinCreds(creds, key, env) {
  const entry = creds.payin?.[key]?.[env];
  if (entry?.appId && entry?.securityKey) return entry;
  return null;
}

export function getPayoutCreds(creds, env) {
  const entry = creds.payout?.[env];
  if (entry?.appId && entry?.appKey) return entry;
  return null;
}

export function listConfiguredPayinKeys(creds, env) {
  return Object.keys(creds.payin || {}).filter((key) => getPayinCreds(creds, key, env));
}

export function upsertPayinCountryCreds(creds, key, { sandbox, live }) {
  return {
    ...creds,
    payin: {
      ...creds.payin,
      [key]: { sandbox, live },
    },
  };
}

export function removePayinCountryCreds(creds, key) {
  const nextPayin = { ...creds.payin };
  delete nextPayin[key];
  return { ...creds, payin: nextPayin };
}

export function setPayoutCreds(creds, { sandbox, live }) {
  return { ...creds, payout: { sandbox, live } };
}

export function timestampNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function randomId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createWizardState() {
  return {
    env: null,
    flow: null,
    country: null,
    integrationType: null,
    method: null,
  };
}
