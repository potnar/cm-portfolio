import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors cursor-pointer";

const variants = {
  primary: "bg-foreground text-background hover:bg-foreground-hover",
  secondary: "bg-surface border border-border hover:bg-surface-strong",
  accent: "bg-accent text-background transition hover:brightness-110",
  gradient:
    "bg-gradient-to-r from-primary-strong to-secondary-deep font-black shadow-lg shadow-secondary-strong/20 transition-transform hover:scale-105",
};

const sizes = {
  md: "px-6 py-3",
  lg: "px-8 py-4",
  xl: "px-10 py-5 text-lg",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} & (
  | ({ href: string } & Omit<React.ComponentProps<"a">, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ComponentProps<"button">, "className">)
);

export function Button({
  variant = "primary",
  size = "lg",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href === undefined) {
    return <button type="button" {...props} className={classes} />;
  }

  const { href, ...rest } = props;

  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...rest} className={classes} />;
  }

  const external = href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return <a href={href} {...external} {...rest} className={classes} />;
}
