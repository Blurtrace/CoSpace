import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME } from "./src/lib/cookies";
import { verifyAccessTokenEdge } from "./src/lib/auth-edge";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // No interceptar peticiones de la API, archivos estáticos o internas de Next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const session = token ? await verifyAccessTokenEdge(token) : null;

  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/");

  const isPrivateRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  // Si ya tiene sesión activa y navega a /login o /register, redirigir al dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard/reservas", request.url));
  }

  // Rutas privadas que requieren autenticación
  if (isPrivateRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas exclusivas para administradores
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/reservas", request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

