"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react";
import { useTranslation } from "./LanguageContext";
import { useAuth } from "./AuthContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-[#ebebeb] bg-white/95 px-6 md:px-10 backdrop-blur">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/gemini-svg.svg"
            alt="CoSpace"
            width={34}
            height={34}
            className="h-8 w-8 rounded-lg object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-xl font-extrabold tracking-tight text-[#ff385c] transition-colors">
            CoSpace
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/spaces"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/spaces" ? "text-[#222222] font-bold" : "text-[#6a6a6a] hover:text-[#222222]"
            }`}
          >
            {t("nav.spaces")}
          </Link>

          {user && (
            <Link
              href="/dashboard/reservas"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/dashboard") ? "text-[#222222] font-bold" : "text-[#6a6a6a] hover:text-[#222222]"
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
                pathname.startsWith("/admin") ? "text-[#ff385c] font-bold" : "text-[#6a6a6a] hover:text-[#ff385c]"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{t("nav.admin")}</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#222222]">{user.name}</span>
                  <span className="text-[10px] text-[#6a6a6a] uppercase font-medium">{user.role}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-[#f7f7f7] flex items-center justify-center text-[#222222] border border-[#dddddd]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <button
                  onClick={logout}
                  className="rounded-full p-2 text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#ff385c] transition-colors"
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
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#ff385c] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-sm active:scale-95"
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
