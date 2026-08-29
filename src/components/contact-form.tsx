import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactCopy, site } from "@/lib/site";

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

  const onSubmit = (values: Values) => {
    const body = [
      values.message,
      "",
      `— ${values.name}`,
      values.email,
    ].join("\n");
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.success("Se deschide clientul de email. Mulțumesc!");
    form.reset();
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
      <Button type="submit" size="lg" className="w-full md:w-auto">
        {contactCopy.submit}
      </Button>
    </form>
  );
}
