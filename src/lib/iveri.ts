/**
 * iVeri Lite — Full Redirect form fields (Hosted Payment Page).
 * @see https://www.iveri.co.za/docs/lite-developer-guide-9
 */

import { createHash } from "crypto";

const DEFAULT_GATEWAY = "https://portal.host.iveri.com/Lite/Authorise.aspx";
const TOKEN_RESOURCE = "/Lite/Authorise.aspx";

export function formatIveriApplicationId(raw: string): string {
  const inner = raw.trim().replace(/^\{|\}$/g, "").toUpperCase();
  return `{${inner}}`;
}

function unixTimeUtcSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * When BackOffice has "Enable Token Verification" = Yes and a Lite Shared Secret.
 * Concat order: secretKey + time + resource + applicationId + amount + email
 */
export function generateLiteTransactionToken(
  secretKey: string,
  applicationIdBraced: string,
  amountCents: string,
  email: string
): string {
  const time = String(unixTimeUtcSeconds());
  const payload = secretKey + time + TOKEN_RESOURCE + applicationIdBraced + amountCents + email;
  const hash = createHash("sha256").update(payload, "ascii").digest("hex");
  return `${time}:${hash}`;
}

export type BuildIveriLiteFormInput = {
  applicationIdRaw: string;
  gatewayUrl?: string;
  sharedSecret?: string;
  /** Total charge in USD (e.g. 400) */
  amountUsd: number;
  email: string;
  /** Shown on statement / reconciliation; max 20 chars per spec */
  merchantReference: string;
  /** Correlates with registration; max 64 */
  merchantTrace: string;
  lineItemDescription: string;
  baseUrl: string;
  currencyAlphaCode?: string;
};

export function buildIveriLiteFormFields(input: BuildIveriLiteFormInput): { action: string; fields: Record<string, string> } {
  const amountCents = Math.round(input.amountUsd * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("Invalid payment amount");
  }
  const amountStr = String(amountCents);
  const appBraced = formatIveriApplicationId(input.applicationIdRaw);
  const base = input.baseUrl.replace(/\/$/, "");
  const q = (kind: string) =>
    `${base}/registration/payment-complete?kind=${encodeURIComponent(kind)}&trace=${encodeURIComponent(input.merchantTrace)}`;

  const fields: Record<string, string> = {
    Lite_Merchant_ApplicationId: appBraced,
    Lite_Order_Amount: amountStr,
    Lite_Website_Successful_Url: q("success"),
    Lite_Website_Fail_Url: q("fail"),
    Lite_Website_TryLater_Url: q("trylater"),
    Lite_Website_Error_Url: q("error"),
    Lite_Order_LineItems_Product_1: input.lineItemDescription.slice(0, 255),
    Lite_Order_LineItems_Quantity_1: "1",
    Lite_Order_LineItems_Amount_1: amountStr,
    Lite_ConsumerOrderID_PreFix: "TNF",
    Ecom_BillTo_Online_Email: input.email.slice(0, 40),
    Ecom_Payment_Card_Protocols: "IVERI",
    Ecom_ConsumerOrderID: "AUTOGENERATE",
    Ecom_TransactionComplete: "False",
    Lite_Merchant_Trace: input.merchantTrace.slice(0, 64),
    MerchantReference: input.merchantReference.slice(0, 20),
    Lite_Currency_AlphaCode: (input.currencyAlphaCode ?? "USD").slice(0, 3),
  };

  if (input.sharedSecret?.trim()) {
    fields.Lite_Transaction_Token = generateLiteTransactionToken(
      input.sharedSecret.trim(),
      appBraced,
      amountStr,
      input.email.trim()
    );
  }

  return {
    action: input.gatewayUrl?.trim() || DEFAULT_GATEWAY,
    fields,
  };
}

export function defaultIveriGatewayUrl(): string {
  return process.env.IVERI_GATEWAY_URL?.trim() || DEFAULT_GATEWAY;
}
