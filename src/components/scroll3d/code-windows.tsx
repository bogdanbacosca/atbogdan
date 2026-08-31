import { motion, useTransform, type MotionValue } from "motion/react";
import { Check, GitBranch } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function WindowShell({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-bg-elevated/95 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.9),inset_0_1px_0_color-mix(in_oklab,white_8%,transparent)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-bg px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="size-2.5 rounded-full bg-blush/70" />
        <span className="size-2.5 rounded-full bg-cream/30" />
        <span className="ml-2 truncate font-mono text-xs tracking-wide text-muted">{title}</span>
      </div>
      <div className={cn("px-4 py-4 font-mono text-xs leading-[1.9] sm:text-[13px]", bodyClassName)}>{children}</div>
    </div>
  );
}

/** Scroll-revealed line: fades + rises in as a chapter's progress passes its window. */
function RevealLine({
  sp,
  from,
  to,
  children,
  className,
}: {
  sp: MotionValue<number>;
  from: number;
  to: number;
  children: ReactNode;
  className?: string;
}) {
  const opacity = useTransform(sp, [from, to], [0, 1]);
  const y = useTransform(sp, [from, to], [8, 0]);
  return (
    <motion.div className={cn("will-change-transform", className)} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 1 — Terminal window                                             */
/* ------------------------------------------------------------------ */

export function TerminalWindow({ sp }: { sp: MotionValue<number> }) {
  return (
    <div className="float-slow w-[min(92vw,440px)] opacity-80 md:opacity-100">
      <WindowShell title="bash — atelier@bogdan">
        <RevealLine sp={sp} from={0.026} to={0.045}>
          <span className="text-primary">$</span> <span className="text-cream/90">whoami</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.042} to={0.058} className="text-muted">
          bogdan · web designer && front-end developer
        </RevealLine>
        <RevealLine sp={sp} from={0.056} to={0.072}>
          <span className="text-primary">$</span> <span className="text-cream/90">pwd</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.07} to={0.086} className="text-muted">
          ~/atelier/site-uri-web
        </RevealLine>
        <RevealLine sp={sp} from={0.084} to={0.104}>
          <span className="text-primary">$</span> <span className="text-cream/90">npm create site</span>{" "}
          <span className="text-blush">"--craft&nbsp;custom"</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.105} to={0.125} className="text-muted">
          ✔ template „responsive & fast" applied
        </RevealLine>
        <RevealLine sp={sp} from={0.124} to={0.146}>
          <span className="text-primary">$</span> <span className="text-cream/90">npm run dev</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.148} to={0.172} className="text-muted">
          VITE ready in 241 ms — Local: http://localhost:5173/
        </RevealLine>
        <RevealLine sp={sp} from={0.172} to={0.196} className="text-muted">
          ➜ portofoliu live · seo on · mobil-first
          <span className="terminal-cursor" aria-hidden="true" />
        </RevealLine>
      </WindowShell>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 3 — Code editor (services.ts)                                   */
/* ------------------------------------------------------------------ */

type Token = { text: string; className: string };

const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:const|let|var|new|function|return|async|await|true|false|null|for|map)\b)|(\b\d+(?:\.\d+)?\b)|([{}()[\],;:.])/g;

const MAPPING = [
  "comment",
  "string",
  "keyword",
  "number",
  "punct",
] as const;

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: line.slice(last, index), className: "text-muted/70" });
    const group = MAPPING[match.slice(1).findIndex(Boolean)];
    const className =
      group === "comment"
        ? "text-blush/60 italic"
        : group === "string"
          ? "text-blush"
          : group === "keyword"
            ? "text-primary"
            : group === "number"
              ? "text-cream"
              : "text-muted/50";
    tokens.push({ text: match[0], className });
    last = index + match[0].length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last), className: "text-muted/70" });
  return tokens;
}

function CodeLine({ line }: { line: string }) {
  return (
    <div className="min-h-[1.9em] break-words">
      {tokenize(line).map((token, i) => (
        <span key={i} className={cn(token.className)}>
          {token.text}
        </span>
      ))}
    </div>
  );
}

export function EditorWindow({ sp }: { sp: MotionValue<number> }) {
  return (
    <div className="float-slow w-[min(94vw,540px)]">
      <WindowShell
        title="services.ts — atelier/site-uri-web"
        bodyClassName="px-4 py-3.5 md:px-5 md:py-4"
      >
        <RevealLine sp={sp} from={0.475} to={0.5}>
          <CodeLine line={"// pachet 01 · creare site-uri web"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.495} to={0.515} className="pl-4">
          <CodeLine line={"const site = await build({"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.512} to={0.532} className="pl-8">
          <CodeLine line={'design: "modern & mobil-first",'} />
        </RevealLine>
        <RevealLine sp={sp} from={0.528} to={0.548} className="pl-8">
          <CodeLine line={"responsive: true, seo: true, vibe: \"memorabil\","} />
        </RevealLine>
        <RevealLine sp={sp} from={0.545} to={0.562} className="pl-4">
          <CodeLine line={"});"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.562} to={0.578}>
          <CodeLine line={"// pachet 02 · programare & elemente custom"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.578} to={0.594} className="pl-4">
          <CodeLine line={"const features = [\"booking\", \"shop\", \"forms\"]"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.594} to={0.61} className="pl-8">
          <CodeLine line={'.map((f) => addon(f, { clean: true, test: true }));'} />
        </RevealLine>
        <RevealLine sp={sp} from={0.61} to={0.628}>
          <CodeLine line={"// pachet 03 · design grafic"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.628} to={0.646} className="pl-4">
          <CodeLine line={"const brand = identity({ colors: [\"primary\", \"cream\"] });"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.646} to={0.668} className="pl-4">
          <CodeLine line={"brand.ship(pack: logo + vizuale + social);"} />
        </RevealLine>
        <RevealLine sp={sp} from={0.668} to={0.692} className="pt-1 text-muted">
          ✔ TypeScript — 0 errors · ready to ship
        </RevealLine>
      </WindowShell>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 4 — Git log window                                              */
/* ------------------------------------------------------------------ */

export function GitWindow({ sp }: { sp: MotionValue<number> }) {
  const commits = [
    { from: 0.692, to: 0.708, dot: "bg-primary", hash: "9f3ab2a", feat: "feat: site cristinahorga.ro", year: "2025", cls: "text-cream/95" },
    { from: 0.708, to: 0.724, dot: "bg-blush/80", hash: "1c8e7d0", feat: "feat: blog vacantesmart.eu", year: "2025", cls: "text-cream/80" },
    { from: 0.724, to: 0.74, dot: "bg-cream/60", hash: "b2a5f19", feat: "fix: reparatiimasinispalat.eu", year: "2025", cls: "text-cream/70" },
  ];
  return (
    <div className="float-slow w-[min(92vw,460px)]">
      <WindowShell title="git log --graph --oneline" bodyClassName="py-3.5">
        <div className="relative">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
          {commits.map((c) => (
            <RevealLine key={c.hash} sp={sp} from={c.from} to={c.to} className="relative pl-6">
              <span className={cn("absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full", c.dot)} />
              <span className={cn("font-mono", c.cls)}>
                <span className="text-primary">{c.hash}</span> {c.feat}
                <span className="ml-2 text-xs text-muted">[{c.year}]</span>
              </span>
            </RevealLine>
          ))}
          <RevealLine sp={sp} from={0.74} to={0.756} className="relative pl-6">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full bg-primary blur-[1px]"
            />
            <span className="text-muted">HEAD → main · working tree curat</span>
          </RevealLine>
          <RevealLine sp={sp} from={0.756} to={0.776} className="relative pl-6 pt-1">
            <span className="inline-flex items-center gap-2 text-muted">
              <GitBranch className="size-3.5 text-primary" /> 3 commit-uri · 3 proiecte · 3 lansări
            </span>
          </RevealLine>
        </div>
      </WindowShell>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 5 — Launch seal (not another terminal)                          */
/* ------------------------------------------------------------------ */

const LAUNCH_R = 96;
const LAUNCH_TICKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export function DeployWindow({ sp }: { sp: MotionValue<number> }) {
  const progress = useTransform(sp, [0.88, 0.965], [0, 1]);
  const stampScale = useTransform(sp, [0.925, 0.952, 0.97], [0.6, 1.14, 1]);
  const stampOp = useTransform(sp, [0.925, 0.948], [0, 1]);
  // The stamp lands slightly askew and settles — like ink meeting paper.
  const stampRot = useTransform(sp, [0.925, 0.945, 0.97], [-9, 3.5, -1]);
  const glowOp = useTransform(sp, [0.88, 0.97], [0.16, 0.5]);
  const ringRot = useTransform(sp, [0.84, 1], [-14, 16]);
  /* Radar pings rippling out as the seal is struck. */
  const ping1Scale = useTransform(sp, [0.925, 0.955, 0.99], [0.55, 1.45, 1.9]);
  const ping1Op = useTransform(sp, [0.925, 0.945, 0.99], [0, 0.55, 0]);
  const ping2Scale = useTransform(sp, [0.932, 0.962, 0.99], [0.55, 1.3, 1.62]);
  const ping2Op = useTransform(sp, [0.932, 0.962, 0.99], [0, 0.4, 0]);

  return (
    <div className="float-slow relative aspect-square w-[min(78vw,340px)]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-8%] rounded-full bg-primary blur-3xl"
        style={{ opacity: glowOp }}
      />

      {/* Deployment ping — two rippling rings when the LIVE stamp lands. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-primary/70"
        style={{ scale: ping1Scale, opacity: ping1Op }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-blush/60"
        style={{ scale: ping2Scale, opacity: ping2Op }}
      />

      <motion.div aria-hidden="true" className="absolute inset-[-18%]" style={{ rotate: ringRot }}>
        <svg viewBox="0 0 220 220" className="size-full">
          {LAUNCH_TICKS.map((deg) => (
            <line
              key={deg}
              x1="110"
              y1="7"
              x2="110"
              y2={deg % 90 === 0 ? 18 : 13}
              stroke="currentColor"
              strokeWidth={deg % 90 === 0 ? 1.7 : 1}
              transform={`rotate(${deg} 110 110)`}
              className={deg % 90 === 0 ? "text-primary/85" : "text-cream/30"}
            />
          ))}
          <circle
            cx="110"
            cy="110"
            r="104"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            className="text-cream/20"
          />
          <motion.circle
            cx="110"
            cy="110"
            r={LAUNCH_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            className="text-primary"
            style={{ pathLength: progress }}
          />
        </svg>
        <div className="orbit-spin pointer-events-none absolute inset-0">
          <svg viewBox="0 0 220 220" className="size-full">
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeDasharray="2.5 9"
              className="text-cream/40"
            />
          </svg>
        </div>
      </motion.div>

      <div className="relative flex size-full flex-col items-center justify-center rounded-full border border-cream/15 bg-bg-elevated shadow-[inset_0_1px_0_color-mix(in_oklab,white_10%,transparent),0_28px_70px_-24px_rgba(0,0,0,0.88)]">
        <RevealLine
          sp={sp}
          from={0.88}
          to={0.9}
          className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase"
        >
          deploy.sh
        </RevealLine>

        <motion.div
          className="relative mt-5 mb-3 flex size-[5.5rem] items-center justify-center rounded-full bg-primary will-change-transform"
          style={{ scale: stampScale, opacity: stampOp, rotate: stampRot }}
        >
          <span aria-hidden="true" className="absolute inset-1.5 rounded-full border border-cream/50" />
          <span aria-hidden="true" className="absolute inset-3 rounded-full border border-cream/20" />
          <span className="font-display text-xl tracking-[0.22em] text-cream">LIVE</span>
        </motion.div>

        <RevealLine sp={sp} from={0.94} to={0.958} className="font-display text-lg text-cream">
          site-ul tău
        </RevealLine>
        <RevealLine
          sp={sp}
          from={0.95}
          to={0.968}
          className="mt-1 font-mono text-[11px] tracking-[0.16em] text-muted uppercase"
        >
          live · gata de lansare
        </RevealLine>
        <RevealLine
          sp={sp}
          from={0.955}
          to={0.972}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 font-mono text-[10px] tracking-wide text-muted"
        >
          <span
            aria-hidden="true"
            className="flex size-3.5 items-center justify-center rounded-full bg-primary"
          >
            <Check className="size-2.5 text-cream" />
          </span>
          site-ul-tau.ro
        </RevealLine>
      </div>
    </div>
  );
}
