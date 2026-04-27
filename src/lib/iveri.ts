/**
 * iVeri Lite — Full Redirect to the Hosted Payment Page (not LiteBox).
 *
 * We intentionally do **not** use the LiteBox modal (`jquery.litebox.js`). Full Redirect
 * posts the browser to `…/Lite/Authorise.aspx` and returns via success/fail/error URLs—
 * reliable across ad blockers, corporate firewalls, and strict browser privacy settings.
 * LiteBox is optional in iVeri’s guide; this integration matches the “primary” flow above.
 *
 * Field construction belongs in a trusted server route (`/api/payments/iveri/start`) so
 * amount, application id, and trace cannot be tampered with from the client.
 *
 * @see https://www.iveri.co.za/docs/lite-developer-guide-9
 */

import { createHash } from "crypto";

const DEFAULT_GATEWAY = "https://portal.host.iveri.com/Lite/Authorise.aspx";
/** Hash input for Lite_Transaction_Token; must use the same resource string as the hosted pay page. */
const TOKEN_RESOURCE = "/Lite/Authorise.aspx";
const DEFAULT_INFO_GATEWAY = "https://portal.host.iveri.com/Lite/AuthoriseInfo.aspx";

/**
 * iVeri Back Office → Application Identifiers (copy-paste, must match exactly):
 *   Live:  98f2d5ee-bb8d-4997-87e2-55b8bc9674a2  → set IVERI_APPLICATION_ID on Vercel Production
 *   Test:  16fa0788-9cda-433b-be56-a00975d7667a  → Preview/sandbox, or this fallback
 *
 * Fallback is used only when IVERI_APPLICATION_ID / IVERI_APP_ID are unset.
 */
const IVERI_SANDBOX_FALLBACK_APPLICATION_ID = "16fa0788-9cda-433b-be56-a00975d7667a";

export function formatIveriApplicationId(raw: string): string {
  const inner = raw.trim().replace(/^\{|\}$/g, "").toUpperCase();
  return `{${inner}}`;
}

/** Raw Application ID from env (no braces), else sandbox fallback. Use on payment start and AuthoriseInfo. */
export function getIveriApplicationId(): string {
  const fromEnv =
    process.env.IVERI_APPLICATION_ID?.trim() || process.env.IVERI_APP_ID?.trim() || "";
  if (fromEnv) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[iveri] IVERI_APPLICATION_ID / IVERI_APP_ID not set; using built-in sandbox Application ID. " +
        "Set IVERI_APPLICATION_ID in the environment (e.g. Vercel) for live or explicit test config."
    );
  }
  return IVERI_SANDBOX_FALLBACK_APPLICATION_ID;
}

function unixTimeUtcSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * When BackOffice has "Enable Token Verification" = Yes and a Lite Shared Secret.
 * Concat order: secretKey + time + resource + applicationId + amount + email
 * The `email` string must be **byte-identical** to `Ecom_BillTo_Online_Email` on the submitted form.
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
  const email = input.email.trim().slice(0, 40);
  const merchantReference = input.merchantReference.trim().slice(0, 20);
  const merchantTrace = input.merchantTrace.trim().slice(0, 64);
  if (!email) {
    throw new Error("Invalid email for payment");
  }
  /** Use API route so iVeri's POST-back is accepted; route 303-redirects to the public page (GET-only). */
  const q = (kind: string) =>
    `${base}/api/payments/iveri/return?kind=${encodeURIComponent(kind)}&trace=${encodeURIComponent(merchantTrace)}`;

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
    Ecom_BillTo_Online_Email: email,
    Ecom_Payment_Card_Protocols: "IVERI",
    /** Prefer a merchant-set order id; iVeri only recommends AUTOGENERATE if impossible. */
    Ecom_ConsumerOrderID: merchantReference,
    Ecom_TransactionComplete: "False",
    Lite_Merchant_Trace: merchantTrace,
    MerchantReference: merchantReference,
    Lite_Currency_AlphaCode: (input.currencyAlphaCode ?? "USD").slice(0, 3),
  };

  if (input.sharedSecret?.trim()) {
    fields.Lite_Transaction_Token = generateLiteTransactionToken(
      input.sharedSecret.trim(),
      appBraced,
      amountStr,
      email
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

/** Post-payment transaction status (same host family as the Authorise payment URL). */
export function defaultIveriAuthoriseInfoUrl(gatewayUrl?: string): string {
  if (process.env.IVERI_AUTHORISE_INFO_URL?.trim()) {
    return process.env.IVERI_AUTHORISE_INFO_URL.trim();
  }
  const g = (gatewayUrl || defaultIveriGatewayUrl()).trim();
  if (g.includes("Authorise.aspx")) {
    return g.replace(/Authorise\.aspx/gi, "AuthoriseInfo.aspx");
  }
  return DEFAULT_INFO_GATEWAY;
}

export type LiteAuthoriseInfoResult = {
  ok: boolean;
  httpStatus: number;
  /** True if gateway reports an approved / successful card authorisation. */
  approved: boolean;
  cardStatus: string;
  error?: string;
  /** Truncated raw response for logs only (not for UI). */
  rawExcerpt: string;
};

/**
 * Server-side: query the hosted gateway for the latest status of a transaction.
 * @see iVeri Lite — AuthoriseInfo.aspx; use with `Lite_Merchant_Trace` (or `OriginalMerchantTrace` per your acquirer).
 */
export async function queryLiteAuthoriseInfo(input: {
  applicationIdRaw: string;
  merchantTrace: string;
  authoriseInfoUrl?: string;
}): Promise<LiteAuthoriseInfoResult> {
  const appBraced = formatIveriApplicationId(input.applicationIdRaw);
  const url = (input.authoriseInfoUrl || defaultIveriAuthoriseInfoUrl()).trim();
  const trace = input.merchantTrace.trim();
  if (!trace) {
    return {
      ok: false,
      httpStatus: 0,
      approved: false,
      cardStatus: "",
      error: "Missing merchant trace",
      rawExcerpt: "",
    };
  }
  const body = new URLSearchParams({
    Lite_Merchant_ApplicationId: appBraced,
    /** Match the trace sent in the initial Lite authorisation. */
    Lite_Merchant_Trace: trace,
  });
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { ok: false, httpStatus: 0, approved: false, cardStatus: "", error: msg, rawExcerpt: "" };
  }
  const text = await res.text();
  const rawExcerpt = text.slice(0, 2000);
  const parsed = parseAuthoriseInfoResponse(text);
  return {
    ok: res.ok,
    httpStatus: res.status,
    approved: parsed.approved,
    cardStatus: parsed.cardStatus,
    error: parsed.approved ? undefined : parsed.error,
    rawExcerpt,
  };
}

function parseAuthoriseInfoResponse(htmlOrText: string): {
  approved: boolean;
  cardStatus: string;
  error?: string;
} {
  const t = htmlOrText;
  const statusMatch =
    /name=["']Lite_Payment_Card_Status["'][^>]*value=["'](\d*)["']/i.exec(t) ||
    /Lite_Payment_Card_Status=(\d+)/i.exec(t) ||
    /Lite_Payment_Card_Status[^;\s]+[;\s]+(\d+)/i.exec(t);
  const st = (statusMatch?.[1] ?? "").trim();
  if (st === "0" || st === "00") {
    return { approved: true, cardStatus: st };
  }
  const desc =
    /name=["']Lite_Result_Description["'][^>]*value=["']([^"']*)["']/i.exec(t)?.[1] ||
    /Lite_Result_Description=([^&<\s]+)/i.exec(t)?.[1] ||
    "";
  return {
    approved: false,
    cardStatus: st,
    error: desc ? desc.slice(0, 200) : st ? `Card status: ${st}` : "Could not parse AuthoriseInfo response",
  };
}
