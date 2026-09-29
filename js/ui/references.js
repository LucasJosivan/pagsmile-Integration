import { el, clear } from "./dom.js";
import { t, translateCountryName, translateMethodLabel } from "../i18n.js";
import { REFERENCE_LINKS, methodDocLink } from "../data/docs/methodDocs.js";

function linkRow(label, url) {
  return el("li", { class: "reference-list__item" }, [
    el("a", { href: url, target: "_blank", rel: "noopener" }, label),
  ]);
}

export function renderReferences(container, { flow, country, methodInfo, integrationType }) {
  clear(container);
  if (!flow) return;

  const rows = [];

  const methodLink = country?.code ? methodDocLink(flow, country.code) : null;
  if (methodLink) {
    const methodLabel = methodInfo ? translateMethodLabel(methodInfo) : null;
    const title = methodLabel
      ? t("reference_method_guide", { method: methodLabel, country: translateCountryName(country) })
      : t("reference_country_guide", { country: translateCountryName(country) });
    rows.push(linkRow(title, methodLink));
  }

  rows.push(linkRow(t("reference_country_info"), REFERENCE_LINKS.countryInfo));

  if (flow === "payin") {
    rows.push(linkRow(t("reference_payin_country_code"), REFERENCE_LINKS.payinCountryCode));
    rows.push(linkRow(t("reference_payin_test_data"), REFERENCE_LINKS.payinTestData));
    rows.push(linkRow(t("reference_payin_status"), REFERENCE_LINKS.payinStatus));
    rows.push(linkRow(t("reference_payin_api_code"), REFERENCE_LINKS.payinApiCode));
  } else {
    rows.push(linkRow(t("reference_payout_test_data"), REFERENCE_LINKS.payoutTestData));
    rows.push(linkRow(t("reference_payout_status"), REFERENCE_LINKS.payoutStatus));
    rows.push(linkRow(t("reference_payout_api_code"), REFERENCE_LINKS.payoutApiCode));
    rows.push(linkRow(t("reference_payout_rejection_reasons"), REFERENCE_LINKS.payoutRejectionReasons));
  }

  container.append(
    el("h3", { class: "hints-card__title" }, t("references_panel_title")),
    el("ul", { class: "reference-list" }, rows)
  );
}
