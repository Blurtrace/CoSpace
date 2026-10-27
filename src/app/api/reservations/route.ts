import { NextRequest } from "next/server";
import { ReservationService } from "@/services/reservation.service";
import { requireAuth } from "@/lib/session";
import { createReservationSchema } from "@/lib/validations/reservation.schema";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

export async function GET(request: NextRequest) {
  try {
    const session = requireAuth(request);
    const { searchParams } = request.nextUrl;
    const viewAll = searchParams.get("all") === "true";

    // Si es administrador y solicita ver todas las reservas
    if (session.role === "admin" && viewAll) {
      const allReservations = await ReservationService.listAllReservationsForAdmin();
      return jsonSuccess({ reservations: allReservations }, 200);
    }

    // Regla: listar exclusivamente las reservas del usuario autenticado
    const userReservations = await ReservationService.listUserReservations(session.userId);
    return jsonSuccess({ reservations: userReservations }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth(request);

    const body: unknown = await request.json();
    const validatedData = createReservationSchema.parse(body);

    const reservation = await ReservationService.createReservation(
      session.userId,
      validatedData
    );

    return jsonSuccess(
      { reservation },
      201,
      "Reserva confirmada exitosamente"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

