import { el, clear } from "./dom.js";
import { t, translateCountryName } from "../i18n.js";
import { PAYIN_TEST_DATA, PAYOUT_TEST_DATA } from "../data/docs/testData.js";
import { documentHintFor } from "../data/docs/countryDocInfo.js";
import { PAYIN_STATUSES, PAYOUT_STATUSES } from "../data/docs/statuses.js";
import { PAYIN_API_CODES, PAYOUT_API_CODES } from "../data/docs/apiCodes.js";
import { PAYOUT_REJECTION_REASONS } from "../data/docs/payoutRejectionReasons.js";

function generalTips() {
  return [
    t("hint_timestamp"),
    t("hint_currency"),
    t("hint_notify_url"),
    t("hint_unique_id"),
    t("hint_phone"),
    t("hint_amount_format"),
  ];
}

function tipList(items) {
  return el("ul", { class: "hint-list" }, items.map((text) => el("li", {}, text)));
}

function codeTable(rows, columns) {
  return el("table", { class: "hint-table" }, [
    el("tbody", {}, rows.map((row) =>
      el("tr", {}, columns.map((col) => el("td", {}, String(row[col] ?? ""))))
    )),
  ]);
}

function collapsible(title, bodyNode) {
  return el("details", { class: "hint-collapsible" }, [
    el("summary", {}, title),
    bodyNode,
  ]);
}

function countrySection(country) {
  const nodes = [];
  const docHint = documentHintFor(country.code);
  if (docHint) nodes.push(el("p", { class: "hint-line" }, [el("strong", {}, t("field_customer_doc_type") + ": "), docHint]));

  const payinData = PAYIN_TEST_DATA[country.code];
  if (payinData) {
    if (payinData.docNumber) {
      nodes.push(el("p", { class: "hint-line" }, [el("strong", {}, t("hints_label_document") + ": "), `${payinData.docType || ""} ${payinData.docNumber}`.trim()]));
    }
    if (payinData.phone) nodes.push(el("p", { class: "hint-line" }, [el("strong", {}, t("field_customer_phone") + ": "), payinData.phone]));
    if (payinData.zip) nodes.push(el("p", { class: "hint-line" }, [el("strong", {}, t("field_address_zip") + ": "), payinData.zip]));
    if (payinData.cards?.length) {
      nodes.push(el("p", { class: "hint-line" }, el("strong", {}, t("hints_label_test_cards"))));
      nodes.push(tipList(payinData.cards.map((c) => `${c.number} (${c.issuer}${c.expiry ? " · " + c.expiry : ""})`)));
      nodes.push(el("p", { class: "hint-line hint-line--muted" }, t("hints_label_card_note")));
    }
  }

  const payoutData = PAYOUT_TEST_DATA[country.code];
  if (payoutData?.length) {
    nodes.push(el("p", { class: "hint-line" }, el("strong", {}, t("hints_label_test_accounts"))));
    nodes.push(
      tipList(
        payoutData.map((row) => `${row.method} · ${row.status} → ${row.value}${row.note ? " (" + row.note + ")" : ""}`)
      )
    );
  }

  if (nodes.length === 0) return null;
  return el("div", { class: "hint-section" }, [
    el("h4", { class: "hint-section__title" }, t("hints_country_title", { country: translateCountryName(country) })),
    ...nodes,
  ]);
}

export function renderHints(container, { flow, country }) {
  clear(container);
  if (!flow) return;

  const sections = [
    el("div", { class: "hint-section" }, [
      el("h4", { class: "hint-section__title" }, t("hints_general_title")),
      tipList(generalTips()),
    ]),
  ];

  if (country && country.code) {
    const section = countrySection(country);
    if (section) sections.push(section);
  }

  const statuses = flow === "payout" ? PAYOUT_STATUSES : PAYIN_STATUSES;
  sections.push(
    collapsible(
      t("hints_statuses_title"),
      codeTable(statuses.map((s) => ({ a: s.status, b: s.meaning })), ["a", "b"])
    )
  );

  const apiCodes = flow === "payout" ? PAYOUT_API_CODES : PAYIN_API_CODES;
  sections.push(
    collapsible(
      t("hints_codes_title"),
      codeTable(apiCodes.map((c) => ({ a: c.code, b: c.meaning })), ["a", "b"])
    )
  );

  if (flow === "payout") {
    sections.push(
      collapsible(
        t("hints_rejection_title"),
        codeTable(PAYOUT_REJECTION_REASONS.map((r) => ({ a: r.reason, b: r.meaning })), ["a", "b"])
      )
    );
  }

  container.append(
    el("h3", { class: "hints-card__title" }, t("hints_panel_title")),
    ...sections
  );
}
