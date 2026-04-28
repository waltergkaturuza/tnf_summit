import type { LiteAuthoriseInfoResult } from "./iveri";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * One JSON object per line, prefix `[iveri-cert]` for Vercel / function log search.
 * Shape is inspired by typical acquirer certification exports (success, status, code, description, amounts).
 * Do not log full card numbers — gateway usually masks PAN in return fields; we never add PAN in code.
 */

/** Store payload in `audit_trail` so Admin → Payments → Card activity can list interactions (Vercel logs are not queryable in-app). */
function persistIveriGatewayAudit(details: Record<string, unknown>): void {
  if (!supabaseAdmin) return;
  const ref = String(details.registrationRef ?? "").trim();
  void supabaseAdmin
    .schema("tnf_summit")
    .from("audit_trail")
    .insert({
      action: "iveri_gateway_event",
      entity_type: "iveri_lite",
      entity_id: ref.slice(0, 200) || "—",
      entity_label: `${String(details.event ?? "iveri")} · ${ref.slice(0, 40) || "?"}`,
      performed_by: "system",
      details,
    })
    .then(({ error }) => {
      if (error) console.warn("[iveri-cert] audit_trail insert failed:", error.message);
    });
}

function pick(out: URLSearchParams, ...keys: string[]): string {
  for (const k of keys) {
    const v = out.get(k) ?? out.get(k.toLowerCase());
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

export function logIveriStartCert(input: {
  trackId: string;
  amountUsd: number;
  category: string;
  payerEmail: string;
}): void {
  const line = {
    event: "iveri_start" as const,
    registrationRef: input.trackId,
    amount: String(Math.round(input.amountUsd * 100)),
    amountDisplayUsd: input.amountUsd,
    currency: "USD",
    category: input.category,
    email: input.payerEmail,
    createdAt: new Date().toISOString(),
  };
  console.log(`[iveri-cert] ${JSON.stringify(line)}`);
  persistIveriGatewayAudit(line);
}

export function logIveriReturnCert(input: {
  method: "GET" | "POST";
  out: URLSearchParams;
  authorise: LiteAuthoriseInfoResult | null;
  dbMarkedPaid: boolean;
  authoriseSkipped?: string;
}): void {
  const out = input.out;
  const trace = pick(out, "trace", "Lite_Merchant_Trace", "lite_merchant_trace");
  const kind = pick(out, "kind") || "";
  const cardStatus = pick(out, "Lite_Payment_Card_Status", "lite_payment_card_status", "Lite_Payment_CardStatus");
  const resultDesc = pick(out, "Lite_Result_Description", "lite_result_description");
  const amountCents = pick(out, "Lite_Order_Amount", "lite_order_amount");
  const currency = pick(out, "Lite_Currency_AlphaCode", "lite_currency_alphacode") || "USD";
  const email = pick(out, "Ecom_BillTo_Online_Email", "ecom_billto_online_email");
  const transactionIndex = pick(
    out,
    "Lite_Transaction_Index",
    "Lite_TransactionIndex",
    "lite_transaction_index",
    "TransactionIndex"
  );
  const acquirerRef = pick(out, "Lite_Acquirer_Reference", "acquirerReference", "Lite_Result_Acquirer_Reference");

  const auth = input.authorise;
  /** AuthoriseInfo confirmed approved card status (equivalent to certification “success” on auth). */
  const authorisationApproved = auth != null && auth.approved;

  const line: Record<string, unknown> = {
    event: "iveri_return",
    method: input.method,
    registrationRef: trace,
    returnKind: kind,
    success: authorisationApproved,
    dbPaymentStatusUpdated: input.dbMarkedPaid,
    status: cardStatus || (auth?.cardStatus ?? ""),
    code: cardStatus || (auth?.cardStatus ?? ""),
    description: resultDesc || auth?.error || "",
    amount: amountCents,
    currency,
    itemDescription: "TNF registration fee",
    email: email || undefined,
    authorisationCode: pick(out, "Lite_Authorisation_Code", "Lite_Authorization_Code", "lite_authorisation_code") || undefined,
    transactionIndex: transactionIndex || undefined,
    acquirerReference: acquirerRef || undefined,
    authoriseInfoHttp: auth?.httpStatus ?? null,
    authoriseInfoApproved: authorisationApproved,
    authoriseInfoError: auth && !auth.approved ? auth.error ?? null : null,
    authoriseSkipped: input.authoriseSkipped,
    createdAt: new Date().toISOString(),
  };

  // Align naming with common cert spreadsheets (only when authorise failed but we have a message)
  if (!authorisationApproved && auth?.error) {
    line.description = (line.description as string) || auth.error;
  }

  console.log(`[iveri-cert] ${JSON.stringify(line)}`);
  persistIveriGatewayAudit(line);
}
