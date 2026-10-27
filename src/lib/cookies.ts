import { NextResponse } from "next/server";

export const ACCESS_COOKIE_NAME = "cospace_access_token";
export const REFRESH_COOKIE_NAME = "cospace_refresh_token";

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60; // 15 minutos
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 días

const isProduction = process.env.NODE_ENV === "production";
const isCookieSecure = process.env.COOKIE_SECURE === "true" || isProduction;
const cookieSameSite = (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax";

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: isCookieSecure,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    secure: isCookieSecure,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isCookieSecure,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isCookieSecure,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: 0,
  });

  return response;
}
