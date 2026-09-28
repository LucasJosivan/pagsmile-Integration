import { PAYIN_COUNTRIES } from "./data/payinData.js";
import { PAYOUT_COUNTRIES } from "./data/payoutData.js";
import { createCheckoutPage, submitDirectPayin, submitPayout } from "./core/api.js";
import {
  loadCreds,
  saveCreds,
  createWizardState,
  countryKey,
  getPayinCreds,
  getPayoutCreds,
  listConfiguredPayinKeys,
} from "./core/state.js";
import { el, clear, appendAll, optionCard, field, readFormValues } from "./ui/dom.js";
import { renderCredentialsHub } from "./ui/credentials.js";
import {
  checkoutFields,
  directPayinFields,
  payoutFields,
  buildCheckoutPayload,
  buildDirectPayinPayload,
  buildPayoutPayload,
} from "./ui/forms.js";
import { renderResult, renderError } from "./ui/results.js";
import { t, getLang, setLang, translateCountryName, translateMethodLabel, translateMeta } from "./i18n.js";

const ALL_METHODS_OPTION = { isAllMethods: true };

const steps = ["env", "flow", "country", "integration", "method", "details", "result"];
let stepIndex = 0;
const wizard = createWizardState();
let creds = loadCreds();
let flowWarning = null;

const stepsEl = document.getElementById("steps");
const contentEl = document.getElementById("step-content");
const backBtn = document.getElementById("back-btn");
const credsBtn = document.getElementById("creds-btn");
const credsDialog = document.getElementById("creds-dialog");
const credsBody = document.getElementById("creds-body");
const credsCloseBtn = document.getElementById("creds-close-btn");
const langPtBtn = document.getElementById("lang-pt-btn");
const langEnBtn = document.getElementById("lang-en-btn");

function currentCountries() {
  return wizard.flow === "payin" ? PAYIN_COUNTRIES : PAYOUT_COUNTRIES;
}

function visibleSteps() {
  return wizard.flow === "payout" ? steps.filter((s) => s !== "integration") : steps;
}

function stepLabel(step) {
  return {
    env: t("step_env"),
    flow: t("step_flow"),
    country: t("step_country"),
    integration: t("step_integration"),
    method: t("step_method"),
    details: t("step_details"),
    result: t("step_result"),
  }[step];
}

function renderStepper() {
  clear(stepsEl);
  const vs = visibleSteps();
  const currentStep = steps[stepIndex];
  vs.forEach((step, i) => {
    const isDone = vs.indexOf(currentStep) > i;
    const isActive = step === currentStep;
    stepsEl.append(
      el("div", { class: `stepper-item${isActive ? " stepper-item--active" : ""}${isDone ? " stepper-item--done" : ""}` }, [
        el("span", { class: "stepper-item__dot" }, isDone ? "✓" : String(i + 1)),
        el("span", { class: "stepper-item__label" }, stepLabel(step)),
      ])
    );
  });
  backBtn.style.visibility = stepIndex === 0 ? "hidden" : "visible";
}

function goTo(step) {
  stepIndex = steps.indexOf(step);
  render();
}

function next() {
  const vs = visibleSteps();
  const currentStep = steps[stepIndex];
  const pos = vs.indexOf(currentStep);
  const nextStep = vs[pos + 1];
  goTo(nextStep);
}

function back() {
  const vs = visibleSteps();
  const currentStep = steps[stepIndex];
  const pos = vs.indexOf(currentStep);
  if (pos <= 0) return;
  goTo(vs[pos - 1]);
}

function render() {
  renderStepper();
  clear(contentEl);
  const step = steps[stepIndex];
  const renderers = {
    env: renderEnvStep,
    flow: renderFlowStep,
    country: renderCountryStep,
    integration: renderIntegrationStep,
    method: renderMethodStep,
    details: renderDetailsStep,
    result: renderResultStep,
  };
  renderers[step]();
}

function refreshCredsDialogContent() {
  renderCredentialsHub(credsBody, creds, (newCreds) => {
    creds = newCreds;
    saveCreds(creds);
  });
}

function openCredsDialog() {
  refreshCredsDialogContent();
  credsDialog.showModal();
}

function applyStaticTranslations() {
  document.getElementById("header-subtitle").textContent = t("header_subtitle");
  credsBtn.textContent = t("credentials_button");
  backBtn.textContent = t("back_button");
  document.getElementById("app-footer-text").textContent = t("footer_text");
  document.getElementById("creds-title").textContent = t("credentials_title");
  credsCloseBtn.textContent = t("close_button");
  langPtBtn.classList.toggle("lang-switch__btn--active", getLang() === "pt");
  langEnBtn.classList.toggle("lang-switch__btn--active", getLang() === "en");
  document.documentElement.lang = getLang() === "en" ? "en" : "pt-BR";
}

function switchLang(lang) {
  if (lang === getLang()) return;
  setLang(lang);
  applyStaticTranslations();
  render();
  if (credsDialog.open) refreshCredsDialogContent();
}

function renderEnvStep() {
  contentEl.append(
    el("h2", { class: "step-title" }, t("env_title")),
    el("div", { class: "option-grid" }, [
      optionCard({
        title: t("env_sandbox_title"),
        subtitle: "gateway-test.pagsmile.com / sandbox.transfersmile.com",
        selected: wizard.env === "sandbox",
        onClick: () => {
          wizard.env = "sandbox";
          next();
        },
      }),
      optionCard({
        title: t("env_live_title"),
        subtitle: "gateway.pagsmile.com / api.transfersmile.com",
        selected: wizard.env === "live",
        onClick: () => {
          wizard.env = "live";
          next();
        },
      }),
    ])
  );
}

function renderFlowStep() {
  appendAll(contentEl, [
    el("h2", { class: "step-title" }, t("flow_title")),
    flowWarning ? el("div", { class: "alert alert--atenção" }, flowWarning) : null,
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
          flowWarning = null;
          wizard.flow = "payin";
          wizard.country = null;
          wizard.integrationType = null;
          wizard.method = null;
          next();
        },
      }),
      optionCard({
        title: t("flow_payout_title"),
        subtitle: t("flow_payout_subtitle"),
        selected: wizard.flow === "payout",
        onClick: () => {
          flowWarning = null;
          wizard.flow = "payout";
          wizard.country = null;
          wizard.integrationType = "direct";
          wizard.method = null;
          next();
        },
      }),
    ]),
  ]);
}

function renderCountryStep() {
  const isPayin = wizard.flow === "payin";
  const countries = isPayin
    ? currentCountries().filter((c) => getPayinCreds(creds, countryKey(c), wizard.env))
    : currentCountries();

  if (isPayin && countries.length === 0) {
    appendAll(contentEl, [
      el("h2", { class: "step-title" }, t("country_title")),
      el("div", { class: "alert alert--atenção" }, [
        el("span", {}, t("country_empty_warning", { env: wizard.env === "sandbox" ? "Sandbox" : "Live" })),
      ]),
      el("button", { class: "btn btn-green", type: "button", onclick: openCredsDialog }, t("open_credentials_button")),
    ]);
    return;
  }

  contentEl.append(
    el("h2", { class: "step-title" }, t("country_title")),
    el(
      "div",
      { class: "option-grid option-grid--wrap" },
      countries.map((c) =>
        optionCard({
          title: translateCountryName(c),
          subtitle: c.code || "—",
          selected: wizard.country?.code === c.code && wizard.country?.name === c.name,
          onClick: () => {
            wizard.country = c;
            wizard.method = null;
            next();
          },
        })
      )
    )
  );
}

function renderIntegrationStep() {
  contentEl.append(
    el("h2", { class: "step-title" }, t("integration_title")),
    el("div", { class: "option-grid" }, [
      optionCard({
        title: t("integration_checkout_title"),
        subtitle: t("integration_checkout_subtitle"),
        selected: wizard.integrationType === "checkout",
        onClick: () => {
          wizard.integrationType = "checkout";
          next();
        },
      }),
      optionCard({
        title: t("integration_direct_title"),
        subtitle: t("integration_direct_subtitle"),
        selected: wizard.integrationType === "direct",
        onClick: () => {
          wizard.integrationType = "direct";
          next();
        },
      }),
    ])
  );
}

function renderMethodStep() {
  const methods = wizard.country?.methods || [];
  const showAllMethodsOption = wizard.flow === "payin" && wizard.integrationType === "checkout";

  const cards = [];
  if (showAllMethodsOption) {
    cards.push(
      optionCard({
        title: t("method_all_title"),
        subtitle: t("method_all_subtitle"),
        selected: wizard.method === ALL_METHODS_OPTION,
        onClick: () => {
          wizard.method = ALL_METHODS_OPTION;
          next();
        },
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
        onClick: () => {
          wizard.method = m;
          next();
        },
      })
    )
  );

  contentEl.append(
    el("h2", { class: "step-title" }, t("method_title")),
    el("div", { class: "option-grid option-grid--wrap" }, cards)
  );
}

function resolveCreds() {
  if (wizard.flow === "payin") {
    return { payinCreds: getPayinCreds(creds, countryKey(wizard.country), wizard.env) };
  }
  return { payoutCreds: getPayoutCreds(creds, wizard.env) };
}

function credsMissingMessage() {
  const resolved = resolveCreds();
  if (wizard.flow === "payin" && !resolved.payinCreds) {
    return t("creds_missing_payin");
  }
  if (wizard.flow === "payout" && !resolved.payoutCreds) {
    return t("creds_missing_payout");
  }
  return null;
}

function renderDetailsStep() {
  const resolved = resolveCreds();
  const ctx = { country: wizard.country, methodInfo: wizard.method, ...resolved };
  let fieldsDef;
  if (wizard.flow === "payin" && wizard.integrationType === "checkout") fieldsDef = checkoutFields(ctx);
  else if (wizard.flow === "payin") fieldsDef = directPayinFields(ctx);
  else fieldsDef = payoutFields(ctx);

  const form = el("div", { class: "details-form" }, fieldsDef.map((f) => field(f)));
  const warning = credsMissingMessage();

  const submitBtn = el(
    "button",
    { class: "btn btn-green btn-lg", type: "button", onclick: onSubmit },
    t("submit_button")
  );
  if (warning) submitBtn.disabled = true;

  appendAll(contentEl, [
    el("h2", { class: "step-title" }, t("details_title")),
    warning ? el("div", { class: "alert alert--atenção" }, warning) : null,
    form,
    el("div", { class: "details-form__actions" }, [submitBtn]),
  ]);

  async function onSubmit() {
    const values = readFormValues(form);
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.textContent = t("submit_button_sending");
    submitBtn.disabled = true;
    try {
      let response;
      if (wizard.flow === "payin" && wizard.integrationType === "checkout") {
        response = await createCheckoutPage(wizard.env, ctx.payinCreds, buildCheckoutPayload(values, ctx));
      } else if (wizard.flow === "payin") {
        response = await submitDirectPayin(wizard.env, ctx.payinCreds, buildDirectPayinPayload(values, ctx));
      } else {
        response = await submitPayout(wizard.env, ctx.payoutCreds, buildPayoutPayload(values, ctx));
      }
      wizard.lastResult = { ok: true, response };
    } catch (error) {
      wizard.lastResult = { ok: false, error };
    }
    next();
  }
}

function renderResultStep() {
  contentEl.append(el("h2", { class: "step-title" }, t("result_title")));
  const box = el("div", { class: "result-box" });
  contentEl.append(box);

  if (!wizard.lastResult) {
    box.append(el("p", {}, t("result_none")));
  } else if (wizard.lastResult.ok) {
    renderResult(box, wizard.lastResult.response);
  } else {
    renderError(box, wizard.lastResult.error);
  }

  contentEl.append(
    el("div", { class: "details-form__actions" }, [
      el(
        "button",
        {
          class: "btn btn-outline",
          type: "button",
          onclick: () => {
            wizard.method = null;
            wizard.lastResult = null;
            goTo("method");
          },
        },
        t("result_retry_method")
      ),
      el(
        "button",
        {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => {
            Object.assign(wizard, createWizardState());
            wizard.lastResult = null;
            goTo("env");
          },
        },
        t("result_restart")
      ),
    ])
  );
}

backBtn.addEventListener("click", back);
credsBtn.addEventListener("click", openCredsDialog);
credsCloseBtn.addEventListener("click", () => {
  credsDialog.close();
});
langPtBtn.addEventListener("click", () => switchLang("pt"));
langEnBtn.addEventListener("click", () => switchLang("en"));

applyStaticTranslations();
render();
