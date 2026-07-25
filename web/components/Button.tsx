import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl bg-fex-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-fex-accentHover disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
