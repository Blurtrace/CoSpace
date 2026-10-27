import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/session";
import { AuthService } from "@/services/auth.service";
import { jsonSuccess, handleApiError } from "@/lib/http-response";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = requireAuth(request);

    try {
      const user = await AuthService.getUserProfile(session.userId);
      return jsonSuccess({ user }, 200);
    } catch {
      throw new UnauthorizedError("Sesión inválida o usuario no encontrado");
    }
  } catch (error) {
    return handleApiError(error);
  }
}
