"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react";
import { UserRole } from "@/types/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "./LanguageContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (response.ok) {
          const json = await response.json();
          setUser(json.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#282828] bg-[#121212]/95 px-6 backdrop-blur">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-full bg-[#1ed760] flex items-center justify-center font-black text-black text-xs transition-transform group-hover:scale-105">
            CS
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1ed760] transition-colors">
            CoSpace
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/spaces"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/spaces" ? "text-white font-bold" : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            {t("nav.spaces")}
          </Link>

          {user && (
            <Link
              href="/dashboard/reservas"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard") ? "text-white font-bold" : "text-[#b3b3b3] hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t("nav.reservations")}</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin/espacios"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/admin") ? "text-[#1ed760] font-bold" : "text-[#b3b3b3] hover:text-[#1ed760]"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{t("nav.admin")}</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Selector de Idioma */}
        <LanguageSwitcher />

        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-[#7c7c7c] uppercase">{user.role}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#282828] flex items-center justify-center text-[#b3b3b3] border border-[#383838]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full p-2 text-[#b3b3b3] hover:bg-[#1f1f1f] hover:text-[#f3727f] transition-colors"
                  title={t("nav.logout")}
                  aria-label={t("nav.logout")}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};
