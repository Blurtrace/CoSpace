import type { Metadata } from "next";
import { LanguageProvider } from "@/components/shared/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { AuthProvider } from "@/components/shared/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoSpace — Coworking Spaces",
  description: "Plataforma de reservas de espacios de coworking.",
  icons: {
    icon: "/gemini-svg.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-[#222222] antialiased selection:bg-[#ff385c]/15 selection:text-[#ff385c]">
        <LanguageProvider>
          <AuthProvider>
            {children}
            <LanguageSwitcher />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
