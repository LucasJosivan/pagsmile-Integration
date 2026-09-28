import { t } from "../i18n.js";

export function getErrorSuggestion({ httpStatus, body }) {
  const subCode = (body?.sub_code || "").toLowerCase();
  const subMsg = (body?.sub_msg || body?.msg || "").toLowerCase();
  const haystack = `${subCode} ${subMsg}`;

  if (httpStatus === 401 || httpStatus === 403 || haystack.includes("signature") || haystack.includes("auth")) {
    return t("suggestion_auth");
  }
  if (haystack.includes("duplicate")) {
    return t("suggestion_duplicate");
  }
  if (haystack.includes("amount")) {
    return t("suggestion_amount");
  }
  if (haystack.includes("currency")) {
    return t("suggestion_currency");
  }
  if (haystack.includes("method") || haystack.includes("channel")) {
    return t("suggestion_method");
  }
  if (haystack.includes("missing") || haystack.includes("required")) {
    return t("suggestion_missing");
  }
  if (haystack.includes("invalid")) {
    return t("suggestion_invalid");
  }
  if (httpStatus >= 500) {
    return t("suggestion_5xx");
  }
  if (httpStatus === 404) {
    return t("suggestion_404");
  }
  if (httpStatus === 400) {
    return t("suggestion_400_generic");
  }
  return t("suggestion_generic");
}
