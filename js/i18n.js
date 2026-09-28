const LANG_KEY = "pagsmile_test_lang_v1";

const STRINGS = {
  pt: {
    header_subtitle: "Testador de Integração",
    credentials_button: "Credenciais",
    back_button: "← Voltar",
    footer_text: "Ferramenta interna de testes · não use credenciais de produção reais sem necessidade.",
    credentials_title: "Credenciais",
    close_button: "Fechar",

    step_env: "Ambiente",
    step_flow: "Payin / Payout",
    step_country: "País",
    step_integration: "Integração",
    step_method: "Método",
    step_details: "Detalhes",
    step_result: "Resultado",

    env_title: "Qual ambiente você quer testar?",
    env_sandbox_title: "Sandbox",
    env_live_title: "Live",

    flow_title: "Payin ou Payout?",
    flow_payin_title: "Payin",
    flow_payin_subtitle: "Receber pagamentos de clientes",
    flow_payout_title: "Payout",
    flow_payout_subtitle: "Enviar pagamentos a beneficiários",
    flow_warning_no_creds: "Nenhuma credencial de Payin configurada para o ambiente {env}. Adicione ao menos um país em Credenciais para continuar.",

    country_title: "Qual país você quer testar?",
    country_empty_warning: "Nenhum país de Payin com credenciais configuradas para o ambiente {env}. Adicione credenciais para continuar.",
    open_credentials_button: "Abrir Credenciais",
    global_country_label: "Global (sem país específico)",

    integration_title: "Checkout Page ou Integração Direta?",
    integration_checkout_title: "Checkout Page",
    integration_checkout_subtitle: "Pagsmile hospeda a página de pagamento",
    integration_direct_title: "Integração Direta",
    integration_direct_subtitle: "Você envia os dados de pagamento via API",

    method_title: "Qual método de pagamento?",
    method_all_title: "Todos os métodos",
    method_all_subtitle: "Não enviar o parâmetro method — a Pagsmile mostra na Checkout Page todos os métodos habilitados para a conta.",
    channel_prefix: "canal",

    creds_missing_payin: "Credenciais de Payin ausentes para este país/ambiente. Abra Credenciais para configurar.",
    creds_missing_payout: "Credenciais de Payout ausentes para este ambiente. Abra Credenciais para configurar.",

    details_title: "Revise os dados e envie",
    submit_button: "Efetivar transação",
    submit_button_sending: "Enviando…",

    result_title: "Resultado da transação",
    result_none: "Nenhum resultado ainda.",
    result_retry_method: "Testar outro método",
    result_restart: "Recomeçar",

    creds_payin_heading: "Payin · credenciais por país",
    creds_payin_hint: "Cada país do Payin tem App ID e Security Key próprios. Você pode preencher Sandbox e Live ao mesmo tempo.",
    creds_country_label: "País",
    creds_sandbox_appid: "Sandbox · App ID",
    creds_sandbox_key: "Sandbox · Security Key",
    creds_live_appid: "Live · App ID",
    creds_live_key: "Live · Security Key",
    creds_save_country: "Salvar país",
    creds_configured_countries: "Países configurados",
    creds_no_country_yet: "Nenhum país configurado ainda.",
    creds_edit: "Editar",
    creds_remove: "Remover",
    creds_payout_heading: "Payout · credenciais globais",
    creds_payout_hint: "O Payout usa um único par de credenciais (não é por país).",
    creds_sandbox_appkey: "Sandbox · App Key",
    creds_live_appkey: "Live · App Key",
    creds_save_payout: "Salvar payout",
    badge_sandbox_on: "Sandbox ✓",
    badge_sandbox_off: "Sandbox –",
    badge_live_on: "Live ✓",
    badge_live_off: "Live –",

    field_out_trade_no: "ID do pedido (out_trade_no)",
    field_order_amount: "Valor (order_amount)",
    field_order_currency: "Moeda (order_currency)",
    field_subject: "Assunto (subject)",
    field_content: "Descrição (content)",
    field_buyer_id: "ID do comprador (buyer_id)",
    field_notify_url: "Notify URL",
    field_return_url: "Return URL",
    field_timeout_express: "Expiração (timeout_express)",
    field_regions: "Regions (ISO3, separado por vírgula)",
    field_region: "Region (ISO3)",
    field_customer_name: "Nome do cliente",
    field_customer_email: "E-mail do cliente",
    field_customer_phone: "Telefone do cliente",
    field_customer_doc_number: "Documento do cliente",
    field_customer_doc_type: "Tipo do documento",
    field_address_zip: "CEP",
    field_address_state: "Estado",
    field_address_city: "Cidade",
    field_address_street: "Rua",
    field_address_street_number: "Número",
    field_token: "Token do cartão (sandbox)",
    field_fingerprint: "Fingerprint",
    field_issuer: "Bandeira (issuer)",
    field_installments: "Parcelas",
    field_user_ip: "IP do cliente",
    field_bank: "Código do banco",
    field_language_code: "Código de idioma",
    default_subject: "Teste {label}",
    default_content: "Pedido de teste via {label}",

    field_custom_code: "ID do saque (custom_code)",
    field_beneficiary_name: "Nome do beneficiário",
    field_phone: "Telefone",
    field_email: "E-mail",
    field_account: "Conta bancária/chave",
    field_account_type: "Tipo de conta (account_type)",
    field_document_id: "Documento (document_id)",
    field_document_type: "Tipo de documento (document_type)",
    field_fee_bear: "Quem paga a taxa (fee_bear)",
    field_fee_bear_merchant: "Comerciante",
    field_fee_bear_beneficiary: "Beneficiário",
    field_amount: "Valor (amount)",
    field_source_currency: "Moeda de origem",
    field_arrival_currency: "Moeda de destino",
    field_additional_remark: "Observação adicional",
    default_additional_remark: "Teste de payout",

    result_success_badge: "✓ Sucesso",
    result_error_badge: "× Erro",
    result_label_message: "Mensagem",
    result_label_error_detail: "Detalhe do erro",
    result_open_payment_link: "Abrir link de pagamento →",
    result_copy_qr_label: "CÓDIGO / QR",
    result_error_title: "Erro",
    result_suggestion_title: "Sugestão",

    network_cors_error:
      "Falha de rede/CORS ao chamar a API da Pagsmile diretamente do navegador. APIs de pagamento normalmente exigem chamada server-to-server; se o gateway não liberar Access-Control-Allow-Origin para este domínio, use um proxy local (veja README) ou desative temporariamente o CORS apenas para testes.",

    suggestion_auth:
      "Provável problema de autenticação: confira se o App ID e a Security/App Key cadastrados em Credenciais correspondem exatamente ao país e ambiente (Sandbox/Live) selecionados, sem espaços extras.",
    suggestion_duplicate:
      "Esse identificador (out_trade_no/custom_code) já foi usado. Volte e gere um novo valor único antes de reenviar.",
    suggestion_amount:
      "O valor enviado pode estar fora do limite permitido para este método/país. Confira o valor mínimo/máximo indicado na etapa de método e ajuste o campo de valor.",
    suggestion_currency:
      "A moeda enviada pode não ser suportada por este método/país. Confira a moeda padrão sugerida no formulário e ajuste se necessário.",
    suggestion_method:
      "O método/canal pode não estar habilitado para a sua conta neste ambiente. Verifique no painel da Pagsmile se esse método está ativo para o seu App ID.",
    suggestion_missing:
      "Parece faltar um campo obrigatório. Revise o formulário — o nome do campo costuma aparecer em sub_code/sub_msg na resposta abaixo.",
    suggestion_invalid:
      "Um dos campos enviados não passou na validação. Revise o campo indicado em sub_code/sub_msg e confira o formato esperado na documentação da Pagsmile.",
    suggestion_5xx:
      "Erro do lado da Pagsmile (HTTP 5xx). Não é algo para corrigir no formulário — aguarde alguns instantes e tente novamente; se persistir, contate o suporte da Pagsmile.",
    suggestion_404:
      "Endpoint não encontrado (HTTP 404). Confira se o ambiente selecionado (Sandbox/Live) corresponde às credenciais usadas e se a URL base está correta.",
    suggestion_400_generic:
      "Requisição rejeitada (HTTP 400). Releia a mensagem de erro abaixo (msg/sub_msg) e confira os campos obrigatórios desse método de pagamento.",
    suggestion_generic:
      "Confira a mensagem de erro completa abaixo (msg/sub_msg) e compare com os campos exigidos na documentação da Pagsmile para este método.",
  },
  en: {
    header_subtitle: "Integration Tester",
    credentials_button: "Credentials",
    back_button: "← Back",
    footer_text: "Internal testing tool · avoid using real production credentials unless necessary.",
    credentials_title: "Credentials",
    close_button: "Close",

    step_env: "Environment",
    step_flow: "Payin / Payout",
    step_country: "Country",
    step_integration: "Integration",
    step_method: "Method",
    step_details: "Details",
    step_result: "Result",

    env_title: "Which environment do you want to test?",
    env_sandbox_title: "Sandbox",
    env_live_title: "Live",

    flow_title: "Payin or Payout?",
    flow_payin_title: "Payin",
    flow_payin_subtitle: "Receive payments from customers",
    flow_payout_title: "Payout",
    flow_payout_subtitle: "Send payouts to beneficiaries",
    flow_warning_no_creds: "No Payin credentials configured for the {env} environment. Add at least one country under Credentials to continue.",

    country_title: "Which country do you want to test?",
    country_empty_warning: "No Payin country has credentials configured for the {env} environment. Add credentials to continue.",
    open_credentials_button: "Open Credentials",
    global_country_label: "Global (no specific country)",

    integration_title: "Checkout Page or Direct Integration?",
    integration_checkout_title: "Checkout Page",
    integration_checkout_subtitle: "Pagsmile hosts the payment page",
    integration_direct_title: "Direct Integration",
    integration_direct_subtitle: "You send the payment data via API",

    method_title: "Which payment method?",
    method_all_title: "All methods",
    method_all_subtitle: "Don't send the method parameter — the Checkout Page will show every method enabled for the account.",
    channel_prefix: "channel",

    creds_missing_payin: "Missing Payin credentials for this country/environment. Open Credentials to set them up.",
    creds_missing_payout: "Missing Payout credentials for this environment. Open Credentials to set them up.",

    details_title: "Review the details and submit",
    submit_button: "Submit transaction",
    submit_button_sending: "Sending…",

    result_title: "Transaction result",
    result_none: "No result yet.",
    result_retry_method: "Test another method",
    result_restart: "Start over",

    creds_payin_heading: "Payin · credentials by country",
    creds_payin_hint: "Each Payin country has its own App ID and Security Key. You can fill in Sandbox and Live at the same time.",
    creds_country_label: "Country",
    creds_sandbox_appid: "Sandbox · App ID",
    creds_sandbox_key: "Sandbox · Security Key",
    creds_live_appid: "Live · App ID",
    creds_live_key: "Live · Security Key",
    creds_save_country: "Save country",
    creds_configured_countries: "Configured countries",
    creds_no_country_yet: "No country configured yet.",
    creds_edit: "Edit",
    creds_remove: "Remove",
    creds_payout_heading: "Payout · global credentials",
    creds_payout_hint: "Payout uses a single pair of credentials (not per country).",
    creds_sandbox_appkey: "Sandbox · App Key",
    creds_live_appkey: "Live · App Key",
    creds_save_payout: "Save payout",
    badge_sandbox_on: "Sandbox ✓",
    badge_sandbox_off: "Sandbox –",
    badge_live_on: "Live ✓",
    badge_live_off: "Live –",

    field_out_trade_no: "Order ID (out_trade_no)",
    field_order_amount: "Amount (order_amount)",
    field_order_currency: "Currency (order_currency)",
    field_subject: "Subject",
    field_content: "Description (content)",
    field_buyer_id: "Buyer ID (buyer_id)",
    field_notify_url: "Notify URL",
    field_return_url: "Return URL",
    field_timeout_express: "Expiration (timeout_express)",
    field_regions: "Regions (ISO3, comma-separated)",
    field_region: "Region (ISO3)",
    field_customer_name: "Customer name",
    field_customer_email: "Customer email",
    field_customer_phone: "Customer phone",
    field_customer_doc_number: "Customer document",
    field_customer_doc_type: "Document type",
    field_address_zip: "ZIP / postal code",
    field_address_state: "State",
    field_address_city: "City",
    field_address_street: "Street",
    field_address_street_number: "Number",
    field_token: "Card token (sandbox)",
    field_fingerprint: "Fingerprint",
    field_issuer: "Card brand (issuer)",
    field_installments: "Installments",
    field_user_ip: "Customer IP",
    field_bank: "Bank code",
    field_language_code: "Language code",
    default_subject: "Test {label}",
    default_content: "Test order via {label}",

    field_custom_code: "Payout ID (custom_code)",
    field_beneficiary_name: "Beneficiary name",
    field_phone: "Phone",
    field_email: "Email",
    field_account: "Bank account / key",
    field_account_type: "Account type (account_type)",
    field_document_id: "Document (document_id)",
    field_document_type: "Document type (document_type)",
    field_fee_bear: "Who pays the fee (fee_bear)",
    field_fee_bear_merchant: "Merchant",
    field_fee_bear_beneficiary: "Beneficiary",
    field_amount: "Amount",
    field_source_currency: "Source currency",
    field_arrival_currency: "Arrival currency",
    field_additional_remark: "Additional remark",
    default_additional_remark: "Payout test",

    result_success_badge: "✓ Success",
    result_error_badge: "× Error",
    result_label_message: "Message",
    result_label_error_detail: "Error detail",
    result_open_payment_link: "Open payment link →",
    result_copy_qr_label: "CODE / QR",
    result_error_title: "Error",
    result_suggestion_title: "Suggestion",

    network_cors_error:
      "Network/CORS failure while calling the Pagsmile API directly from the browser. Payment APIs are normally server-to-server; if the gateway doesn't send Access-Control-Allow-Origin for this domain, use a local proxy (see README) or temporarily disable CORS for local testing only.",

    suggestion_auth:
      "Likely an authentication problem: check that the App ID and Security/App Key saved under Credentials exactly match the selected country and environment (Sandbox/Live), with no extra spaces.",
    suggestion_duplicate:
      "This identifier (out_trade_no/custom_code) was already used. Go back and generate a new unique value before resubmitting.",
    suggestion_amount:
      "The amount sent may be outside the allowed range for this method/country. Check the min/max shown on the method step and adjust the amount field.",
    suggestion_currency:
      "The currency sent may not be supported for this method/country. Check the default currency suggested in the form and adjust if needed.",
    suggestion_method:
      "This method/channel may not be enabled for your account in this environment. Check the Pagsmile dashboard to confirm it's active for your App ID.",
    suggestion_missing:
      "A required field seems to be missing. Review the form — the field name is usually shown in sub_code/sub_msg in the response below.",
    suggestion_invalid:
      "One of the submitted fields failed validation. Review the field indicated in sub_code/sub_msg and check the expected format in Pagsmile's docs.",
    suggestion_5xx:
      "Error on Pagsmile's side (HTTP 5xx). This isn't something to fix in the form — wait a moment and try again; if it persists, contact Pagsmile support.",
    suggestion_404:
      "Endpoint not found (HTTP 404). Check that the selected environment (Sandbox/Live) matches the credentials used and that the base URL is correct.",
    suggestion_400_generic:
      "Request rejected (HTTP 400). Re-read the error message below (msg/sub_msg) and check the required fields for this payment method.",
    suggestion_generic:
      "Check the full error message below (msg/sub_msg) and compare it with the required fields in Pagsmile's docs for this method.",
  },
};

const COUNTRY_NAMES_EN = {
  BRA: "Brazil", MEX: "Mexico", ARG: "Argentina", COL: "Colombia", CHL: "Chile",
  PER: "Peru", ECU: "Ecuador", GTM: "Guatemala", PAN: "Panama", CRI: "Costa Rica",
  URY: "Uruguay", BOL: "Bolivia", GHA: "Ghana", KEN: "Kenya", NGA: "Nigeria",
  UGA: "Uganda", CHN: "China", HKG: "Hong Kong", JPN: "Japan", IDN: "Indonesia",
  KOR: "South Korea", SGP: "Singapore", BGD: "Bangladesh", MYS: "Malaysia",
  PHL: "Philippines", THA: "Thailand", TWN: "Taiwan", VNM: "Vietnam", PAK: "Pakistan",
  TJK: "Tajikistan", AUS: "Australia", TUR: "Turkey", BHR: "Bahrain", EGY: "Egypt",
  KWT: "Kuwait", OMN: "Oman", QAT: "Qatar", SAU: "Saudi Arabia", ARE: "United Arab Emirates",
  POL: "Poland", CZE: "Czech Republic", PRT: "Portugal", BEL: "Belgium", USA: "United States",
  CAN: "Canada", IND: "India", JOR: "Jordan", KAZ: "Kazakhstan", NPL: "Nepal",
  PRY: "Paraguay", YEM: "Yemen",
};

const LABEL_TRANSLATIONS = {
  "Cartão de Crédito": "Credit Card",
  "Cartão de Débito": "Debit Card",
  "Dinheiro (Cash)": "Cash",
  "Transferência bancária": "Bank Transfer",
  "PIX Biometria": "PIX Biometrics",
  "Lottery (Casas Lotéricas)": "Lottery (Lottery Houses)",
  "BNCR (Transferência + Cash)": "BNCR (Bank Transfer + Cash)",
  "SPEI (Transferência bancária)": "SPEI (Bank Transfer)",
  "PSE (Transferência bancária)": "PSE (Bank Transfer)",
  "Khipu (Transferência bancária)": "Khipu (Bank Transfer)",
};

const META_PHRASES = [
  ["Saque pós-pagamento", "Post-payment withdrawal"],
  ["janela de 30 dias", "30-day window"],
  ["prazo de 7 dias", "7-day deadline"],
  ["Não especificado", "Not specified"],
  ["Pessoa física", "Individual"],
  ["Empresa", "Business"],
  ["Variável", "Variable"],
  ["Instantâneo", "Instant"],
  ["dias úteis", "business days"],
  ["dia útil", "business day"],
  ["minutos", "minutes"],
  ["minuto", "minute"],
  ["(inteiros)", "(integers)"],
];

let currentLang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "pt";

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang === "en" ? "en" : "pt";
  localStorage.setItem(LANG_KEY, currentLang);
}

export function t(key, vars) {
  let text = STRINGS[currentLang]?.[key] ?? STRINGS.pt[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(`{${k}}`).join(v);
    }
  }
  return text;
}

export function translateCountryName(country) {
  if (!country || !country.code) return t("global_country_label");
  if (currentLang === "pt") return country.name;
  return COUNTRY_NAMES_EN[country.code] || country.name;
}

export function translateMethodLabel(methodInfo) {
  if (!methodInfo) return "";
  if (methodInfo.isAllMethods) return t("method_all_title");
  const label = methodInfo.label;
  if (currentLang === "pt" || !label) return label;
  return LABEL_TRANSLATIONS[label] || label;
}

export function translateMeta(text) {
  if (currentLang !== "en" || !text) return text;
  return META_PHRASES.reduce((acc, [from, to]) => acc.split(from).join(to), text);
}
