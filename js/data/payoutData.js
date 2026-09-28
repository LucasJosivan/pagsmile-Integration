export const PAYOUT_COUNTRIES = [
  { code: "ARG", name: "Argentina", currency: "ARS", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "600–2.500.000 ARS", eta: "1–3 dias úteis" },
  ]},
  { code: "BGD", name: "Bangladesh", currency: "BDT", methods: [
    { method: "Bkash", label: "Bkash", range: "100–30.000 (inteiros)", eta: "Instantâneo" },
    { method: "Nagad", label: "Nagad", range: "100–30.000 (inteiros)", eta: "Instantâneo" },
  ]},
  { code: "BRA", name: "Brasil", currency: "BRL", methods: [
    { method: "PIX", label: "PIX", range: "0.01–50.000 BRL", eta: "Instantâneo" },
    { method: "QRCODE", label: "QR Code", range: "0.01–15.000 BRL", eta: "Instantâneo" },
  ]},
  { code: "COL", name: "Colômbia", currency: "COP", methods: [
    { method: "Bre-B", label: "Bre-B", range: "1.000–11.550.000 (inteiros)", eta: "~1 minuto" },
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "1–20.000.000 (inteiros)", eta: "1h–3 dias úteis" },
    { method: "NEQUI", label: "Nequi", range: "1.000–1.000.000 (inteiros)", eta: "Instantâneo" },
    { method: "Transfiya", label: "Transfiya", range: "1.000–10.000.000 (inteiros)", eta: "Instantâneo" },
    { method: "WALLET", channel: "TPaga", label: "TPaga Wallet", range: "1–2.000.000 (inteiros)", eta: "Instantâneo" },
    { method: "WALLET", channel: "Nequi", label: "Nequi Wallet", range: "1.000–2.000.000 (inteiros)", eta: "Instantâneo" },
    { method: "CASHOUT", label: "Cashout", range: "20.000–1.500.000 (inteiros)", eta: "Instantâneo (janela de 30 dias)" },
  ]},
  { code: "CHL", name: "Chile", currency: "CLP", methods: [
    { method: "WALLET", channel: "Vita", label: "Vita Wallet", range: "5.000–2.000.000 (inteiros)", eta: "Instantâneo" },
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "1.000–2.000.000 (inteiros)", eta: "Instantâneo" },
  ]},
  { code: "CRI", name: "Costa Rica", currency: "CRC", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "600–1.000.000 CRC", eta: "1–3 dias úteis" },
  ]},
  { code: "ECU", name: "Equador", currency: "USD", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "$1–$1.000.000 USD", eta: "1h–3 dias úteis" },
  ]},
  { code: "GHA", name: "Gana", currency: "GHS", methods: [
    { method: "MOBILEMONEY", label: "Mobile Money", range: "10–10.000 GHS", eta: "~10 minutos" },
  ]},
  { code: "IND", name: "Índia", currency: "INR", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "Pessoa física: 100–50.000 · Empresa: 200.000–900.000 INR", eta: "Variável" },
  ]},
  { code: "JOR", name: "Jordânia", currency: "USD", methods: [
    { method: "CASH", channel: "UPT", label: "Cash (UPT)", range: "$1–$10.000 USD/EUR", eta: "Instantâneo (janela de 30 dias)" },
  ]},
  { code: "KAZ", name: "Cazaquistão", currency: "KZT", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "250–1.000.000 KZT", eta: "Instantâneo" },
  ]},
  { code: "KEN", name: "Quênia", currency: "KES", methods: [
    { method: "MOBILEMONEY", label: "Mobile Money", range: "10–150.000 (inteiros)", eta: "10 min–2 dias úteis" },
  ]},
  { code: "MEX", name: "México", currency: "MXN", methods: [
    { method: "SPEI", label: "SPEI", range: "0.01–400.000 MXN", eta: "Instantâneo" },
  ]},
  { code: "NPL", name: "Nepal", currency: "NPR", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "100–10.000.000 NPR", eta: "Instantâneo" },
    { method: "CASH", label: "Dinheiro (Cash)", range: "100–10.000.000 NPR", eta: "Saque pós-pagamento" },
    { method: "WALLET", channel: "IME", label: "IME Wallet", range: "100–999.999 NPR", eta: "Instantâneo" },
  ]},
  { code: "NGA", name: "Nigéria", currency: "NGN", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "100–10.000.000 NGN", eta: "Instantâneo" },
  ]},
  { code: "PRY", name: "Paraguai", currency: "PYG", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "1–2.000.000 (inteiros)", eta: "Instantâneo" },
  ]},
  { code: "PER", name: "Peru", currency: "PEN", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "0.01–500.000 PEN", eta: "1h–3 dias úteis" },
    { method: "QRCODE", label: "QR Code", range: "1–500.000 PEN", eta: "Instantâneo" },
    { method: "WALLET", channel: "yape", label: "Yape Wallet", range: "10–3.500 PEN", eta: "Instantâneo" },
    { method: "WALLET", channel: "Plin", label: "Plin Wallet", range: "10–500 PEN", eta: "Instantâneo" },
  ]},
  { code: "PHL", name: "Filipinas", currency: "PHP", methods: [
    { method: "PESONET", label: "PESONET", range: "5–400.000.000 PHP", eta: "1 dia útil" },
    { method: "INSTAPAY", label: "InstaPay", range: "1–50.000 PHP", eta: "Instantâneo" },
  ]},
  { code: "TUR", name: "Turquia", currency: "TRY", methods: [
    { method: "CASH", channel: "UPT", label: "UPT Cash", range: "10.00–100.000.00 TRY", eta: "Instantâneo (prazo de 7 dias)" },
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "1–350.000 TRY", eta: "Instantâneo" },
    { method: "WALLET", channel: "UPTION", label: "UPTION Wallet", range: "10–400.000 TRY", eta: "Instantâneo" },
  ]},
  { code: "URY", name: "Uruguai", currency: "UYU", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "1–1.000.000 UYU", eta: "5–7 dias úteis" },
  ]},
  { code: "VNM", name: "Vietnã", currency: "VND", methods: [
    { method: "BANKTRANSFER", label: "Transferência bancária", range: "10.000–5.000.000.000 VND", eta: "Não especificado" },
  ]},
  { code: "YEM", name: "Iêmen", currency: "USD", methods: [
    { method: "CASH", channel: "UPT", label: "Cash (UPT)", range: "$1–$10.000 USD", eta: "Instantâneo (janela de 30 dias)" },
  ]},
  { code: "", name: "Global (sem país específico)", currency: "USD", methods: [
    { method: "WALLET", channel: "PayPal", label: "PayPal", range: "$0.01–$50.000 USD", eta: "Instantâneo" },
  ]},
];
