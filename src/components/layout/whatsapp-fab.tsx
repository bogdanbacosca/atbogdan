import { site } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.96] md:right-6 md:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 17.7L1 23l5.4-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5ZM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9 9 0 1 1 12 21Zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}
