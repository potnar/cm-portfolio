import { cn } from "@/lib/utils";

const variants = {
  surface: "bg-surface border border-border",
  subtle: "bg-surface border border-border-subtle",
  solid: "bg-surface-solid border border-border",
  accent:
    "bg-gradient-to-br from-accent/10 to-transparent border border-accent/20",
};

const sizes = {
  sm: "p-6 rounded-xl",
  md: "p-8 rounded-2xl",
  lg: "p-8 rounded-3xl",
  xl: "p-12 rounded-3xl",
};

type CardProps = React.ComponentProps<"div"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  interactive?: boolean;
};

export function Card({
  variant = "surface",
  size = "md",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        variants[variant],
        sizes[size],
        interactive &&
          "group transition-all hover:border-border-strong hover:bg-surface-hover",
        className,
      )}
    />
  );
}
