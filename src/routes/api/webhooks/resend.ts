import { createFileRoute } from "@tanstack/react-router";
import { Resend, type WebhookEventPayload } from "resend";

/**
 * Resend webhook endpoint — https://atbogdan.ro/api/webhooks/resend
 *
 * Resend signs every delivery with Svix headers (`svix-id`, `svix-timestamp`,
 * `svix-signature`). We verify that signature against RESEND_WEBHOOK_SECRET
 * before trusting the payload, then:
 *   - `email.received`  → fetch the full message and forward it to
 *     CONTACT_TO_EMAIL with Reply-To set to the original sender;
 *   - every other event → log only.
 * We answer 2xx on success so Resend stops retrying; 5xx on failure so it
 * retries (a forward retry is de-duplicated by the Svix id).
 *
 * NOTE on From vs Reply-To: Resend only lets you send From an address on a
 * domain verified in Resend (atbogdan.ro), so the forwarded mail can never
 * literally be From: bogdanbacosca@proton.me (that would be spoofing and
 * would fail SPF/DKIM/DMARC). Instead we keep From on contact@atbogdan.ro,
 * put the sender in the From display name AND in Reply-To — so in Gmail you
 * see who wrote, and hitting Reply answers them, not contact@.
 *
 * Environment variables:
 *  - RESEND_WEBHOOK_SECRET (required) the "whsec_…" signing secret shown when
 *    the webhook is created in Resend → Webhooks.
 *  - RESEND_API_KEY (required) the "re_…" key — forwarding sends mail, so this
 *    endpoint does real API work (unlike a verify-only handler).
 *  - CONTACT_FROM_EMAIL (optional) forwarder/"From" address, default
 *    "contact@atbogdan.ro". Must be on a domain verified in Resend.
 *  - CONTACT_TO_EMAIL (optional) comma-separated forward destinations, default
 *    "bogdanbacosca@gmail.com".
 */

/** Parse a comma-separated address list, falling back when unset/empty. */
function addresses(value: string | undefined, fallback: string): string[] {
  return (value?.trim() || fallback)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

/** Extract a bare email address from a From/Reply-To header value. */
function extractEmail(value: string | null | undefined): string | null {
  if (!value) return null;
  const angled = value.match(/<([^<>]+)>/);
  const candidate = (angled ? angled[1] : value).trim().replace(/^["']+|["']+$/g, "");
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

/** Escape user-supplied text before embedding it in the HTML banner. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Forward a received inbound email (body, headers and attachments intact) to
 * the configured destinations, with Reply-To pointing at the original sender
 * so replies go to them. `idempotencyKey` (the Svix id) makes a webhook
 * retry a no-op instead of a duplicate forward.
 *
 * The webhook payload carries metadata only, so the full message is fetched
 * first via the Receiving API. The SDK's forward() helper can't set Reply-To,
 * hence this manual fetch → send.
 */
async function forwardReceivedEmail(
  resend: Resend,
  data: { email_id: string },
  idempotencyKey: string | undefined,
): Promise<void> {
  const forwarder = process.env.CONTACT_FROM_EMAIL?.trim() || "contact@atbogdan.ro";
  const forwarderBare = extractEmail(forwarder) ?? forwarder;
  const to = addresses(process.env.CONTACT_TO_EMAIL, "bogdanbacosca@gmail.com");

  const { data: email, error: fetchError } = await resend.emails.receiving.get(data.email_id);
  if (fetchError || !email) {
    throw new Error(
      `Resend fetch error: ${fetchError?.message || fetchError?.name || "Unknown error"}`,
    );
  }

  const senderEmail = extractEmail(email.from);
  const replyTo = [
    ...new Set(
      [...(email.reply_to ?? []), email.from]
        .map((candidate) => extractEmail(candidate))
        .filter((candidate): candidate is string => candidate !== null),
    ),
  ];

  const fromHeader =
    senderEmail && !forwarder.includes("<")
      ? `"${senderEmail} via ${forwarderBare}" <${forwarderBare}>`
      : forwarder;

  const subject = email.subject || "(no subject)";

  const bannerText =
    `--- Forwarded message (received at ${forwarderBare}) ---\n` +
    `From: ${email.from}\n` +
    `To: ${(email.to ?? []).join(", ")}\n` +
    `Subject: ${subject}\n` +
    (replyTo.length > 0 ? `Reply-To: ${replyTo.join(", ")} (Reply goes to the sender)\n` : "") +
    `---\n\n`;
  const bannerHtml =
    `<div style="border:1px solid #ddd;background:#f9f9f9;padding:12px 16px;margin-bottom:16px;` +
    `font-family:sans-serif;font-size:13px;color:#333;">` +
    `<strong>Forwarded message</strong> (received at ${escapeHtml(forwarderBare)})<br />` +
    `<strong>From:</strong> ${escapeHtml(email.from)}<br />` +
    `<strong>To:</strong> ${escapeHtml((email.to ?? []).join(", "))}<br />` +
    `<strong>Subject:</strong> ${escapeHtml(subject)}<br />` +
    (replyTo.length > 0
      ? `<em>Hit Reply to respond directly to ${escapeHtml(replyTo[0])}.</em>`
      : "") +
    `</div>`;

  // Re-attach inbound files (Resend caps a send at 40 MB — stay under ~35 MB).
  const sendAttachments: {
    content: string;
    filename?: string;
    contentType?: string;
    contentId?: string;
  }[] = [];
  let bytesTotal = 0;
  const BUDGET = 35 * 1024 * 1024;
  for (const attachment of email.attachments ?? []) {
    if (bytesTotal + attachment.size > BUDGET) {
      console.warn(`[resend-webhook] skipping attachment ${attachment.id} (over size budget)`);
      continue;
    }
    try {
      const { data: file, error: fileError } = await resend.emails.receiving.attachments.get({
        emailId: data.email_id,
        id: attachment.id,
      });
      if (fileError || !file?.download_url) {
        throw new Error(fileError?.message ?? "no download_url");
      }
      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error(`download HTTP ${response.status}`);
      }
      const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
      sendAttachments.push({
        content: base64,
        filename: attachment.filename ?? "attachment",
        ...(attachment.content_type ? { contentType: attachment.content_type } : {}),
        ...(attachment.content_id
          ? { contentId: attachment.content_id.replace(/^<|>$/g, "") }
          : {}),
      });
      bytesTotal += attachment.size;
    } catch (error) {
      console.warn(`[resend-webhook] skipping attachment ${attachment.id}:`, error);
    }
  }

  const { error } = await resend.emails.send(
    {
      from: fromHeader,
      to,
      ...(replyTo.length > 0 ? { replyTo } : {}),
      subject,
      text: bannerText + (email.text ?? ""),
      ...(email.html ? { html: bannerHtml + email.html } : {}),
      ...(sendAttachments.length > 0 ? { attachments: sendAttachments } : {}),
    },
    { idempotencyKey },
  );
  if (error) {
    throw new Error(`Resend forward error: ${error.message || error.name || "Unknown error"}`);
  }

  console.log(
    `[resend-webhook] forwarded inbound ${data.email_id} (from=${email.from} ` +
      `subject="${subject}" replyTo=${replyTo.join(", ") || "none"}) → ${to.join(", ")}`,
  );
}

/** Handle a verified event. Throwing makes the endpoint answer 500 (retry). */
async function handleEvent(
  event: WebhookEventPayload,
  resend: Resend,
  idempotencyKey: string | undefined,
): Promise<void> {
  switch (event.type) {
    case "email.received":
      await forwardReceivedEmail(resend, event.data, idempotencyKey);
      return;
    case "contact.created":
    case "contact.updated":
    case "contact.deleted":
    case "domain.created":
    case "domain.updated":
    case "domain.deleted":
    case "suppression.added":
    case "suppression.removed":
      console.log(`[resend-webhook] ${event.type} id=${event.data.id}`);
      return;
    default:
      // Everything left is an email lifecycle event (sent, delivered, bounced,
      // opened, clicked, failed, suppressed, …) sharing BaseEmailEventData.
      console.log(
        `[resend-webhook] ${event.type} to=${event.data.to.join(", ")} ` +
          `subject="${event.data.subject}" id=${event.data.email_id}`,
      );
  }
}

export const Route = createFileRoute("/api/webhooks/resend")({
  server: {
    handlers: {
      // A webhook delivery is always a POST; anything else is a mis-hit.
      GET: () => new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } }),

      POST: async ({ request }) => {
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
        const apiKey = process.env.RESEND_API_KEY?.trim();
        if (!webhookSecret || !apiKey) {
          const missing = [!webhookSecret && "RESEND_WEBHOOK_SECRET", !apiKey && "RESEND_API_KEY"]
            .filter(Boolean)
            .join(", ");
          console.error(`[resend-webhook] not configured — missing ${missing}`);
          return new Response("Webhook not configured", { status: 500 });
        }

        // Signature verification hashes the exact bytes Resend sent, so read the
        // raw body — never request.json(), which would re-serialize and break it.
        const payload = await request.text();
        const resend = new Resend(apiKey);

        let event: WebhookEventPayload;
        try {
          event = resend.webhooks.verify({
            payload,
            headers: {
              id: request.headers.get("svix-id") ?? "",
              timestamp: request.headers.get("svix-timestamp") ?? "",
              signature: request.headers.get("svix-signature") ?? "",
            },
            webhookSecret,
          });
        } catch (error) {
          console.error("[resend-webhook] signature verification failed:", error);
          return new Response("Invalid signature", { status: 400 });
        }

        try {
          await handleEvent(event, resend, request.headers.get("svix-id") ?? undefined);
        } catch (error) {
          console.error("[resend-webhook] handler error:", error);
          return new Response("Handler error", { status: 500 });
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});
