import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fex - AI Assistant",
  description: "Tu asistente de IA para cualquier cosa"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
