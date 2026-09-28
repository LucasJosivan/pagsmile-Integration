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

export const CARD_TEST_NOTE = "Nome do titular para todos os cartões de teste: \"APRO\".";

// Sandbox behaviors that force a specific final status, by country/method.
export const PAYOUT_TEST_DATA = {
  ARG: [
    { method: "Transferência bancária", status: "PAID", value: "0110599520000012345678", note: "processa em ~10 minutos" },
    { method: "Transferência bancária", status: "REJECTED", value: "0270218820054311290067" },
    { method: "Wallet (MercadoPago)", status: "PAID", value: "0000003140090418135201", note: "instantâneo" },
  ],
  BRA: [
    { method: "PIX", status: "PAID", value: "pagsmile_test_paid@pagsmile.com / CPF 11032341882 / CNPJ 44526700000190" },
    { method: "PIX", status: "REJECTED", value: "pagsmile_test_reject@pagsmile.com / CPF 46815328430 / CNPJ 66001157000140" },
    { method: "PIX", status: "REFUNDED", note: "vira PAID e após 10s muda para REFUNDED", value: "pagsmile_test_refund@pagsmile.com / CPF 22747936708" },
    { method: "Transferência bancária", status: "PAID", value: "conta 22222222 + CPF 50284414727", note: "processa em ~10 minutos" },
    { method: "Transferência bancária", status: "REJECTED", value: "conta 11111111" },
    { method: "Transferência bancária", status: "REFUNDED", value: "conta 33333333" },
    { method: "QR Code", status: "PAID", value: "QR contendo \"***SUCCESS\"" },
    { method: "QR Code", status: "REJECTED", value: "QR contendo \"***REFUSED\"" },
    { method: "QR Code", status: "REFUNDED", value: "QR contendo \"***REFUND\"" },
  ],
  MEX: [
    { method: "SPEI", status: "PAID", value: "CLABE 002010077777777771", note: "processa em ~10 minutos" },
    { method: "SPEI", status: "REJECTED", value: "CLABE 014027000005555558" },
    { method: "SPEI", status: "REFUNDED", value: "CLABE 002010088888888881" },
  ],
  CHL: [
    { method: "Transferência bancária", status: "PAID", value: "conta 222222222222", note: "processa em ~10 minutos" },
    { method: "Transferência bancária", status: "REJECTED", value: "conta 111111111111" },
    { method: "Wallet (Mach)", status: "PAID", value: "e-mail paid@pagsmile.com" },
    { method: "Wallet (Mach)", status: "REJECTED", value: "e-mail rejected@pagsmile.com" },
  ],
  COL: [
    { method: "Transferência bancária", status: "PAID", value: "conta 222222222222", note: "processa em ~10 minutos" },
    { method: "Transferência bancária", status: "REJECTED", value: "conta 111111111111" },
    { method: "Wallet (Tpaga)", status: "PAID", value: "+57322222222" },
    { method: "Wallet (Tpaga)", status: "REJECTED", value: "+57311111111" },
    { method: "Transfiya", status: "PAID", value: "572222222222" },
    { method: "Transfiya", status: "REJECTED", value: "571111111111" },
  ],
  PER: [
    { method: "Transferência bancária", status: "PAID", value: "conta 2222222222222", note: "processa em ~1 dia" },
    { method: "Transferência bancária", status: "REJECTED", value: "conta 1111111111111" },
  ],
  ECU: [
    { method: "Transferência bancária", status: "PAID", value: "conta 2222222222", note: "processa em ~1 dia" },
    { method: "Transferência bancária", status: "REJECTED", value: "conta 1111111111" },
  ],
  URY: [
    { method: "Transferência bancária", status: "PAID", value: "conta 000001111111", note: "processa em ~1 dia" },
  ],
};
