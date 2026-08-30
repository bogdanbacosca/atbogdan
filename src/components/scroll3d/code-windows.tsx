import { motion, useTransform, type MotionValue } from "motion/react";
import { BadgeCheck, GitBranch, Rocket } from "lucide-react";
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
          <span className="text-blush">&quot;--craft&nbsp;custom&quot;</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.105} to={0.125} className="text-muted">
          ✔ template „responsive &amp; fast&quot; applied
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
/* Ch. 2 — 3D tech-card carousel                                       */
/* ------------------------------------------------------------------ */

const STACK = [
  { label: "HTML5", tint: "text-primary" },
  { label: "CSS3", tint: "text-blush" },
  { label: "JS", tint: "text-cream" },
  { label: "React", tint: "text-primary" },
  { label: "Tailwind", tint: "text-blush" },
  { label: "Git", tint: "text-cream" },
  { label: "SEO", tint: "text-primary" },
  { label: "Meta", tint: "text-blush" },
] as const;

function StackCard({
  label,
  tint,
  index,
  total,
}: {
  label: string;
  tint: string;
  index: number;
  total: number;
}) {
  const angle = (index / total) * 360;
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border border-border-strong bg-bg-elevated/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_color-mix(in_oklab,white_8%,transparent)] will-change-transform md:h-24 md:w-24"
      style={{
        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--ring-r))`,
      }}
    >
      <span className={cn("font-display text-lg leading-none md:text-xl", tint)}>{label}</span>
      <span className="text-[10px] tracking-[0.14em] text-muted uppercase">tile</span>
    </div>
  );
}

export function StackRing({ sp }: { sp: MotionValue<number> }) {
  const spin = useTransform(sp, [0.215, 0.445], [60, -160]);
  const certOpacity = useTransform(sp, [0.24, 0.3, 0.4, 0.47], [0, 1, 1, 0]);
  const certY = useTransform(sp, [0.24, 0.47], [26, -34]);
  return (
    <div className="relative">
      <motion.div
        className="stack-ring absolute top-1/2 left-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          rotateX: -14,
          rotateY: spin,
        }}
        aria-hidden="true"
      >
        {STACK.map((item, i) => (
          <StackCard key={item.label} label={item.label} tint={item.tint} index={i} total={STACK.length} />
        ))}
      </motion.div>

      <motion.div
        className="absolute left-[calc(50%_+_30px)] top-[calc(50%_+_120px)] md:left-[calc(50%_+_150px)] md:top-[calc(50%_-_60px)]"
        style={{ opacity: certOpacity, y: certY }}
      >
        <div className="float-slower flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated/95 px-4 py-2 font-mono text-xs text-cream shadow-[0_18px_44px_-18px_rgba(0,0,0,0.85)]">
          <BadgeCheck className="size-4 text-primary" />
          Meta Front-End Professional
        </div>
      </motion.div>
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
    { from: 0.715, to: 0.735, dot: "bg-primary", hash: "9f3ab2a", feat: "feat: site cristinahorga.ro", year: "2025", cls: "text-cream/95" },
    { from: 0.735, to: 0.755, dot: "bg-blush/80", hash: "1c8e7d0", feat: "feat: blog vacantesmart.eu", year: "2025", cls: "text-cream/80" },
    { from: 0.755, to: 0.775, dot: "bg-cream/60", hash: "b2a5f19", feat: "fix: reparatiimasinispalat.eu", year: "2025", cls: "text-cream/70" },
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
          <RevealLine sp={sp} from={0.775} to={0.795} className="relative pl-6">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full bg-primary blur-[1px]"
            />
            <span className="text-muted">HEAD → main · working tree curat</span>
          </RevealLine>
          <RevealLine sp={sp} from={0.795} to={0.82} className="relative pl-6 pt-1">
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
/* Ch. 5 — Deploy window                                               */
/* ------------------------------------------------------------------ */

export function DeployWindow({ sp }: { sp: MotionValue<number> }) {
  return (
    <div className="float-slow w-[min(92vw,440px)]">
      <WindowShell title="deploy.sh — atelier">
        <RevealLine sp={sp} from={0.895} to={0.912}>
          <span className="text-primary">$</span> <span className="text-cream/90">npm run build</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.912} to={0.93} className="text-muted">
          ✔ build reușit · 312 kB (gzip) · vite 8
        </RevealLine>
        <RevealLine sp={sp} from={0.93} to={0.948}>
          <span className="text-primary">$</span> <span className="text-cream/90">npm run deploy -- --prod</span>
        </RevealLine>
        <RevealLine sp={sp} from={0.948} to={0.968} className="text-muted">
          ✔ deployment finalizat
        </RevealLine>
        <RevealLine sp={sp} from={0.968} to={0.988}>
          <span className="inline-flex items-center gap-2 pt-1 text-blush">
            <Rocket className="size-4 text-primary" />
            site-ul tău, live. → contactează-mă
          </span>
        </RevealLine>
      </WindowShell>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Distant deco windows (always on, far behind for depth)              */
/* ------------------------------------------------------------------ */

function GhostWindow({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden rounded-lg border border-border/50 bg-bg-elevated/45 shadow-[0_30px_70px_-32px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border/40 bg-bg/70 px-3 py-1.5">
        <span className="size-1.5 rounded-full bg-primary/60" />
        <span className="size-1.5 rounded-full bg-blush/40" />
        <span className="ml-1 font-mono text-[10px] tracking-wide text-muted/70">{title}</span>
      </div>
      <div className="px-3 py-2 font-mono text-[10px] leading-[1.8] text-muted/40">{children}</div>
    </div>
  );
}

export function GhostWindows() {
  return (
    <>
      <div className="absolute left-[12%] top-[30%] w-52 -rotate-6">
        <GhostWindow title="styles.css">
          <p>:root &#123; accent: crimson &#125;</p>
        </GhostWindow>
      </div>
      <div className="absolute right-[10%] top-[26%] w-48 rotate-3">
        <GhostWindow title="package.json">
          <p>&quot;motion&quot;: &quot;^13&quot;</p>
        </GhostWindow>
      </div>
    </>
  );
}