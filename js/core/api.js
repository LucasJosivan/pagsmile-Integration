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

export async function sendRequest({ url, headers, body }) {
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
