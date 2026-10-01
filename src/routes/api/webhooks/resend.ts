import { createFileRoute } from "@tanstack/react-router";
import { Resend, type WebhookEventPayload } from "resend";

/**
 * Resend webhook endpoint — https://atbogdan.ro/api/webhooks/resend
 *
 * Resend signs every delivery with Svix headers (`svix-id`, `svix-timestamp`,
 * `svix-signature`). We verify that signature against RESEND_WEBHOOK_SECRET
 * before trusting the payload, then:
 *   - `email.received`  → forward the message to CONTACT_TO_EMAIL;
 *   - every other event → log only.
 * We answer 2xx on success so Resend stops retrying; 5xx on failure so it
 * retries (a forward retry is de-duplicated by the Svix id).
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

/**
 * Forward a received inbound email (body, headers and attachments intact) to
 * the configured destinations. `idempotencyKey` (the Svix id) makes a webhook
 * retry a no-op instead of a duplicate forward.
 */
async function forwardReceivedEmail(
  resend: Resend,
  data: { email_id: string; from: string; subject: string },
  idempotencyKey: string | undefined,
): Promise<void> {
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "contact@atbogdan.ro";
  const to = addresses(process.env.CONTACT_TO_EMAIL, "bogdanbacosca@gmail.com");

  const { error } = await resend.emails.receiving.forward(
    { emailId: data.email_id, from, to, passthrough: true },
    { idempotencyKey },
  );
  if (error) {
    throw new Error(`Resend forward error: ${error.message || error.name || "Unknown error"}`);
  }

  console.log(
    `[resend-webhook] forwarded inbound ${data.email_id} (from=${data.from} ` +
      `subject="${data.subject}") → ${to.join(", ")}`,
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
