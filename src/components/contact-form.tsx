import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactCopy } from "@/lib/site";
import { submitContactForm } from "@/lib/contact";

const schema = z.object({
  name: z.string().min(2, "Acest câmp este obligatoriu."),
  email: z.string().email("Introdu o adresă de email validă."),
  subject: z.string().min(3, "Acest câmp este obligatoriu."),
  message: z.string().min(10, "Mesajul trebuie să aibă cel puțin 10 caractere."),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  /**
   * Handles the form submission through the TanStack Start server function,
   * which sends the notification email via Resend.
   */
  const onSubmit = async (values: Values) => {
    setIsLoading(true);
    setFormStatus("idle");

    try {
      await submitContactForm({ data: values });
      setFormStatus("success");
      form.reset();
      toast.success("Mesajul a fost trimis. Îți răspund în curând!");
    } catch (error) {
      setFormStatus("error");
      console.error("Contact form submission failed:", error);
      toast.error("Trimiterea a eșuat. Încearcă din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-border bg-surface p-5 md:p-7"
      noValidate
    >
      <h3 className="font-display text-2xl text-cream">{contactCopy.send}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nume complet</Label>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-primary">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Adresă de email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-primary">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subiect</Label>
        <Input id="subject" {...form.register("subject")} />
        {form.formState.errors.subject ? (
          <p className="text-sm text-primary">{form.formState.errors.subject.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mesaj</Label>
        <Textarea id="message" rows={6} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-sm text-primary">{form.formState.errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? "Se trimite…" : contactCopy.submit}
      </Button>
      {formStatus === "success" ? (
        <p role="status" data-testid="form-status" className="text-sm text-emerald-400">
          Mesajul a fost trimis. Îți mulțumesc! Îți răspund în cel mai scurt timp.
        </p>
      ) : null}
      {formStatus === "error" ? (
        <p role="alert" data-testid="form-status" className="text-sm text-primary">
          Trimiterea a eșuat. Te rugăm să încerci din nou sau să mă suni direct.
        </p>
      ) : null}
    </form>
  );
}
export default ContactForm;