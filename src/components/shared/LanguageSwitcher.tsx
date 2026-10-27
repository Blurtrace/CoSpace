"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <aside
      aria-label="Selector de idioma / Language selector"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-full border border-[#dddddd] bg-white/95 p-1.5 shadow-[rgba(0,0,0,0.12)_0_4px_16px] backdrop-blur transition-all duration-200 hover:shadow-[rgba(0,0,0,0.18)_0_6px_20px]"
    >
      <div className="pl-2 pr-1 text-[#6a6a6a]" aria-hidden="true">
        <Globe className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLocale("es")}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === "es"
              ? "bg-[#ff385c] text-white shadow-sm"
              : "text-[#222222] hover:bg-[#f7f7f7]"
          }`}
          aria-label="Cambiar idioma a Español"
          aria-pressed={locale === "es"}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === "en"
              ? "bg-[#ff385c] text-white shadow-sm"
              : "text-[#222222] hover:bg-[#f7f7f7]"
          }`}
          aria-label="Switch language to English"
          aria-pressed={locale === "en"}
        >
          EN
        </button>
      </div>
    </aside>
  );
};
