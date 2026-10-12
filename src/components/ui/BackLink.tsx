import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackLinkProps = {
  href?: string;
  children?: React.ReactNode;
  className?: string;
};

export function BackLink({
  href = "/#projects",
  children = "Powrót do strony głównej",
  className,
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors",
        className,
      )}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {children}
    </Link>
  );
}
