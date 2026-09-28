import { PAYIN_COUNTRIES } from "../data/payinData.js";
import { el, clear, appendAll } from "./dom.js";
import {
  countryKey,
  getPayinCreds,
  upsertPayinCountryCreds,
  removePayinCountryCreds,
  setPayoutCreds,
} from "../core/state.js";
import { t, translateCountryName } from "../i18n.js";

function labeledInput(labelText, name, value, type = "text") {
  const input = el("input", { class: "ps-input", name, type, value: value || "" });
  return { wrap: el("div", { class: "form-field" }, [el("label", { class: "form-field__label" }, labelText), input]), input };
}

function renderPayinSection(container, box, commit) {
  const countryOptions = PAYIN_COUNTRIES.map((c) => ({ key: countryKey(c), label: translateCountryName(c) }));

  const countrySelect = el(
    "select",
    { class: "ps-input" },
    countryOptions.map((o) => el("option", { value: o.key }, o.label))
  );

  const sandboxAppId = labeledInput(t("creds_sandbox_appid"), "sandboxAppId", "");
  const sandboxKey = labeledInput(t("creds_sandbox_key"), "sandboxKey", "", "password");
  const liveAppId = labeledInput(t("creds_live_appid"), "liveAppId", "");
  const liveKey = labeledInput(t("creds_live_key"), "liveKey", "", "password");

  function loadIntoForm(key) {
    const entry = box.value.payin?.[key] || {};
    sandboxAppId.input.value = entry.sandbox?.appId || "";
    sandboxKey.input.value = entry.sandbox?.securityKey || "";
    liveAppId.input.value = entry.live?.appId || "";
    liveKey.input.value = entry.live?.securityKey || "";
  }

  countrySelect.addEventListener("change", () => loadIntoForm(countrySelect.value));
  loadIntoForm(countrySelect.value);

  const saveBtn = el("button", { class: "btn btn-green btn-sm", type: "button" }, t("creds_save_country"));
  const list = el("div", { class: "creds-list" });

  function renderList() {
    clear(list);
    const keys = Object.keys(box.value.payin || {});
    if (keys.length === 0) {
      list.append(el("p", { class: "creds-empty" }, t("creds_no_country_yet")));
      return;
    }
    keys.forEach((key) => {
      const country = PAYIN_COUNTRIES.find((c) => countryKey(c) === key);
      const label = country ? translateCountryName(country) : key;
      const hasSandbox = !!getPayinCreds(box.value, key, "sandbox");
      const hasLive = !!getPayinCreds(box.value, key, "live");
      list.append(
        el("div", { class: "creds-list__row" }, [
          el("span", { class: "creds-list__country" }, label),
          el("span", { class: `badge badge--${hasSandbox ? "sucesso" : "neutro"}` }, hasSandbox ? t("badge_sandbox_on") : t("badge_sandbox_off")),
          el("span", { class: `badge badge--${hasLive ? "sucesso" : "neutro"}` }, hasLive ? t("badge_live_on") : t("badge_live_off")),
          el(
            "button",
            {
              class: "btn btn-ghost btn-sm",
              type: "button",
              onclick: () => {
                countrySelect.value = key;
                loadIntoForm(key);
              },
            },
            t("creds_edit")
          ),
          el(
            "button",
            {
              class: "btn btn-ghost btn-sm creds-list__remove",
              type: "button",
              onclick: () => {
                commit(removePayinCountryCreds(box.value, key));
                renderList();
              },
            },
            t("creds_remove")
          ),
        ])
      );
    });
  }

  saveBtn.addEventListener("click", () => {
    const key = countrySelect.value;
    commit(
      upsertPayinCountryCreds(box.value, key, {
        sandbox: { appId: sandboxAppId.input.value.trim(), securityKey: sandboxKey.input.value.trim() },
        live: { appId: liveAppId.input.value.trim(), securityKey: liveKey.input.value.trim() },
      })
    );
    renderList();
  });

  renderList();

  appendAll(container, [
    el("h4", {}, t("creds_payin_heading")),
    el("p", { class: "creds-hint" }, t("creds_payin_hint")),
    el("div", { class: "creds-form-row" }, [el("div", { class: "form-field" }, [el("label", { class: "form-field__label" }, t("creds_country_label")), countrySelect])]),
    el("div", { class: "creds-form-row" }, [sandboxAppId.wrap, sandboxKey.wrap]),
    el("div", { class: "creds-form-row" }, [liveAppId.wrap, liveKey.wrap]),
    saveBtn,
    el("h5", { class: "creds-list__title" }, t("creds_configured_countries")),
    list,
  ]);
}

function renderPayoutSection(container, box, commit) {
  const sandboxAppId = labeledInput(t("creds_sandbox_appid"), "payoutSandboxAppId", box.value.payout?.sandbox?.appId);
  const sandboxKey = labeledInput(t("creds_sandbox_appkey"), "payoutSandboxKey", box.value.payout?.sandbox?.appKey, "password");
  const liveAppId = labeledInput(t("creds_live_appid"), "payoutLiveAppId", box.value.payout?.live?.appId);
  const liveKey = labeledInput(t("creds_live_appkey"), "payoutLiveKey", box.value.payout?.live?.appKey, "password");

  const saveBtn = el("button", { class: "btn btn-green btn-sm", type: "button" }, t("creds_save_payout"));

  saveBtn.addEventListener("click", () => {
    commit(
      setPayoutCreds(box.value, {
        sandbox: { appId: sandboxAppId.input.value.trim(), appKey: sandboxKey.input.value.trim() },
        live: { appId: liveAppId.input.value.trim(), appKey: liveKey.input.value.trim() },
      })
    );
  });

  appendAll(container, [
    el("h4", {}, t("creds_payout_heading")),
    el("p", { class: "creds-hint" }, t("creds_payout_hint")),
    el("div", { class: "creds-form-row" }, [sandboxAppId.wrap, sandboxKey.wrap]),
    el("div", { class: "creds-form-row" }, [liveAppId.wrap, liveKey.wrap]),
    saveBtn,
  ]);
}

export function renderCredentialsHub(container, creds, onChange) {
  clear(container);
  const box = { value: creds };
  const commit = (next) => {
    box.value = next;
    onChange(next);
  };
  const payinSection = el("section", { class: "creds-section" });
  const payoutSection = el("section", { class: "creds-section" });
  renderPayinSection(payinSection, box, commit);
  renderPayoutSection(payoutSection, box, commit);
  container.append(payinSection, el("hr", { class: "creds-divider" }), payoutSection);
}
