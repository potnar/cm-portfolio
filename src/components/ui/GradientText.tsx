import { cn } from "@/lib/utils";

export function GradientText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary-strong to-tertiary",
        className,
      )}
    />
  );
}
