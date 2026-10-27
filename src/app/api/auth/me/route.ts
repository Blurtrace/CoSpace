import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/session";
import { AuthService } from "@/services/auth.service";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

export async function GET(request: NextRequest) {
  try {
    const session = requireAuth(request);
    const user = await AuthService.getUserProfile(session.userId);

    return jsonSuccess({ user }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

