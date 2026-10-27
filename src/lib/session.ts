import { NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME } from "./cookies";
import { verifyAccessToken } from "./auth";
import { JWTPayload, UserRole } from "@/types/auth";
import { UnauthorizedError, ForbiddenError } from "./errors";

export function getSession(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifyAccessToken(token);
}

export function requireAuth(request: NextRequest): JWTPayload {
  const session = getSession(request);
  if (!session) {
    throw new UnauthorizedError("Se requiere una sesión activa para acceder a este recurso");
  }
  return session;
}

export function requireRole(request: NextRequest, allowedRoles: UserRole[]): JWTPayload {
  const session = requireAuth(request);
  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError("No tienes permisos suficientes para realizar esta acción");
  }
  return session;
}

export function requireAdmin(request: NextRequest): JWTPayload {
  return requireRole(request, ["admin"]);
}

export function requireOwnerOrAdmin(request: NextRequest, resourceOwnerId: string): JWTPayload {
  const session = requireAuth(request);
  if (session.role === "admin" || session.userId === resourceOwnerId) {
    return session;
  }
  throw new ForbiddenError("No tienes permiso para consultar o modificar este recurso");
}

