import { cn } from "@/lib/utils";

const variants = {
  brand: "bg-gradient-to-br from-primary-strong/20 to-secondary-strong/20",
  accent: "bg-accent/20 text-accent",
};

const sizes = {
  md: "w-12 h-12 [&>svg]:w-6 [&>svg]:h-6",
  lg: "w-16 h-16 [&>svg]:w-8 [&>svg]:h-8",
};

type IconBadgeProps = React.ComponentProps<"div"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function IconBadge({
  variant = "brand",
  size = "md",
  className,
  ...props
}: IconBadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl",
        variants[variant],
        sizes[size],
        className,
      )}
    />
  );
}
