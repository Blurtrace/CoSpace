import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#282828] bg-[#121212] py-12 text-[#b3b3b3]">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[#1ed760] flex items-center justify-center font-black text-black text-[10px]">
            CS
          </div>
          <span className="text-sm font-bold text-white tracking-tight">CoSpace</span>
          <span className="text-xs text-[#7c7c7c]">Plataforma de Coworking</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/spaces" className="hover:text-white transition-colors">
            Catálogo
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Acceso
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Reservas
          </Link>
        </div>

        <p className="text-xs text-[#7c7c7c]">
          &copy; {new Date().getFullYear()} CoSpace. Diseñado bajo especificación Spotify Design System.
        </p>
      </div>
    </footer>
  );
};

