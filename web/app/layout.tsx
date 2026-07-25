import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fex",
  description: "Invite-only programming assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

