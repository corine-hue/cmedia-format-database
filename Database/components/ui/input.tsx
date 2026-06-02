import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-white/[0.12] bg-white/[0.07] px-3 text-sm text-white outline-none ring-champagne/[0.50] placeholder:text-slate-500 focus:ring-2",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-md border border-white/[0.12] bg-white/[0.07] px-3 py-3 text-sm leading-6 text-white outline-none ring-champagne/[0.50] placeholder:text-slate-500 focus:ring-2",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-white/[0.12] bg-white/[0.07] px-3 text-sm text-white outline-none ring-champagne/[0.50] focus:ring-2",
        props.className
      )}
    />
  );
}
