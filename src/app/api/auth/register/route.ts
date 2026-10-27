import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/cookies";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = registerSchema.parse(body);

    const result = await AuthService.register(validatedData);

    const response = jsonSuccess(
      { user: result.user },
      201,
      "Usuario registrado e iniciado con éxito"
    );

    return setAuthCookies(response, result.accessToken, result.refreshToken);
  } catch (error) {
    return handleApiError(error);
  }
}

