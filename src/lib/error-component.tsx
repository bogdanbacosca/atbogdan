import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

/**
 * The router hands us whatever was thrown, typed as `unknown` (since
 * @tanstack/react-router 1.170). Normalize it so the real message stays
 * visible — a thrown Error, a thrown string, or nothing at all.
 */
function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-primary" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-lg font-semibold">A apărut o eroare</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {errorMessage(error) || "A apărut o eroare neașteptată. Reîncarcă pagina."}
      </p>
    </main>
  );
}
