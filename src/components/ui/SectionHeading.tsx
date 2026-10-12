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
        <p className={cn("text-eyebrow uppercase mb-4", tones[tone])}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-heading-xl">{title}</h2>
    </div>
  );
}
