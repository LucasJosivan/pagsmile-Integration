import { toBasicAuth, buildPayoutSignature } from "./crypto.js";
import { t } from "../i18n.js";

export const PAYIN_BASE_URL = {
  sandbox: "https://gateway-test.pagsmile.com",
  live: "https://gateway.pagsmile.com",
};

export const PAYOUT_BASE_URL = {
  sandbox: "https://sandbox.transfersmile.com",
  live: "https://api.transfersmile.com",
};

class ApiError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

async function postJson(url, headers, body) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8", ...headers },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new ApiError(t("network_cors_error"), { cause: String(networkError) });
  }

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  return { httpStatus: response.status, ok: response.ok, body: json };
}

export async function createCheckoutPage(env, payinCreds, payload) {
  const url = `${PAYIN_BASE_URL[env]}/trade/create`;
  const headers = { Authorization: toBasicAuth(payinCreds.appId, payinCreds.securityKey) };
  return postJson(url, headers, payload);
}

export async function submitDirectPayin(env, payinCreds, payload) {
  const url = `${PAYIN_BASE_URL[env]}/trade/pay`;
  const headers = { Authorization: toBasicAuth(payinCreds.appId, payinCreds.securityKey) };
  return postJson(url, headers, payload);
}

export async function submitPayout(env, payoutCreds, payload) {
  const url = `${PAYOUT_BASE_URL[env]}/api/payout`;
  const signature = await buildPayoutSignature(payload, payoutCreds.appKey);
  const headers = { AppId: payoutCreds.appId, Authorization: signature };
  return postJson(url, headers, payload);
}
