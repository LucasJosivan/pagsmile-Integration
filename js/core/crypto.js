export async function sha256Hex(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function toBasicAuth(appId, securityKey) {
  return `Basic ${btoa(`${appId}:${securityKey}`)}`;
}

export async function buildPayoutSignature(params, appKey) {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return sha256Hex(`${sorted}${appKey}`);
}
