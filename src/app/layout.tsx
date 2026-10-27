import type { Metadata } from "next";
import { LanguageProvider } from "@/components/shared/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoSpace — Coworking Spaces",
  description: "Plataforma de reservas de espacios de coworking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#121212] text-white antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
