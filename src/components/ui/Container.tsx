import { cn } from "@/lib/utils";

const sizes = {
  narrow: "max-w-narrow",
  wide: "max-w-wide",
};

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof sizes;
};

export function Container({
  size = "wide",
  className,
  ...props
}: ContainerProps) {
  return (
    <div {...props} className={cn("mx-auto px-6", sizes[size], className)} />
  );
}
