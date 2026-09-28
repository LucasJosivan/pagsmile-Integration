// Extracted from https://docs.pagsmile.com/reference/payin/data/payin-status
// and https://docs.pagsmile.com/reference/payout/payout-status
export const PAYIN_STATUSES = [
  { status: "INITIAL", meaning: "Order created, waiting for the user to submit payment info." },
  { status: "PROCESSING", meaning: "User info submitted, waiting for payment confirmation." },
  { status: "SUCCESS", meaning: "Transaction completed successfully." },
  { status: "REFUSED", meaning: "Trade has been refused." },
  { status: "REFUSE_FAILED", meaning: "Trade failed to be refused." },
  { status: "CANCEL", meaning: "Transaction terminated by the user or merchant." },
  { status: "EXPIRED", meaning: "Trade reached its time limit." },
  { status: "REFUND_VERIFYING", meaning: "Refund submitted, waiting for the user to provide bank info." },
  { status: "REFUND_PROCESSING", meaning: "Refund is underway." },
  { status: "REFUND_REVOKE", meaning: "Refund cancelled or expired." },
  { status: "REFUND_REFUSED", meaning: "Refund refused, usually due to incorrect bank info." },
  { status: "REFUNDED", meaning: "Transaction refunded (including partial refunds)." },
  { status: "RISK_CONTROLLING", meaning: "Considered high risk or unclear billing info (Credit Card only)." },
  { status: "DISPUTE", meaning: "Transaction is contested (Credit Card only)." },
  { status: "CHARGEBACK", meaning: "Cardholder disputed the charge (Credit Card only)." },
  { status: "CHARGEBACK_REVERSED", meaning: "Chargeback was overturned (Credit Card only)." },
];

export const PAYOUT_STATUSES = [
  { status: "IN_PROCESSING", meaning: "Initial status right after submitting the payout." },
  { status: "PROCESSING", meaning: "Bank is processing the payout." },
  { status: "PAID", meaning: "Payout finished successfully." },
  { status: "REJECTED", meaning: "Payout rejected by the bank." },
  { status: "REFUNDED", meaning: "Payout refunded by the user or bank." },
  { status: "PARTIAL_REFUNDED", meaning: "Payout partially refunded by the user or bank." },
];
