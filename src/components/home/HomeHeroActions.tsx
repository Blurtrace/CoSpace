"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/shared/AuthContext";

export const HomeHeroActions: React.FC = () => {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      <Link
        href="/spaces"
        className="inline-flex items-center gap-2 rounded-full bg-[#ff385c] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-md active:scale-95"
      >
        <span>Explorar Espacios</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Renderizado condicional según estado real de autenticación */}
      {mounted && !loading && (
        <>
          {user ? (
            <Link
              href="/dashboard/reservas"
              className="inline-flex items-center gap-2 rounded-full border border-[#dddddd] bg-white px-8 py-3.5 text-sm font-semibold text-[#222222] transition-colors hover:border-[#222222] hover:bg-[#f7f7f7]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#ff385c]" />
              <span>Mis Reservas</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#dddddd] bg-white px-8 py-3.5 text-sm font-semibold text-[#222222] transition-colors hover:border-[#222222] hover:bg-[#f7f7f7]"
            >
              Iniciar Sesión
            </Link>
          )}
        </>
      )}
    </div>
  );
};

