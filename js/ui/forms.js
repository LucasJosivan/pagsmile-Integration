import { timestampNow, randomId } from "../core/state.js";
import { t, translateMethodLabel } from "../i18n.js";

function methodExtraFields(methodInfo) {
  const m = methodInfo.method;
  const extras = [];
  if (m === "CreditCard" || m === "DebitCard") {
    extras.push(
      { key: "token", label: t("field_token"), value: "tok_test_4111111111111111", required: true },
      { key: "fingerprint", label: t("field_fingerprint"), value: "fp_test_demo", required: true },
      { key: "issuer", label: t("field_issuer"), value: "visa", required: true },
      { key: "installments", label: t("field_installments"), type: "number", value: "1" },
      { key: "user_ip", label: t("field_user_ip"), value: "127.0.0.1", required: true }
    );
  }
  if (["DepositExpress", "Cash", "BankTransfer", "Khipu"].includes(m)) {
    extras.push({ key: "bank", label: t("field_bank"), value: "001" });
  }
  if (["Cash", "BankTransfer"].includes(m)) {
    extras.push({ key: "language_code", label: t("field_language_code"), value: "pt" });
  }
  return extras;
}

export function checkoutFields(ctx) {
  const { country, methodInfo } = ctx;
  const label = translateMethodLabel(methodInfo);
  return [
    { key: "out_trade_no", label: t("field_out_trade_no"), value: randomId("order"), required: true },
    { key: "order_amount", label: t("field_order_amount"), value: "10.00", required: true },
    { key: "order_currency", label: t("field_order_currency"), value: country.currency, required: true },
    { key: "subject", label: t("field_subject"), value: t("default_subject", { label }), required: true },
    { key: "content", label: t("field_content"), value: t("default_content", { label }) },
    { key: "buyer_id", label: t("field_buyer_id"), value: randomId("buyer"), required: true },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/pagsmile", required: true },
    { key: "return_url", label: t("field_return_url"), value: "https://example.com/retorno" },
    { key: "timeout_express", label: t("field_timeout_express"), value: "90m" },
    ...(country.code ? [] : [{ key: "regions", label: t("field_regions"), value: "BRA" }]),
  ];
}

export function directPayinFields(ctx) {
  const { country, methodInfo } = ctx;
  const label = translateMethodLabel(methodInfo);
  const base = [
    { key: "out_trade_no", label: t("field_out_trade_no"), value: randomId("order"), required: true },
    { key: "order_amount", label: t("field_order_amount"), value: "10.00", required: true },
    { key: "order_currency", label: t("field_order_currency"), value: country.currency, required: true },
    { key: "subject", label: t("field_subject"), value: t("default_subject", { label }), required: true },
    { key: "content", label: t("field_content"), value: t("default_content", { label }) },
    { key: "buyer_id", label: t("field_buyer_id"), value: randomId("buyer"), required: true },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/pagsmile", required: true },
    { key: "customer.name", label: t("field_customer_name"), value: "Maria da Silva", required: true },
    { key: "customer.email", label: t("field_customer_email"), value: "maria@example.com", required: true },
    { key: "customer.phone", label: t("field_customer_phone"), value: "+5511999999999", required: true },
    { key: "customer.identify.number", label: t("field_customer_doc_number"), value: "12345678909", required: true },
    { key: "customer.identify.type", label: t("field_customer_doc_type"), value: "CPF", required: true },
    { key: "address.zip_code", label: t("field_address_zip"), value: "01310-100", required: true },
    { key: "address.state", label: t("field_address_state"), value: "SP", required: true },
    { key: "address.city", label: t("field_address_city"), value: "São Paulo", required: true },
    { key: "address.street", label: t("field_address_street"), value: "Av. Paulista", required: true },
    { key: "address.street_number", label: t("field_address_street_number"), value: "1000", required: true },
    ...(country.code ? [] : [{ key: "region", label: t("field_region"), value: "BRA" }]),
  ];
  return base.concat(methodExtraFields(methodInfo));
}

export function payoutFields(ctx) {
  const { country } = ctx;
  return [
    { key: "custom_code", label: t("field_custom_code"), value: randomId("payout"), required: true },
    { key: "name", label: t("field_beneficiary_name"), value: "João Souza", required: true },
    { key: "phone", label: t("field_phone"), value: "+5511999999999" },
    { key: "email", label: t("field_email"), value: "joao@example.com" },
    { key: "account", label: t("field_account"), value: "12345-6", required: true },
    { key: "account_type", label: t("field_account_type"), value: "CHECKING", required: true },
    { key: "document_id", label: t("field_document_id"), value: "12345678909", required: true },
    { key: "document_type", label: t("field_document_type"), value: "CPF", required: true },
    { key: "fee_bear", label: t("field_fee_bear"), type: "select", value: "merchant",
      options: [
        { value: "merchant", label: t("field_fee_bear_merchant") },
        { value: "beneficiary", label: t("field_fee_bear_beneficiary") },
      ] },
    { key: "amount", label: t("field_amount"), value: "10.00", required: true },
    { key: "source_currency", label: t("field_source_currency"), value: "USD", required: true },
    { key: "arrival_currency", label: t("field_arrival_currency"), value: country.currency, required: true },
    { key: "notify_url", label: t("field_notify_url"), value: "https://example.com/webhooks/payout", required: true },
    { key: "additional_remark", label: t("field_additional_remark"), value: t("default_additional_remark") },
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
  const payload = {
    ...values,
    method: methodInfo.method,
    country: country.code,
  };
  if (methodInfo.channel) payload.channel = methodInfo.channel;
  return payload;
}
