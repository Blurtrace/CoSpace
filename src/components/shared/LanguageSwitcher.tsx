"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#383838] bg-[#181818] p-1 text-xs">
      <div className="pl-1.5 pr-0.5 text-[#7c7c7c]">
        <Globe className="h-3.5 w-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wider transition-all ${
          locale === "es"
            ? "bg-[#1ed760] text-black shadow-sm"
            : "text-[#b3b3b3] hover:text-white"
        }`}
        aria-label="Cambiar idioma a Español"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wider transition-all ${
          locale === "en"
            ? "bg-[#1ed760] text-black shadow-sm"
            : "text-[#b3b3b3] hover:text-white"
        }`}
        aria-label="Switch language to English"
      >
        EN
      </button>
    </div>
  );
};

