// Extracted from https://docs.pagsmile.com/reference/country-info
export const COUNTRY_DOC_INFO = {
  ARG: "DNI (8 dígitos), CUIT (11 dígitos) ou CUIL (11 dígitos)",
  BRA: "CPF (11 dígitos) ou CNPJ (14 dígitos)",
  CHL: "RUT/RUN (9 caracteres alfanuméricos)",
  COL: "CC (6–10 dígitos) ou NIT (10–11 dígitos)",
  ECU: "CI (10 dígitos), RUC (13 dígitos) ou Passaporte",
  MEX: "RFC (12–13 caracteres) ou CURP (18 caracteres)",
  PER: "DNI (8 dígitos) ou RUC (11 dígitos)",
};

export function documentHintFor(countryCode) {
  return COUNTRY_DOC_INFO[countryCode] || null;
}
