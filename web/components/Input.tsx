import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-xl border border-fex-border bg-fex-bg px-4 py-2.5 text-sm text-fex-text outline-none transition placeholder:text-fex-muted focus:border-fex-accent focus:ring-1 focus:ring-fex-accent"
      {...props}
    />
  );
}
