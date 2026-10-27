import { NextRequest } from "next/server";
import { ReservationService } from "@/services/reservation.service";
import { requireAuth } from "@/lib/session";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = requireAuth(request);
    const { id } = await params;

    const reservation = await ReservationService.getReservationById(
      id,
      session.userId,
      session.role
    );

    return jsonSuccess({ reservation }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

