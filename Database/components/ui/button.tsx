import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-champagne text-navy-950 hover:bg-[#e6cd88]",
        variant === "secondary" && "border border-white/[0.15] bg-white/[0.08] text-white hover:bg-white/[0.12]",
        variant === "ghost" && "text-slate-200 hover:bg-white/[0.08]",
        variant === "danger" && "bg-red-500/15 text-red-100 hover:bg-red-500/25",
        className
      )}
      {...props}
    />
  );
}
