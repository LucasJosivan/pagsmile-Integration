// Extracted from https://docs.pagsmile.com/reference/payin/data/data-for-test-sandbox
// and https://docs.pagsmile.com/reference/payout/data-for-test
export const PAYIN_TEST_DATA = {
  BRA: { docType: "CPF", docNumber: "11032341882", phone: "5511987654321", zip: "38082365",
    cards: [{ number: "4000000000000002", issuer: "Visa" }, { number: "5555555555554444", issuer: "Mastercard" }] },
  MEX: { docType: "RFC", docNumber: "MAMB780915969", phone: "523135759140", zip: "37900",
    cards: [{ number: "4242424242424242", issuer: "Visa", expiry: "2/2025" }, { number: "4075595716483764", issuer: "Visa" }] },
  COL: { docType: "CC ou NIT", docNumber: "123412312 (CC) / 1234123121 (NIT)", phone: "573020481705", zip: "300760",
    cards: [{ number: "5413330089020011", issuer: "Visa" }] },
  CHL: { docType: "RUT/RUN", docNumber: "36987747K", phone: "56233145118", zip: "3007601",
    cards: [{ number: "4005520000000129", issuer: "Visa" }] },
  ARG: { docType: "DNI/CUIT/CUIL/CDI", docNumber: "40754127 (DNI) / 20115872045 (CUIT)", phone: "5491132463876", zip: "101113" },
  PER: { docType: "DNI ou RUC", docNumber: "50284414727 (RUC)", phone: "51980302848", zip: "01130",
    cards: [{ number: "4012001037141112", issuer: "Visa" }] },
  PHL: { phone: "639511331388" },
};

// Structured sandbox scenarios used to auto-fill the payout form when the
// merchant picks "Success" or "Rejected" as the expected result. Keyed by
// country code, then by `method` (or `method:channel` when the method has
// multiple channels), matching the literal values in data/payoutData.js.
export const PAYOUT_TEST_SCENARIOS = {
  ARG: {
    BANKTRANSFER: {
      paid: { account: "0110599520000012345678" },
      rejected: { account: "0270218820054311290067" },
    },
  },
  BRA: {
    PIX: {
      paid: { account: "pagsmile_test_paid@pagsmile.com", document_id: "11032341882" },
      rejected: { account: "pagsmile_test_reject@pagsmile.com", document_id: "46815328430" },
    },
    QRCODE: {
      paid: { account: "***SUCCESS" },
      rejected: { account: "***REFUSED" },
    },
  },
  MEX: {
    SPEI: {
      paid: { account: "002010077777777771" },
      rejected: { account: "014027000005555558" },
    },
  },
  CHL: {
    BANKTRANSFER: {
      paid: { account: "222222222222" },
      rejected: { account: "111111111111" },
    },
    "WALLET:Vita": {
      paid: { account: "paid@pagsmile.com" },
      rejected: { account: "rejected@pagsmile.com" },
    },
  },
  COL: {
    BANKTRANSFER: {
      paid: { account: "222222222222" },
      rejected: { account: "111111111111" },
    },
    Transfiya: {
      paid: { account: "572222222222" },
      rejected: { account: "571111111111" },
    },
    "WALLET:TPaga": {
      paid: { account: "+57322222222" },
      rejected: { account: "+57311111111" },
    },
  },
  PER: {
    BANKTRANSFER: {
      paid: { account: "2222222222222" },
      rejected: { account: "1111111111111" },
    },
  },
  ECU: {
    BANKTRANSFER: {
      paid: { account: "2222222222" },
      rejected: { account: "1111111111" },
    },
  },
  URY: {
    BANKTRANSFER: {
      paid: { account: "000001111111" },
    },
  },
};

export function payoutScenarioKey(methodInfo) {
  if (!methodInfo) return "";
  return methodInfo.channel ? `${methodInfo.method}:${methodInfo.channel}` : methodInfo.method;
}

export function findPayoutScenario(countryCode, methodInfo, scenario) {
  const forMethod = PAYOUT_TEST_SCENARIOS[countryCode]?.[payoutScenarioKey(methodInfo)];
  return forMethod?.[scenario] || null;
}
