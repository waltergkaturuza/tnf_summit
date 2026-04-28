# iVeri / card payments — certification testing

Each hosted payment run emits **one line per API step** in Vercel (or local terminal) with prefix **`[iveri-cert]`** followed by a JSON object. This is intended for test evidence similar to third-party “payment export” JSON (e.g. success, status, code, description, amount, email).

## Capturing logs

1. Vercel → your project → **Logs** (or the deployment’s **Functions** log stream).
2. Filter by: **`[iveri-cert]`** (or export log range after test day).
3. Lines are valid JSON after the prefix; you can concatenate into an array for submission.

The same payload is also stored in Supabase **`audit_trail`** with action **`iveri_gateway_event`** (when `SUPABASE_SERVICE_ROLE_KEY` is set on the server). View it under **Admin → Payments & Invoices → Card activity**.

## Events

| `event`        | When |
|----------------|------|
| `iveri_start`  | `POST /api/payments/iveri/start` returned form fields to the browser (amount, `registrationRef`, category, email). |
| `iveri_return` | After `GET` or `POST` `/api/payments/iveri/return`, merged gateway fields + **AuthoriseInfo** result + whether Supabase `payment_status` was set to `paid`. |

## Important fields (return)

- **`success` / `authoriseInfoApproved`**: AuthoriseInfo agreed the transaction is approved (`Lite_Payment_Card_Status` `0` / `00`).
- **`dbPaymentStatusUpdated`**: Registration row was updated to `paid` (requires `SUPABASE_SERVICE_ROLE_KEY` on the server).
- **`description`**: Gateway / AuthoriseInfo message (e.g. decline, invalid card, configuration errors).
- **`amount`**: Often **cents** as string if the gateway echoed `Lite_Order_Amount` (matches iVeri).
- We **do not** log full card numbers. Masked PAN may appear only if iVeri includes it in return fields.

## Suggested test matrix (sandbox)

Run these on **Test** Application ID; use card numbers your **acquirer / iVeri test guide** supplies (examples below are common test patterns — confirm against your current iVeri document):

1. **Approved** — successful auth; expect `authoriseInfoApproved: true`, then `dbPaymentStatusUpdated: true` when Supabase is configured.
2. **Declined** — issuer decline; expect `success: false`, non-empty `description`.
3. **Invalid PAN / format** — expect failure before or at gateway, with result description on return if provided.
4. **User cancel / error URL** — hit error/fail return URLs; check `returnKind` and gateway fields.

Repeat on **Production** Application ID only when moving live, with live test cards per bank rules.

## Relation to other exports

If a partner shares a **WAMI-style** JSON array (`paymentId`, `transactionIndex`, etc.), this app’s **`[iveri-cert]`** lines are the **merchant-side** counterpart: same session can be matched by `registrationRef` (TNF registration trace) and timestamp. Field names differ by gateway; use `registrationRef` + `createdAt` to correlate with internal reports.
