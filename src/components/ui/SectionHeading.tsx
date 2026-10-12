import { cn } from "@/lib/utils";

const tones = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  tone?: keyof typeof tones;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  tone = "primary",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-bold uppercase tracking-widest mb-4",
            tones[tone],
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-black tracking-tight">
        {title}
      </h2>
    </div>
  );
}
