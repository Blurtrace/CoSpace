import { getDataSource } from "@/database/data-source";
import { Reservation, ReservationStatus } from "@/database/entities/Reservation";
import { Space } from "@/database/entities/Space";
import { UserRole } from "@/types/auth";
import { CreateReservationInput } from "@/lib/validations/reservation.schema";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";

export class ReservationService {
  /**
   * Obtiene la hora declarada en la cadena ISO para evitar desajustes
   * causados por la zona horaria del servidor (UTC vs local).
   */
  private static parseDeclaredHour(isoString: string, fallbackDate: Date): { hour: number; minutes: number } {
    const match = isoString.match(/T(\d{2}):(\d{2})/);
    if (match) {
      return {
        hour: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
      };
    }
    return {
      hour: fallbackDate.getHours(),
      minutes: fallbackDate.getMinutes(),
    };
  }

  static async listUserReservations(userId: string): Promise<Reservation[]> {
    const dataSource = await getDataSource();
    const reservationRepository = dataSource.getRepository(Reservation);

    return reservationRepository.find({
      where: { userId },
      relations: ["space"],
      order: { startTime: "DESC" },
    });
  }

  static async listAllReservationsForAdmin(): Promise<Reservation[]> {
    const dataSource = await getDataSource();
    const reservationRepository = dataSource.getRepository(Reservation);

    return reservationRepository.find({
      relations: ["space", "user"],
      order: { startTime: "DESC" },
    });
  }

  static async getReservationById(
    reservationId: string,
    userId: string,
    userRole: UserRole
  ): Promise<Reservation> {
    const dataSource = await getDataSource();
    const reservationRepository = dataSource.getRepository(Reservation);

    const reservation = await reservationRepository.findOne({
      where: { id: reservationId },
      relations: ["space", "user"],
    });

    if (!reservation) {
      throw new NotFoundError("La reserva solicitada no existe");
    }

    // Regla 14: Un usuario no puede consultar reservas de terceros manipulando el ID
    if (userRole !== "admin" && reservation.userId !== userId) {
      throw new ForbiddenError("No tienes permiso para acceder a esta reserva");
    }

    return reservation;
  }

  static async createReservation(
    userId: string,
    input: CreateReservationInput
  ): Promise<Reservation> {
    const startDate = new Date(input.startTime);
    const endDate = new Date(input.endTime);
    const now = new Date();

    // 1. Regla 1: Duración de 1 a 4 horas completas
    const durationMs = endDate.getTime() - startDate.getTime();
    const oneHourMs = 60 * 60 * 1000;
    const durationHours = durationMs / oneHourMs;

    if (
      durationHours < 1 ||
      durationHours > 4 ||
      !Number.isInteger(durationHours) ||
      durationMs % oneHourMs !== 0
    ) {
      throw new BadRequestError(
        "La duración de la reserva debe ser de 1 a 4 horas completas"
      );
    }

    // 2. Regla 2: Horario permitido 07:00–21:00
    const startDeclared = this.parseDeclaredHour(input.startTime, startDate);
    const endDeclaredHour = startDeclared.hour + durationHours;

    if (
      startDeclared.minutes !== 0 ||
      startDeclared.hour < 7 ||
      endDeclaredHour > 21
    ) {
      throw new BadRequestError(
        "El horario permitido para reservas es de 07:00 a 21:00 en horas en punto"
      );
    }

    // 3. Regla 3: No reservar en el pasado ni a más de 30 días
    if (startDate.getTime() < now.getTime()) {
      throw new BadRequestError(
        "No es posible realizar reservas en fechas u horas pasadas"
      );
    }

    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (startDate.getTime() > now.getTime() + thirtyDaysMs) {
      throw new BadRequestError(
        "No es posible realizar reservas con más de 30 días de anticipación"
      );
    }

    const dataSource = await getDataSource();

    // Ejecución transaccional con bloqueo pesimista para evitar condiciones de carrera (concurrencia)
    return dataSource.transaction(async (transactionManager) => {
      // Bloqueo PESIMISTA de escritura sobre el espacio (SELECT ... FOR UPDATE)
      const space = await transactionManager.findOne(Space, {
        where: { id: input.spaceId },
        lock: { mode: "pessimistic_write" },
      });

      if (!space) {
        throw new NotFoundError("El espacio solicitado no existe");
      }

      // 4. Regla 7: No reservar espacios desactivados
      if (!space.isActive) {
        throw new BadRequestError(
          "El espacio seleccionado se encuentra desactivado y no admite reservas"
        );
      }

      // 5. Regla 6: Máximo 3 reservas futuras confirmadas por usuario
      const userFutureConfirmedCount = await transactionManager
        .getRepository(Reservation)
        .createQueryBuilder("r")
        .where("r.userId = :userId", { userId })
        .andWhere("r.status = :status", { status: "confirmed" })
        .andWhere("r.endTime > :now", { now })
        .getCount();

      if (userFutureConfirmedCount >= 3) {
        throw new ConflictError(
          "Has alcanzado el límite máximo de 3 reservas futuras confirmadas"
        );
      }

      // 6. Regla 5: El usuario no puede solapar sus propias reservas confirmadas
      const userOverlap = await transactionManager
        .getRepository(Reservation)
        .createQueryBuilder("r")
        .where("r.userId = :userId", { userId })
        .andWhere("r.status = :status", { status: "confirmed" })
        .andWhere("r.startTime < :endDate AND r.endTime > :startDate", {
          startDate,
          endDate,
        })
        .getOne();

      if (userOverlap) {
        throw new ConflictError(
          "Ya posees otra reserva confirmada que se solapa con el horario seleccionado"
        );
      }

      // 7. Regla 4: No solapar reservas confirmadas del mismo espacio
      const spaceOverlap = await transactionManager
        .getRepository(Reservation)
        .createQueryBuilder("r")
        .where("r.spaceId = :spaceId", { spaceId: space.id })
        .andWhere("r.status = :status", { status: "confirmed" })
        .andWhere("r.startTime < :endDate AND r.endTime > :startDate", {
          startDate,
          endDate,
        })
        .getOne();

      if (spaceOverlap) {
        throw new ConflictError(
          "El espacio ya cuenta con una reserva confirmada en el horario solicitado"
        );
      }

      // 8. Regla 8: El servidor calcula el precio total con duración × precio por hora
      const calculatedTotalPrice = Number(
        (durationHours * space.pricePerHour).toFixed(2)
      );

      const reservation = transactionManager.getRepository(Reservation).create({
        userId,
        spaceId: space.id,
        startTime: startDate,
        endTime: endDate,
        totalPrice: calculatedTotalPrice,
        status: "confirmed",
      });

      const savedReservation = await transactionManager
        .getRepository(Reservation)
        .save(reservation);

      return savedReservation;
    });
  }

  static async cancelReservation(
    reservationId: string,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Reservation> {
    const dataSource = await getDataSource();
    const reservationRepository = dataSource.getRepository(Reservation);

    const reservation = await reservationRepository.findOne({
      where: { id: reservationId },
      relations: ["space"],
    });

    if (!reservation) {
      throw new NotFoundError("La reserva a cancelar no existe");
    }

    // Regla 9: Solo el dueño de la reserva o un administrador puede cancelarla
    const isOwner = reservation.userId === requestingUserId;
    const isAdmin = requestingUserRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError(
        "No tienes autorización para cancelar la reserva de otro usuario"
      );
    }

    // Si ya está cancelada, no permitir cancelar de nuevo
    if (reservation.status === "cancelled") {
      throw new BadRequestError("La reserva ya ha sido cancelada previamente");
    }

    // Regla 10: El usuario solo puede cancelar hasta 2 horas antes del inicio
    const now = new Date();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    const timeUntilStart = reservation.startTime.getTime() - now.getTime();

    if (!isAdmin && timeUntilStart < twoHoursMs) {
      throw new BadRequestError(
        "Las cancelaciones deben realizarse con al menos 2 horas de anticipación a la hora de inicio"
      );
    }

    // Regla 11: Cancelar cambia el estado, no elimina el registro
    reservation.status = "cancelled";
    return reservationRepository.save(reservation);
  }
}

