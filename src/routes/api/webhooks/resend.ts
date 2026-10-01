import { createFileRoute } from "@tanstack/react-router";
import { Resend, type WebhookEventPayload } from "resend";

/**
 * Resend webhook endpoint — receives delivery events for atbogdan.ro.
 *
 * Registered URL: https://atbogdan.ro/api/webhooks/resend
 *
 * Resend signs every delivery with Svix headers (`svix-id`, `svix-timestamp`,
 * `svix-signature`). We verify that signature against RESEND_WEBHOOK_SECRET
 * before trusting the payload, log the event, and answer 2xx so Resend stops
 * retrying. No database — this endpoint only acknowledges and records events.
 *
 * Environment variables:
 *  - RESEND_WEBHOOK_SECRET (required) the "whsec_…" signing secret shown when
 *    the webhook is created in Resend → Webhooks. Without it the endpoint
 *    refuses every request (500) rather than accept unverified payloads.
 *  - RESEND_API_KEY (optional here) only used to construct the SDK client —
 *    signature verification itself does not need it.
 */

/**
 * Log a verified event in a compact, greppable form. The `type` field is a
 * discriminant, so each branch sees exactly the payload shape it expects.
 */
function logEvent(event: WebhookEventPayload): void {
  switch (event.type) {
    case "email.received":
      console.log(
        `[resend-webhook] email.received from=${event.data.from} ` +
          `to=${event.data.to.join(", ")} subject="${event.data.subject}" ` +
          `id=${event.data.email_id}`,
      );
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
        if (!webhookSecret) {
          console.error("[resend-webhook] RESEND_WEBHOOK_SECRET is not set — rejecting delivery");
          return new Response("Webhook not configured", { status: 500 });
        }

        // Signature verification hashes the exact bytes Resend sent, so read the
        // raw body — never request.json(), which would re-serialize and break it.
        const payload = await request.text();

        // The SDK constructor requires a key, but verify() only reads the secret.
        const resend = new Resend(process.env.RESEND_API_KEY?.trim() || "re_webhook_verifier");

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
          logEvent(event);
        } catch (error) {
          console.error("[resend-webhook] handler error:", error);
          return new Response("Handler error", { status: 500 });
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});
