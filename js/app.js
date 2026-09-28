import { PAYIN_COUNTRIES } from "./data/payinData.js";
import { PAYOUT_COUNTRIES } from "./data/payoutData.js";
import { sendRequest } from "./core/api.js";
import { buildRequestSpec } from "./core/request.js";
import { buildCurl, buildGoSnippet, buildNodeSnippet, buildPythonSnippet, CONTENT_TYPE } from "./core/codegen.js";
import {
  loadCreds,
  saveCreds,
  createWizardState,
  countryKey,
  getPayinCreds,
  getPayoutCreds,
  listConfiguredPayinKeys,
} from "./core/state.js";
import { el, clear, optionCard, field, readFormValues } from "./ui/dom.js";
import { renderCredentialsHub } from "./ui/credentials.js";
import { renderHints } from "./ui/hints.js";
import { checkoutFields, directPayinFields, payoutFields } from "./ui/forms.js";
import { renderResult, renderError } from "./ui/results.js";
import { t, getLang, setLang, translateCountryName, translateMethodLabel, translateMeta } from "./i18n.js";

const ALL_METHODS_OPTION = { isAllMethods: true };
const CODE_LANGS = ["go", "node", "python"];
const CODE_BUILDERS = { go: buildGoSnippet, node: buildNodeSnippet, python: buildPythonSnippet };

const wizard = createWizardState();
let creds = loadCreds();
let flowWarning = null;
let manualEditStep = null; // step key the user explicitly reopened via "Change"
let activeCodeLang = "go";
let lastSpec = null;
let previewToken = 0;

// Persisted details-form DOM so typed values survive re-renders that don't
// actually change the form's shape (e.g. reopening an earlier step's card).
let detailsFormCache = { signature: null, el: null };

const formColumnEl = document.getElementById("form-column");
const curlOutputEl = document.getElementById("curl-output");
const codeOutputEl = document.getElementById("code-output");
const codeTabsEl = document.getElementById("code-tabs");
const hintsPanelEl = document.getElementById("hints-panel");
const requestInfoEl = document.getElementById("request-info");
const copyCurlBtn = document.getElementById("copy-curl-btn");
const copyCodeBtn = document.getElementById("copy-code-btn");
const resetBtn = document.getElementById("reset-btn");
const credsBtn = document.getElementById("creds-btn");
const credsDialog = document.getElementById("creds-dialog");
const credsBody = document.getElementById("creds-body");
const credsCloseBtn = document.getElementById("creds-close-btn");
const langPtBtn = document.getElementById("lang-pt-btn");
const langEnBtn = document.getElementById("lang-en-btn");
const langZhBtn = document.getElementById("lang-zh-btn");

function currentCountries() {
  return wizard.flow === "payin" ? PAYIN_COUNTRIES : PAYOUT_COUNTRIES;
}

function stepOrder() {
  const base = ["env", "flow", "country", "integration", "method", "details"];
  return wizard.flow === "payout" ? base.filter((s) => s !== "integration") : base;
}

function isStepComplete(step) {
  switch (step) {
    case "env":
      return !!wizard.env;
    case "flow":
      return !!wizard.flow;
    case "country":
      return !!wizard.country;
    case "integration":
      return !!wizard.integrationType;
    case "method":
      return !!wizard.method;
    default:
      return false; // "details" never collapses
  }
}

function resolveCreds() {
  if (wizard.flow === "payin") {
    return { payinCreds: getPayinCreds(creds, countryKey(wizard.country), wizard.env) };
  }
  if (wizard.flow === "payout") {
    return { payoutCreds: getPayoutCreds(creds, wizard.env) };
  }
  return {};
}

function credsMissingMessage() {
  const resolved = resolveCreds();
  if (wizard.flow === "payin" && !resolved.payinCreds) return t("creds_missing_payin");
  if (wizard.flow === "payout" && !resolved.payoutCreds) return t("creds_missing_payout");
  return null;
}

function activeStep() {
  const order = stepOrder();
  if (manualEditStep && order.includes(manualEditStep)) return manualEditStep;
  return order.find((s) => !isStepComplete(s)) ?? order[order.length - 1];
}

function reopenStep(step) {
  manualEditStep = step;
  render();
}

function selectValue(mutate) {
  mutate();
  manualEditStep = null;
  render();
}

// ---------- Step body builders ----------

function envSummary() {
  return wizard.env === "sandbox" ? t("env_sandbox_title") : t("env_live_title");
}

function envBody() {
  return [
    el("div", { class: "option-grid" }, [
      optionCard({
        title: t("env_sandbox_title"),
        subtitle: "gateway-test.pagsmile.com / sandbox.transfersmile.com",
        selected: wizard.env === "sandbox",
        onClick: () => selectValue(() => { wizard.env = "sandbox"; }),
      }),
      optionCard({
        title: t("env_live_title"),
        subtitle: "gateway.pagsmile.com / api.transfersmile.com",
        selected: wizard.env === "live",
        onClick: () => selectValue(() => { wizard.env = "live"; }),
      }),
    ]),
  ];
}

function flowSummary() {
  return wizard.flow === "payin" ? t("flow_payin_title") : t("flow_payout_title");
}

function flowBody() {
  const nodes = [];
  if (flowWarning) nodes.push(el("div", { class: "alert alert--atenção" }, flowWarning));
  nodes.push(
    el("div", { class: "option-grid" }, [
      optionCard({
        title: t("flow_payin_title"),
        subtitle: t("flow_payin_subtitle"),
        selected: wizard.flow === "payin",
        onClick: () => {
          if (listConfiguredPayinKeys(creds, wizard.env).length === 0) {
            flowWarning = t("flow_warning_no_creds", { env: wizard.env === "sandbox" ? "Sandbox" : "Live" });
            openCredsDialog();
            render();
            return;
          }
          selectValue(() => {
            flowWarning = null;
            wizard.flow = "payin";
            wizard.country = null;
            wizard.integrationType = null;
            wizard.method = null;
          });
        },
      }),
      optionCard({
        title: t("flow_payout_title"),
        subtitle: t("flow_payout_subtitle"),
        selected: wizard.flow === "payout",
        onClick: () => selectValue(() => {
          flowWarning = null;
          wizard.flow = "payout";
          wizard.country = null;
          wizard.integrationType = "direct";
          wizard.method = null;
        }),
      }),
    ])
  );
  return nodes;
}

function countrySummary() {
  return translateCountryName(wizard.country);
}

function countryBody() {
  const isPayin = wizard.flow === "payin";
  const countries = isPayin
    ? currentCountries().filter((c) => getPayinCreds(creds, countryKey(c), wizard.env))
    : currentCountries();

  if (isPayin && countries.length === 0) {
    return [
      el("div", { class: "alert alert--atenção" }, t("country_empty_warning", { env: wizard.env === "sandbox" ? "Sandbox" : "Live" })),
      el("button", { class: "btn btn-green", type: "button", onclick: openCredsDialog }, t("open_credentials_button")),
    ];
  }

  return [
    el(
      "div",
      { class: "option-grid option-grid--wrap" },
      countries.map((c) =>
        optionCard({
          title: translateCountryName(c),
          subtitle: c.code || "—",
          selected: wizard.country?.code === c.code && wizard.country?.name === c.name,
          onClick: () => selectValue(() => {
            wizard.country = c;
            wizard.method = null;
          }),
        })
      )
    ),
  ];
}

function integrationSummary() {
  return wizard.integrationType === "checkout" ? t("integration_checkout_title") : t("integration_direct_title");
}

function integrationBody() {
  return [
    el("div", { class: "option-grid" }, [
      optionCard({
        title: t("integration_checkout_title"),
        subtitle: t("integration_checkout_subtitle"),
        selected: wizard.integrationType === "checkout",
        onClick: () => selectValue(() => { wizard.integrationType = "checkout"; }),
      }),
      optionCard({
        title: t("integration_direct_title"),
        subtitle: t("integration_direct_subtitle"),
        selected: wizard.integrationType === "direct",
        onClick: () => selectValue(() => { wizard.integrationType = "direct"; }),
      }),
    ]),
  ];
}

function methodSummary() {
  return translateMethodLabel(wizard.method);
}

function methodBody() {
  const methods = wizard.country?.methods || [];
  const showAllMethodsOption = wizard.flow === "payin" && wizard.integrationType === "checkout";

  const cards = [];
  if (showAllMethodsOption) {
    cards.push(
      optionCard({
        title: t("method_all_title"),
        subtitle: t("method_all_subtitle"),
        selected: wizard.method === ALL_METHODS_OPTION,
        onClick: () => selectValue(() => { wizard.method = ALL_METHODS_OPTION; }),
      })
    );
  }
  cards.push(
    ...methods.map((m) =>
      optionCard({
        title: translateMethodLabel(m),
        subtitle: m.channel
          ? `${t("channel_prefix")}: ${m.channel}`
          : m.range
          ? `${translateMeta(m.range)} · ${translateMeta(m.eta)}`
          : "",
        selected: wizard.method === m,
        onClick: () => selectValue(() => { wizard.method = m; }),
      })
    )
  );

  return [el("div", { class: "option-grid option-grid--wrap" }, cards)];
}

// ---------- Details step (live form + submit + result) ----------

function detailsBody() {
  const resolved = resolveCreds();
  const ctx = { country: wizard.country, methodInfo: wizard.method, ...resolved };
  let fieldsDef;
  if (wizard.flow === "payin" && wizard.integrationType === "checkout") fieldsDef = checkoutFields(ctx);
  else if (wizard.flow === "payin") fieldsDef = directPayinFields(ctx);
  else fieldsDef = payoutFields(ctx);

  const signature = JSON.stringify({
    flow: wizard.flow,
    it: wizard.integrationType,
    method: wizard.method,
    country: countryKey(wizard.country),
    lang: getLang(),
  });

  if (detailsFormCache.signature !== signature) {
    const formNode = el("div", { class: "details-form" }, fieldsDef.map((f) => field(f)));
    formNode.addEventListener("input", updatePreview);
    formNode.addEventListener("change", updatePreview);
    detailsFormCache = { signature, el: formNode };
  }
  const formEl = detailsFormCache.el;

  const warning = credsMissingMessage();
  const submitBtn = el(
    "button",
    { class: "btn btn-green btn-lg", type: "button", onclick: () => onSubmit(formEl) },
    t("submit_button")
  );
  if (warning) submitBtn.disabled = true;

  const nodes = [
    warning ? el("div", { class: "alert alert--atenção" }, warning) : null,
    el("p", { class: "required-legend" }, t("required_legend")),
    formEl,
    el("div", { class: "details-form__actions" }, [submitBtn]),
  ];

  if (wizard.lastResult) {
    const resultTitle = el("h4", { class: "result-heading" }, t("result_title"));
    const box = el("div", { class: "result-box" });
    if (wizard.lastResult.ok) renderResult(box, wizard.lastResult.response);
    else renderError(box, wizard.lastResult.error);
    nodes.push(
      resultTitle,
      box,
      el("div", { class: "details-form__actions" }, [
        el(
          "button",
          {
            class: "btn btn-outline",
            type: "button",
            onclick: () => {
              wizard.method = null;
              wizard.lastResult = null;
              manualEditStep = null;
              render();
            },
          },
          t("result_retry_method")
        ),
        el(
          "button",
          {
            class: "btn btn-ghost",
            type: "button",
            onclick: resetWizard,
          },
          t("result_restart")
        ),
      ])
    );
  }

  return nodes;
}

async function onSubmit(formEl) {
  const values = readFormValues(formEl);
  const submitBtn = formEl.parentElement.querySelector(".details-form__actions .btn-green");
  if (submitBtn) {
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.textContent = t("submit_button_sending");
    submitBtn.disabled = true;
  }
  try {
    const resolved = resolveCreds();
    const spec = await buildRequestSpec({
      flow: wizard.flow,
      integrationType: wizard.integrationType,
      env: wizard.env,
      country: wizard.country,
      methodInfo: wizard.method,
      values,
      ...resolved,
    });
    const response = await sendRequest(spec);
    wizard.lastResult = { ok: true, response };
  } catch (error) {
    wizard.lastResult = { ok: false, error };
  }
  render();
}

// ---------- Step card shell ----------

const STEP_CONFIG = {
  env: { title: () => t("step_env"), summary: envSummary, body: envBody },
  flow: { title: () => t("step_flow"), summary: flowSummary, body: flowBody },
  country: { title: () => t("step_country"), summary: countrySummary, body: countryBody },
  integration: { title: () => t("step_integration"), summary: integrationSummary, body: integrationBody },
  method: { title: () => t("step_method"), summary: methodSummary, body: methodBody },
  details: { title: () => t("step_details"), summary: () => "", body: detailsBody },
};

function renderStepCard(step, index, state) {
  const cfg = STEP_CONFIG[step];
  const isActive = state === "active";
  const isDone = state === "done";

  const header = el("div", { class: "step-card__header" }, [
    el("span", { class: "step-card__index" }, isDone ? "✓" : String(index)),
    el("div", { class: "step-card__headtext" }, [
      el("span", { class: "step-card__title" }, cfg.title()),
      isDone ? el("span", { class: "step-card__summary" }, cfg.summary()) : null,
    ]),
    isDone
      ? el("button", { class: "btn btn-ghost btn-sm", type: "button", onclick: () => reopenStep(step) }, t("step_change"))
      : null,
  ]);

  const card = el("div", { class: `step-card step-card--${state}` }, [header]);

  if (isActive) {
    card.append(el("div", { class: "step-card__body" }, cfg.body()));
  }
  return card;
}

function renderFormColumn() {
  clear(formColumnEl);
  const order = stepOrder();
  const active = activeStep();

  order.forEach((step, i) => {
    const state = step === active ? "active" : isStepComplete(step) ? "done" : "locked";
    formColumnEl.append(renderStepCard(step, i + 1, state));
  });
}

// ---------- Live preview (cURL + code snippets) ----------

function buildPreviewContext() {
  if (!wizard.flow) return null;

  const values = detailsFormCache.el ? readFormValues(detailsFormCache.el) : undefined;
  const resolved = resolveCreds();
  return {
    flow: wizard.flow,
    integrationType: wizard.integrationType,
    env: wizard.env,
    country: wizard.country,
    methodInfo: wizard.method,
    values,
    ...resolved,
  };
}

function showPreviewPlaceholder() {
  lastSpec = null;
  curlOutputEl.textContent = t("preview_placeholder");
  codeOutputEl.textContent = t("preview_placeholder");
  clear(requestInfoEl);
}

function renderRequestInfo(spec) {
  clear(requestInfoEl);
  const rows = [
    [t("request_info_endpoint"), `POST ${spec.url}`],
    ...Object.entries(spec.headers),
    ["Content-Type", CONTENT_TYPE],
  ];
  requestInfoEl.append(
    ...rows.map(([key, value]) =>
      el("div", { class: "request-info__row" }, [
        el("span", { class: "request-info__key" }, key),
        el("span", { class: "request-info__value" }, value),
      ])
    )
  );
}

function renderCurl() {
  if (!lastSpec) return;
  curlOutputEl.textContent = buildCurl(lastSpec);
  renderRequestInfo(lastSpec);
}

function renderCode() {
  if (!lastSpec) return;
  codeOutputEl.textContent = CODE_BUILDERS[activeCodeLang](lastSpec);
}

async function updatePreview() {
  const token = ++previewToken;
  const ctx = buildPreviewContext();
  if (!ctx) {
    showPreviewPlaceholder();
    return;
  }
  let spec;
  try {
    spec = await buildRequestSpec(ctx);
  } catch {
    return;
  }
  if (token !== previewToken) return; // a newer update superseded this one
  lastSpec = spec;
  renderCurl();
  renderCode();
}

function switchCodeLang(lang) {
  activeCodeLang = lang;
  codeTabsEl.querySelectorAll(".code-tab").forEach((btn) => {
    btn.classList.toggle("code-tab--active", btn.dataset.lang === lang);
  });
  if (lastSpec) renderCode();
  else showPreviewPlaceholder();
}

async function copyToClipboard(button, text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return;
  }
  const original = button.textContent;
  button.textContent = t("copied_button");
  setTimeout(() => {
    button.textContent = original;
  }, 1500);
}

// ---------- Global chrome ----------

function refreshCredsDialogContent() {
  renderCredentialsHub(credsBody, creds, (newCreds) => {
    creds = newCreds;
    saveCreds(creds);
    updatePreview();
  });
}

function openCredsDialog() {
  refreshCredsDialogContent();
  credsDialog.showModal();
}

function resetWizard() {
  Object.assign(wizard, createWizardState());
  wizard.lastResult = null;
  manualEditStep = null;
  flowWarning = null;
  detailsFormCache = { signature: null, el: null };
  render();
}

function applyStaticTranslations() {
  document.getElementById("header-subtitle").textContent = t("header_subtitle");
  credsBtn.textContent = t("credentials_button");
  resetBtn.textContent = t("reset_button");
  document.getElementById("app-footer-text").textContent = t("footer_text");
  document.getElementById("creds-title").textContent = t("credentials_title");
  credsCloseBtn.textContent = t("close_button");
  document.getElementById("curl-title").textContent = t("curl_panel_title");
  document.getElementById("curl-subtitle").textContent = t("curl_panel_subtitle");
  document.getElementById("code-title").textContent = t("code_panel_title");
  copyCurlBtn.textContent = t("copy_button");
  copyCodeBtn.textContent = t("copy_button");
  langPtBtn.classList.toggle("lang-switch__btn--active", getLang() === "pt");
  langEnBtn.classList.toggle("lang-switch__btn--active", getLang() === "en");
  langZhBtn.classList.toggle("lang-switch__btn--active", getLang() === "zh");
  document.documentElement.lang = { en: "en", zh: "zh-CN" }[getLang()] || "pt-BR";
}

function switchLang(lang) {
  if (lang === getLang()) return;
  setLang(lang);
  applyStaticTranslations();
  render();
  if (credsDialog.open) refreshCredsDialogContent();
}

function render() {
  renderFormColumn();
  // The cURL/code preview is built progressively from the Payin/Payout
  // choice onward (with <PLACEHOLDER> tokens for anything not chosen yet).
  if (wizard.flow) updatePreview();
  else showPreviewPlaceholder();
  renderHints(hintsPanelEl, { flow: wizard.flow, country: wizard.country });
}

resetBtn.addEventListener("click", resetWizard);
credsBtn.addEventListener("click", openCredsDialog);
credsCloseBtn.addEventListener("click", () => credsDialog.close());
langPtBtn.addEventListener("click", () => switchLang("pt"));
langEnBtn.addEventListener("click", () => switchLang("en"));
langZhBtn.addEventListener("click", () => switchLang("zh"));
copyCurlBtn.addEventListener("click", () => copyToClipboard(copyCurlBtn, curlOutputEl.textContent));
copyCodeBtn.addEventListener("click", () => copyToClipboard(copyCodeBtn, codeOutputEl.textContent));
codeTabsEl.querySelectorAll(".code-tab").forEach((btn) => {
  btn.addEventListener("click", () => switchCodeLang(btn.dataset.lang));
});

applyStaticTranslations();
render();
