import { timestampNow, randomId } from "../core/state.js";
import { t, translateMethodLabel } from "../i18n.js";
import { PAYIN_TEST_DATA, findPayoutScenario } from "../data/docs/testData.js";

const GENERIC_PAYIN_TEST_DATA = { docType: "CPF", docNumber: "12345678909", phone: "+5511999999999", zip: "01310-100" };

// Document types accepted per country, from https://docs.pagsmile.com/reference/country-info
const DOCUMENT_TYPE_OPTIONS = {
  ARG: ["DNI", "CUIT", "CUIL", "CDI"],
  BRA: ["CPF", "CNPJ"],
  CHL: ["RUT", "RUN"],
  COL: ["CC", "NIT"],
  ECU: ["CI", "RUC"],
  MEX: ["RFC", "CURP"],
  PER: ["DNI", "RUC"],
};
const DEFAULT_DOCUMENT_TYPES = ["CPF", "CNPJ", "DNI", "RUC", "CC", "PASSPORT"];

// Common settlement currencies for the merchant's own balance (source_currency).
const SOURCE_CURRENCY_OPTIONS = ["USD", "EUR", "CNY", "GBP", "HKD", "BRL"];

const PHONE_PATTERN = "^\\+[1-9]\\d{6,14}$";
const AMOUNT_PATTERN = "^\\d+(\\.\\d{1,2})?$";
const ID_PATTERN = "^[A-Za-z0-9_-]+$";

function testDataFor(countryCode) {
  return PAYIN_TEST_DATA[countryCode] || GENERIC_PAYIN_TEST_DATA;
}

function documentTypeOptions(countryCode) {
  return (DOCUMENT_TYPE_OPTIONS[countryCode] || DEFAULT_DOCUMENT_TYPES).map((v) => ({ value: v, label: v }));
}

function methodExtraFields(methodInfo, countryCode) {
  const m = methodInfo.method;
  const extras = [];
  if (m === "CreditCard" || m === "DebitCard") {
    const card = testDataFor(countryCode).cards?.[0];
    extras.push(
      { key: "token", label: t("field_token"), value: card ? card.number : "tok_test_4111111111111111", required: true, hint: t("field_hint_token") },
      { key: "fingerprint", label: t("field_fingerprint"), value: "fp_test_demo", required: true, hint: t("field_hint_fingerprint") },
      { key: "issuer", label: t("field_issuer"), value: (card?.issuer || "visa").toLowerCase(), required: true, hint: t("field_hint_issuer") },
      { key: "installments", label: t("field_installments"), type: "number", value: "1", min: "1", step: "1", hint: t("field_hint_installments") },
      { key: "user_ip", label: t("field_user_ip"), value: "127.0.0.1", required: true, hint: t("field_hint_user_ip") }
    );
  }
  if (["DepositExpress", "Cash", "BankTransfer", "Khipu"].includes(m)) {
    extras.push({ key: "bank", label: t("field_bank"), value: "001", hint: t("field_hint_bank") });
  }
  if (["Cash", "BankTransfer"].includes(m)) {
    extras.push({ key: "language_code", label: t("field_language_code"), value: "pt", hint: t("field_hint_language_code") });
  }
  return extras;
}

export function checkoutFields(ctx) {
  const { country, methodInfo } = ctx;
  const label = translateMethodLabel(methodInfo);
  return [
    { key: "out_trade_no", label: t("field_out_trade_no"), value: randomId("order"), required: true, pattern: ID_PATTERN, hint: t("field_hint_out_trade_no") },
    { key: "order_amount", label: t("field_order_amount"), value: "10.00", required: true, pattern: AMOUNT_PATTERN, inputMode: "decimal", hint: t("field_hint_amount_value") },
    { key: "order_currency", label: t("field_order_currency"), value: country.currency, required: true, readOnly: true, hint: t("field_hint_order_currency") },
    { key: "subject", label: t("field_subject"), value: t("default_subject", { label }), required: true, maxLength: "127", hint: t("field_hint_subject") },
    { key: "content", label: t("field_content"), value: t("default_content", { label }), hint: t("field_hint_content") },
    { key: "buyer_id", label: t("field_buyer_id"), value: randomId("buyer"), required: true, pattern: ID_PATTERN, hint: t("field_hint_buyer_id") },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/pagsmile", type: "url", required: true, hint: t("field_hint_notify_url") },
    { key: "return_url", label: t("field_return_url"), value: "https://example.com/retorno", type: "url", hint: t("field_hint_return_url") },
    { key: "timeout_express", label: t("field_timeout_express"), value: "90m", pattern: "^\\d+[mh]$", hint: t("field_hint_timeout_express") },
    ...(country.code ? [] : [{ key: "regions", label: t("field_regions"), value: "BRA", hint: t("field_hint_regions") }]),
  ];
}

export function directPayinFields(ctx) {
  const { country, methodInfo } = ctx;
  const label = translateMethodLabel(methodInfo);
  const testData = testDataFor(country.code);
  const docTypeOptions = documentTypeOptions(country.code);
  const defaultDocType = (testData.docType || "CPF").split("/")[0].split(" ")[0];
  const base = [
    { key: "out_trade_no", label: t("field_out_trade_no"), value: randomId("order"), required: true, pattern: ID_PATTERN, hint: t("field_hint_out_trade_no") },
    { key: "order_amount", label: t("field_order_amount"), value: "10.00", required: true, pattern: AMOUNT_PATTERN, inputMode: "decimal", hint: t("field_hint_amount_value") },
    { key: "order_currency", label: t("field_order_currency"), value: country.currency, required: true, readOnly: true, hint: t("field_hint_order_currency") },
    { key: "subject", label: t("field_subject"), value: t("default_subject", { label }), required: true, maxLength: "127", hint: t("field_hint_subject") },
    { key: "content", label: t("field_content"), value: t("default_content", { label }), hint: t("field_hint_content") },
    { key: "buyer_id", label: t("field_buyer_id"), value: randomId("buyer"), required: true, pattern: ID_PATTERN, hint: t("field_hint_buyer_id") },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/pagsmile", type: "url", required: true, hint: t("field_hint_notify_url") },
    { key: "customer.name", label: t("field_customer_name"), value: "Maria da Silva", required: true, hint: t("field_hint_customer_name") },
    { key: "customer.email", label: t("field_customer_email"), value: "maria@example.com", type: "email", required: true, hint: t("field_hint_customer_email") },
    { key: "customer.phone", label: t("field_customer_phone"), value: testData.phone || "+5511999999999", type: "tel", pattern: PHONE_PATTERN, required: true, hint: t("field_hint_customer_phone") },
    { key: "customer.identify.number", label: t("field_customer_doc_number"), value: (testData.docNumber || "12345678909").split(" ")[0], required: true, hint: t("field_hint_customer_doc_number") },
    { key: "customer.identify.type", label: t("field_customer_doc_type"), type: "select", options: docTypeOptions,
      value: docTypeOptions.some((o) => o.value === defaultDocType) ? defaultDocType : docTypeOptions[0].value,
      required: true, hint: t("field_hint_customer_doc_type") },
    { key: "address.zip_code", label: t("field_address_zip"), value: testData.zip || "01310-100", required: true, hint: t("field_hint_address_zip") },
    { key: "address.state", label: t("field_address_state"), value: "SP", required: true, hint: t("field_hint_address_state") },
    { key: "address.city", label: t("field_address_city"), value: "São Paulo", required: true, hint: t("field_hint_address_city") },
    { key: "address.street", label: t("field_address_street"), value: "Av. Paulista", required: true, hint: t("field_hint_address_street") },
    { key: "address.street_number", label: t("field_address_street_number"), value: "1000", required: true, hint: t("field_hint_address_street_number") },
    ...(country.code ? [] : [{ key: "region", label: t("field_region"), value: "BRA", hint: t("field_hint_region") }]),
  ];
  return base.concat(methodExtraFields(methodInfo, country.code));
}

export function payoutFields(ctx) {
  const { country, methodInfo, resultScenario = "paid" } = ctx;
  const scenario = findPayoutScenario(country.code, methodInfo, resultScenario) || {};
  const docTypeOptions = documentTypeOptions(country.code);
  return [
    { key: "result_scenario", label: t("field_result_scenario"), type: "select", value: resultScenario, required: true,
      hint: t("field_hint_result_scenario"),
      options: [
        { value: "paid", label: t("field_result_scenario_paid") },
        { value: "rejected", label: t("field_result_scenario_rejected") },
      ] },
    { key: "custom_code", label: t("field_custom_code"), value: randomId("payout"), required: true, pattern: ID_PATTERN, hint: t("field_hint_custom_code") },
    { key: "name", label: t("field_beneficiary_name"), value: "João Souza", required: true, hint: t("field_hint_beneficiary_name") },
    { key: "phone", label: t("field_phone"), value: "+5511999999999", type: "tel", pattern: PHONE_PATTERN, hint: t("field_hint_phone") },
    { key: "email", label: t("field_email"), value: "joao@example.com", type: "email", hint: t("field_hint_email") },
    { key: "account", label: t("field_account"), value: scenario.account || "12345-6", required: true, hint: t("field_hint_account") },
    { key: "account_type", label: t("field_account_type"), value: "CHECKING", required: true, hint: t("field_hint_account_type") },
    { key: "document_id", label: t("field_document_id"), value: scenario.document_id || "12345678909", required: true, hint: t("field_hint_document_id") },
    { key: "document_type", label: t("field_document_type"), type: "select", options: docTypeOptions, value: docTypeOptions[0].value, required: true, hint: t("field_hint_document_type") },
    { key: "fee_bear", label: t("field_fee_bear"), type: "select", value: "merchant", hint: t("field_hint_fee_bear"),
      options: [
        { value: "merchant", label: t("field_fee_bear_merchant") },
        { value: "beneficiary", label: t("field_fee_bear_beneficiary") },
      ] },
    { key: "amount", label: t("field_amount"), value: "10.00", required: true, pattern: AMOUNT_PATTERN, inputMode: "decimal", hint: t("field_hint_amount_value") },
    { key: "source_currency", label: t("field_source_currency"), type: "select", value: "USD", required: true,
      options: SOURCE_CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })), hint: t("field_hint_source_currency") },
    { key: "arrival_currency", label: t("field_arrival_currency"), value: country.currency, required: true, readOnly: true, hint: t("field_hint_arrival_currency") },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/payout", type: "url", required: true, hint: t("field_hint_notify_url") },
    { key: "additional_remark", label: t("field_additional_remark"), value: t("default_additional_remark"), maxLength: "40", hint: t("field_hint_additional_remark") },
  ];
}

export function buildCheckoutPayload(values, ctx) {
  const { methodInfo, payinCreds } = ctx;
  const { regions, ...rest } = values;
  const payload = {
    app_id: payinCreds.appId,
    timestamp: timestampNow(),
    trade_type: "WEB",
    method: methodInfo.method,
    ...rest,
  };
  if (methodInfo.channel) payload.channel = methodInfo.channel;
  if (regions) payload.regions = regions.split(",").map((s) => s.trim());
  return payload;
}

export function buildDirectPayinPayload(values, ctx) {
  const { methodInfo, payinCreds } = ctx;
  const payload = {
    app_id: payinCreds.appId,
    timestamp: timestampNow(),
    method: methodInfo.method,
    customer: {
      name: values["customer.name"],
      email: values["customer.email"],
      phone: values["customer.phone"],
      identify: {
        number: values["customer.identify.number"],
        type: values["customer.identify.type"],
      },
    },
    address: {
      zip_code: values["address.zip_code"],
      state: values["address.state"],
      city: values["address.city"],
      street: values["address.street"],
      street_number: values["address.street_number"],
    },
  };
  for (const k of Object.keys(values)) {
    if (!k.startsWith("customer.") && !k.startsWith("address.")) payload[k] = values[k];
  }
  if (methodInfo.channel) payload.channel = methodInfo.channel;
  return payload;
}

export function buildPayoutPayload(values, ctx) {
  const { country, methodInfo } = ctx;
  const { result_scenario, ...rest } = values;
  const payload = {
    ...rest,
    method: methodInfo.method,
    country: country.code,
  };
  if (methodInfo.channel) payload.channel = methodInfo.channel;
  return payload;
}
