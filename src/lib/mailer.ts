import { Resend } from "resend";

/**
 * Represents the structured data from the contact form.
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  body: string;
}

export interface SendContactEmailResult {
  /** Resend email id, when the API returned one. */
  id: string | null;
}

/**
 * Escape user-supplied text before it is embedded into the HTML email body,
 * so a visitor cannot inject arbitrary markup into the notification email.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderFieldRow(label: string, value: string, shaded: boolean): string {
  const background = shaded ? "background-color: #f4f4f4;" : "";
  return (
    `<tr>` +
    `<th style="${background} width: 150px; text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${label}</th>` +
    `<td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>` +
    `</tr>`
  );
}

/**
 * Sends a structured email notification of a contact form submission using Resend.
 *
 * Environment variables:
 *  - RESEND_API_KEY     (required) API key from https://resend.com/api-keys
 *  - CONTACT_FROM_EMAIL (optional) verified sender address, default "onboarding@resend.dev"
 *  - CONTACT_TO_EMAIL   (optional) comma-separated recipients, default "bogdanbacosca@gmail.com"
 *
 * @param data The validated contact form submission data.
 * @returns The Resend email id of the sent message.
 * @throws {Error} Throws when the API key is missing or Resend rejects the send.
 */
export async function sendContactEmail(data: ContactFormData): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env (local dev) or to the hosting provider's environment variables (production).",
    );
  }

  // "onboarding@resend.dev" is Resend's shared test sender: until a domain is
  // verified in Resend, it can only deliver to the address that owns the
  // Resend account. After verifying your domain, set CONTACT_FROM_EMAIL.
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "contact@atbogdan.ro";
  const to = (process.env.CONTACT_TO_EMAIL?.trim() || "bogdanbacosca@gmail.com")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const resend = new Resend(apiKey);

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const messageBody = escapeHtml(data.body).replace(/\n/g, "<br />");

  const { data: sent, error } = await resend.emails.send({
    from,
    to,
    // Replies go straight to the visitor's inbox.
    replyTo: data.email,
    subject: `New Website Contact Submission: ${data.subject}`,
    html: `
      <h1 style="font-size: 24px; color: #333;">New Contact Submission</h1>
      <p>A new message was received via the website contact form.</p>
      <table border="0" cellpadding="5" cellspacing="0" style="width: 100%; margin-top: 20px;">
        ${renderFieldRow("Name", name, true)}
        ${renderFieldRow("Email", email, false)}
        ${renderFieldRow("Subject", subject, true)}
        ${renderFieldRow("Message Body", messageBody, false)}
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated notification. Do not reply directly to this email.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend Email Error: ${error.message || error.name || "Unknown error"}`);
  }

  return { id: sent?.id ?? null };
}
