import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
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
      <h3 className="font-display text-2xl text-cream">
        <AnimatedWords text={contactCopy.send} stagger={0.05} />
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FadeUp className="space-y-2" delay={0.1}>
          <Label htmlFor="name">Nume complet</Label>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-primary">{form.formState.errors.name.message}</p>
          ) : null}
        </FadeUp>
        <FadeUp className="space-y-2" delay={0.16}>
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
        </FadeUp>
      </div>
      <FadeUp className="space-y-2" delay={0.22}>
        <Label htmlFor="subject">Subiect</Label>
        <Input id="subject" {...form.register("subject")} />
        {form.formState.errors.subject ? (
          <p className="text-sm text-primary">{form.formState.errors.subject.message}</p>
        ) : null}
      </FadeUp>
      <FadeUp className="space-y-2" delay={0.28}>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea id="message" rows={6} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-sm text-primary">{form.formState.errors.message.message}</p>
        ) : null}
      </FadeUp>
      <FadeUp delay={0.34} className="w-full md:w-fit">
        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? "Se trimite…" : contactCopy.submit}
        </Button>
      </FadeUp>
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