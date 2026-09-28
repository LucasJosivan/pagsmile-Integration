import { PAYIN_BASE_URL, PAYOUT_BASE_URL } from "./api.js";
import { toBasicAuth, buildPayoutSignature } from "./crypto.js";
import { timestampNow } from "./state.js";
import {
  checkoutFields,
  directPayinFields,
  payoutFields,
  buildCheckoutPayload,
  buildDirectPayinPayload,
  buildPayoutPayload,
} from "../ui/forms.js";

export const PLACEHOLDER_PAYIN_CREDS = { appId: "<APP_ID>", securityKey: "<SECURITY_KEY>" };
export const PLACEHOLDER_PAYOUT_CREDS = { appId: "<APP_ID>", appKey: "<APP_KEY>" };
export const PLACEHOLDER_COUNTRY = { code: "<COUNTRY>", name: "<COUNTRY>", currency: "<CURRENCY>" };
export const PLACEHOLDER_METHOD = { method: "<METHOD>", label: "<METHOD>" };

// Fields shared by both Payin integration types (checkout & direct), used to
// build a representative body while the integration type isn't chosen yet.
const COMMON_PAYIN_KEYS = ["out_trade_no", "order_amount", "order_currency", "subject", "content", "buyer_id", "notify_url"];

function defaultValuesFrom(fieldsDef) {
  return Object.fromEntries(fieldsDef.map((f) => [f.key, f.value]));
}

/**
 * Builds the {url, headers, body} for the current wizard selection. Any part
 * of the wizard that hasn't been chosen yet (country, method, integration
 * type, credentials) is filled with an <ANGLE_BRACKET> placeholder so a live
 * preview (cURL / code snippets) can be shown progressively, starting right
 * after the Payin/Payout choice.
 */
export async function buildRequestSpec({ flow, integrationType, env, country, methodInfo, values, payinCreds, payoutCreds }) {
  const effEnv = env || "sandbox";
  const effCountry = country || PLACEHOLDER_COUNTRY;
  const effMethod = methodInfo || PLACEHOLDER_METHOD;

  if (flow === "payin") {
    const creds = payinCreds || PLACEHOLDER_PAYIN_CREDS;
    const headers = { Authorization: toBasicAuth(creds.appId, creds.securityKey) };
    const ctx = { country: effCountry, methodInfo: effMethod, payinCreds: creds };

    if (!integrationType) {
      // Checkout vs. direct changes the payload shape too much to guess;
      // show only the fields both integration types have in common.
      const commonDef = checkoutFields(ctx).filter((f) => COMMON_PAYIN_KEYS.includes(f.key));
      const body = {
        app_id: creds.appId,
        timestamp: timestampNow(),
        method: effMethod.method,
        ...defaultValuesFrom(commonDef),
      };
      if (effMethod.channel) body.channel = effMethod.channel;
      const url = `${PAYIN_BASE_URL[effEnv]}/trade/<create-ou-pay>`;
      return { url, headers, body };
    }

    const isCheckout = integrationType === "checkout";
    const url = `${PAYIN_BASE_URL[effEnv]}${isCheckout ? "/trade/create" : "/trade/pay"}`;
    const fieldsDef = isCheckout ? checkoutFields(ctx) : directPayinFields(ctx);
    const mergedValues = { ...defaultValuesFrom(fieldsDef), ...(values || {}) };
    const body = isCheckout ? buildCheckoutPayload(mergedValues, ctx) : buildDirectPayinPayload(mergedValues, ctx);
    return { url, headers, body };
  }

  const creds = payoutCreds || PLACEHOLDER_PAYOUT_CREDS;
  const ctx = { country: effCountry, methodInfo: effMethod };
  const fieldsDef = payoutFields(ctx);
  const mergedValues = { ...defaultValuesFrom(fieldsDef), ...(values || {}) };
  const url = `${PAYOUT_BASE_URL[effEnv]}/api/payout`;
  const body = buildPayoutPayload(mergedValues, ctx);
  const signature = await buildPayoutSignature(body, creds.appKey);
  return { url, headers: { AppId: creds.appId, Authorization: signature }, body };
}
