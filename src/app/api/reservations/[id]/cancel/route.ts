import { NextRequest } from "next/server";
import { ReservationService } from "@/services/reservation.service";
import { requireAuth } from "@/lib/session";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = requireAuth(request);
    const { id } = await params;

    const cancelledReservation = await ReservationService.cancelReservation(
      id,
      session.userId,
      session.role
    );

    return jsonSuccess(
      { reservation: cancelledReservation },
      200,
      "Reserva cancelada exitosamente"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

