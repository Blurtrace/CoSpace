import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth.service";
import { REFRESH_COOKIE_NAME, clearAuthCookies } from "@/lib/cookies";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    await AuthService.logout(rawRefreshToken);

    const response = jsonSuccess(
      { success: true },
      200,
      "Sesión cerrada exitosamente"
    );

    return clearAuthCookies(response);
  } catch (error) {
    return handleApiError(error);
  }
}

