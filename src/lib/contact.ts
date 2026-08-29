import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendContactEmail } from "@/lib/mailer";

const contactInput = z.object({
  name: z.string().min(2, "Acest câmp este obligatoriu."),
  email: z.string().email("Introdu o adresă de email validă."),
  subject: z.string().min(3, "Acest câmp este obligatoriu."),
  message: z.string().min(10, "Mesajul trebuie să aibă cel puțin 10 caractere."),
});

/**
 * Server function backing the contact form: validates the submission and
 * forwards it to the Resend-powered mailer. The handler runs only on the
 * server — the client bundle keeps just the generated RPC stub.
 */
export const submitContactForm = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactInput.parse(input))
  .handler(async ({ data }) => {
    const { id } = await sendContactEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      body: data.message,
    });
    return { ok: true as const, id };
  });