import { cn } from "@/lib/utils";

const variants = {
  label:
    "px-2 py-1 rounded-sm border border-border-subtle text-label uppercase text-subtle",
  pill: "px-3 py-1 rounded-full border border-border text-xs font-bold text-muted",
};

type TagProps = React.ComponentProps<"span"> & {
  variant?: keyof typeof variants;
};

export function Tag({ variant = "label", className, ...props }: TagProps) {
  return (
    <span
      {...props}
      className={cn("bg-surface", variants[variant], className)}
    />
  );
}
