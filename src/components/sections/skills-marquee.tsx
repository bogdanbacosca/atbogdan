import { skills } from "@/lib/site";

export function SkillsMarquee() {
  const loop = [...skills, ...skills];
  return (
    <div className="overflow-hidden border-y border-border bg-bg-elevated py-4">
      <div className="marquee-track gap-8 px-4">
        {loop.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="flex items-center gap-8 font-display text-xl text-cream/80 md:text-2xl"
          >
            {skill}
            <span className="size-1.5 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
}
