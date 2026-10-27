import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#ebebeb] bg-[#f7f7f7] py-10 text-[#6a6a6a]">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/gemini-svg.svg"
            alt="CoSpace"
            width={24}
            height={24}
            className="h-6 w-6 rounded-md object-contain"
          />
          <span className="text-sm font-bold text-[#222222] tracking-tight">CoSpace</span>
          <span className="text-xs text-[#929292]">&middot; Coworking Spaces</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/spaces" className="hover:text-[#222222] transition-colors">
            Catálogo
          </Link>
          <Link href="/login" className="hover:text-[#222222] transition-colors">
            Acceso
          </Link>
          <Link href="/dashboard/reservas" className="hover:text-[#222222] transition-colors">
            Mis Reservas
          </Link>
        </div>

        <p className="text-xs text-[#929292]">
          &copy; {new Date().getFullYear()} CoSpace. Airbnb Design System Specification.
        </p>
      </div>
    </footer>
  );
};
