import esMessages from "../../messages/es.json";
import enMessages from "../../messages/en.json";

export type Locale = "es" | "en";

export const LOCALE_COOKIE_NAME = "cospace_locale";
export const DEFAULT_LOCALE: Locale = "es";

export const messagesMap: Record<Locale, typeof esMessages> = {
  es: esMessages,
  en: enMessages,
};

export function getDictionary(locale: Locale) {
  return messagesMap[locale] || messagesMap[DEFAULT_LOCALE];
}

