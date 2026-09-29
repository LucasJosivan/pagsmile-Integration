export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  node.innerHTML = "";
}

export function appendAll(node, children) {
  node.append(...children.filter((c) => c != null));
}

export function optionCard({ title, subtitle, onClick, selected }) {
  return el(
    "button",
    { class: `option-card${selected ? " option-card--selected" : ""}`, type: "button", onclick: onClick },
    [
      el("span", { class: "option-card__title" }, title),
      subtitle ? el("span", { class: "option-card__subtitle" }, subtitle) : null,
    ]
  );
}

function fieldHelp(hint) {
  if (!hint) return null;
  return el("span", { class: "field-help" }, [
    el("button", { type: "button", class: "field-help__btn", "aria-label": "?" }, "?"),
    el("span", { class: "field-help__bubble", role: "tooltip" }, hint),
  ]);
}

export function field({
  key, label, type = "text", placeholder = "", value = "", options = [], required = false, readOnly = false, hint = "",
  pattern = "", inputMode = "", maxLength = "", min = "", step = "",
}) {
  const inputId = `f-${key}`;
  let input;
  if (type === "select") {
    input = el(
      "select",
      { id: inputId, name: key, class: "ps-input", ...(required ? { required: "required" } : {}) },
      options.map((opt) =>
        el("option", { value: opt.value, ...(opt.value === value ? { selected: "selected" } : {}) }, opt.label)
      )
    );
  } else {
    input = el("input", {
      id: inputId,
      name: key,
      type,
      class: `ps-input${readOnly ? " ps-input--readonly" : ""}`,
      placeholder,
      value,
      ...(required ? { required: "required" } : {}),
      ...(readOnly ? { readonly: "readonly", tabindex: "-1" } : {}),
      ...(pattern ? { pattern } : {}),
      ...(inputMode ? { inputMode } : {}),
      ...(maxLength ? { maxLength } : {}),
      ...(min ? { min } : {}),
      ...(step ? { step } : {}),
    });
  }
  return el("div", { class: "form-field" }, [
    el("label", { for: inputId, class: "form-field__label" }, [
      label,
      required ? el("span", { class: "form-field__required", "aria-hidden": "true" }, " *") : null,
      fieldHelp(hint),
    ]),
    input,
  ]);
}

export function readFormValues(container) {
  const values = {};
  container.querySelectorAll("input, select, textarea").forEach((elm) => {
    if (elm.name) values[elm.name] = elm.value;
  });
  return values;
}
