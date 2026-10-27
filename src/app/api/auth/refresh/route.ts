import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth.service";
import { REFRESH_COOKIE_NAME, setAuthCookies, clearAuthCookies } from "@/lib/cookies";
import { jsonSuccess, jsonError, handleApiError } from "@/lib/http-response";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!rawRefreshToken) {
      return jsonError("No se proporcionó token de actualización", 401, "UNAUTHORIZED");
    }

    const result = await AuthService.refreshSession(rawRefreshToken);

    const response = jsonSuccess(
      { user: result.user },
      200,
      "Sesión renovada con éxito"
    );

    return setAuthCookies(response, result.accessToken, result.refreshToken);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return clearAuthCookies(errorResponse);
  }
}

