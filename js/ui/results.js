import { el, clear } from "./dom.js";
import { t } from "../i18n.js";
import { getErrorSuggestion } from "../core/errorSuggestions.js";

function isSuccessResponse(ok, code) {
  return ok && String(code).startsWith("1");
}

function supportCta() {
  return el("div", { class: "support-cta" }, [
    el("span", { class: "support-cta__text" }, t("support_cta_text")),
    el(
      "button",
      { class: "btn btn-outline btn-sm", type: "button", onclick: () => window.__pagsmileOpenSupport?.() },
      t("support_cta_button")
    ),
  ]);
}

function badgeForStatus(ok, code) {
  const isSuccess = isSuccessResponse(ok, code);
  return el(
    "span",
    { class: `badge badge--${isSuccess ? "sucesso" : "erro"}` },
    isSuccess ? t("result_success_badge") : t("result_error_badge")
  );
}

export function renderResult(container, { httpStatus, ok, body }) {
  clear(container);
  const isSuccess = isSuccessResponse(ok, body.code);

  const header = el("div", { class: "result-header" }, [
    badgeForStatus(ok, body.code),
    el("span", { class: "result-header__http" }, `HTTP ${httpStatus}`),
  ]);

  const highlights = el("div", { class: "result-highlights" });
  const fieldsToShow = [
    ["trade_no", "Transaction ID"],
    ["out_trade_no", "Order ID"],
    ["id", "Payout ID"],
    ["trade_status", "Status"],
    ["status", "Status"],
    ["msg", t("result_label_message")],
    ["sub_msg", t("result_label_error_detail")],
  ];
  for (const [key, label] of fieldsToShow) {
    const value = body[key] ?? body.data?.[key];
    if (value) {
      highlights.appendChild(
        el("div", { class: "result-highlights__item" }, [
          el("span", { class: "result-highlights__label" }, label),
          el("span", { class: "result-highlights__value" }, String(value)),
        ])
      );
    }
  }

  const actionLink = body.web_url || body.pay_url || body.wallet_url || body.app_link_url;
  const actionsBox = actionLink
    ? el("div", { class: "result-actions" }, [
        el("a", { class: "btn btn-green", href: actionLink, target: "_blank", rel: "noopener" }, t("result_open_payment_link")),
      ])
    : null;

  const copyPaste = body.qr_code || body.barcode;
  const copyBox = copyPaste
    ? el("div", { class: "pix-copy-paste" }, [
        el("div", { class: "pix-copy-paste__label" }, t("result_copy_qr_label")),
        el("div", { class: "pix-copy-paste__code" }, copyPaste),
      ])
    : null;

  const suggestionBox = !isSuccess
    ? el("div", { class: "alert alert--info" }, [
        el("strong", {}, t("result_suggestion_title")),
        el("p", {}, getErrorSuggestion({ httpStatus, body })),
      ])
    : null;

  const raw = el("pre", { class: "code-block" }, JSON.stringify(body, null, 2));
  const cta = !isSuccess ? supportCta() : null;

  container.append(...[header, highlights, actionsBox, copyBox, suggestionBox, raw, cta].filter((n) => n != null));
}

export function renderError(container, error) {
  clear(container);
  container.append(
    el("div", { class: "alert alert--erro" }, [
      el("strong", {}, t("result_error_title")),
      el("p", {}, error.message),
    ]),
    supportCta()
  );
}
