import "reflect-metadata";
import { Repository, DataSource } from "typeorm";
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
   * Obtiene el repositorio de Reservation de forma segura bajo Next.js/Turbopack.
   */
  private static getReservationRepo(dataSource: DataSource): Repository<Reservation> {
    if (dataSource.hasMetadata(Reservation)) {
      return dataSource.getRepository(Reservation);
    }
    return dataSource.getRepository<Reservation>("Reservation");
  }

  /**
   * Obtiene el repositorio de Space de forma segura bajo Next.js/Turbopack.
   */
  private static getSpaceRepo(dataSource: DataSource): Repository<Space> {
    if (dataSource.hasMetadata(Space)) {
      return dataSource.getRepository(Space);
    }
    return dataSource.getRepository<Space>("Space");
  }

  /**
   * Obtiene la fecha y hora declarada en la cadena ISO en el contexto de tiempo
   * local para evitar falsos positivos por desfase UTC al comparar con la hora actual.
   */
  private static parseDeclaredDateTime(isoString: string, fallbackDate: Date): Date {
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      const [, y, m, d, hh, mm] = match;
      return new Date(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
        parseInt(hh, 10),
        parseInt(mm, 10)
      );
    }
    return fallbackDate;
  }

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
    const reservationRepository = this.getReservationRepo(dataSource);

    return reservationRepository.find({
      where: { userId },
      relations: ["space"],
      order: { startTime: "DESC" },
    });
  }

  static async listAllReservationsForAdmin(): Promise<Reservation[]> {
    const dataSource = await getDataSource();
    const reservationRepository = this.getReservationRepo(dataSource);

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
    const reservationRepository = this.getReservationRepo(dataSource);

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
    const fallbackStart = new Date(input.startTime);
    const fallbackEnd = new Date(input.endTime);
    const startDate = this.parseDeclaredDateTime(input.startTime, fallbackStart);
    const endDate = this.parseDeclaredDateTime(input.endTime, fallbackEnd);
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

    // 2. Regla 2: Horario de atención permitido de 07:00 a 21:00
    const startHourParsed = this.parseDeclaredHour(input.startTime, startDate);
    const endHourParsed = this.parseDeclaredHour(input.endTime, endDate);

    const isStartValid =
      startHourParsed.hour >= 7 &&
      (startHourParsed.hour < 21 || (startHourParsed.hour === 21 && startHourParsed.minutes === 0));

    const isEndValid =
      endHourParsed.hour >= 7 &&
      (endHourParsed.hour < 21 || (endHourParsed.hour === 21 && endHourParsed.minutes === 0));

    if (!isStartValid || !isEndValid) {
      throw new BadRequestError(
        "Las reservas solo están permitidas dentro del horario de atención de 07:00 a 21:00"
      );
    }

    // 3. Regla 3: No en el pasado ni con más de 30 días de anticipación
    if (startDate.getTime() <= now.getTime()) {
      throw new BadRequestError("No se pueden realizar reservas en fechas u horas pasadas");
    }

    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (startDate.getTime() - now.getTime() > thirtyDaysMs) {
      throw new BadRequestError(
        "No es posible realizar reservas con más de 30 días de anticipación"
      );
    }

    const dataSource = await getDataSource();

    // Ejecución transaccional con bloqueo pesimista para evitar condiciones de carrera (concurrencia)
    return dataSource.transaction(async (transactionManager) => {
      // Bloqueo PESIMISTA de escritura sobre el espacio (SELECT ... FOR UPDATE)
      const spaceTarget = dataSource.hasMetadata(Space) ? Space : "Space";
      const space = await transactionManager.findOne<Space>(spaceTarget as any, {
        where: { id: input.spaceId },
        lock: { mode: "pessimistic_write" },
      });

      if (!space) {
        throw new NotFoundError("El espacio solicitado no existe");
      }

      // 4. Regla 7: No reservar espacios desactivados
      if (!space.isActive) {
        throw new BadRequestError("No se pueden realizar reservas en espacios inactivos");
      }

      // 5. Regla 4: Máximo 3 reservas activas simultáneas por usuario
      const resTarget = dataSource.hasMetadata(Reservation) ? Reservation : "Reservation";
      const userActiveReservationsCount = await transactionManager.count(resTarget as any, {
        where: {
          userId,
          status: "confirmed",
        },
      });

      if (userActiveReservationsCount >= 3) {
        throw new BadRequestError(
          "Has alcanzado el límite máximo permitido de 3 reservas activas simultáneas"
        );
      }

      // 6. Regla 5: Sin solapamiento en el mismo espacio (concurrencia y ocupación)
      const overlappingSpaceReservation = await transactionManager
        .createQueryBuilder(resTarget as any, "reservation")
        .where("reservation.spaceId = :spaceId", { spaceId: input.spaceId })
        .andWhere("reservation.status = :status", { status: "confirmed" })
        .andWhere(
          "((reservation.startTime <= :startTime AND reservation.endTime > :startTime) OR (reservation.startTime < :endTime AND reservation.endTime >= :endTime) OR (reservation.startTime >= :startTime AND reservation.endTime <= :endTime))",
          { startTime: startDate, endTime: endDate }
        )
        .getOne();

      if (overlappingSpaceReservation) {
        throw new ConflictError(
          "El espacio seleccionado ya se encuentra reservado en el horario solicitado"
        );
      }

      // 7. Regla 6: Sin solapamiento del mismo usuario en diferentes espacios
      const overlappingUserReservation = await transactionManager
        .createQueryBuilder(resTarget as any, "reservation")
        .where("reservation.userId = :userId", { userId })
        .andWhere("reservation.status = :status", { status: "confirmed" })
        .andWhere(
          "((reservation.startTime <= :startTime AND reservation.endTime > :startTime) OR (reservation.startTime < :endTime AND reservation.endTime >= :endTime) OR (reservation.startTime >= :startTime AND reservation.endTime <= :endTime))",
          { startTime: startDate, endTime: endDate }
        )
        .getOne();

      if (overlappingUserReservation) {
        throw new ConflictError(
          "Ya tienes otra reserva confirmada que se solapa con el horario seleccionado"
        );
      }

      // 8. Regla 8: Precio calculado en servidor = duracion_horas * precio_por_hora
      const totalPrice = Number((durationHours * Number(space.pricePerHour)).toFixed(2));

      // Crear y persistir la reserva confirmada
      const newReservation = transactionManager.create(resTarget as any, {
        userId,
        spaceId: input.spaceId,
        startTime: startDate,
        endTime: endDate,
        totalPrice,
        status: "confirmed",
      }) as unknown as Reservation;

      const savedReservation = await transactionManager.save(newReservation);
      savedReservation.space = space;
      return savedReservation;
    });
  }

  static async cancelReservation(
    reservationId: string,
    userId: string,
    userRole: UserRole
  ): Promise<Reservation> {
    const dataSource = await getDataSource();
    const reservationRepository = this.getReservationRepo(dataSource);

    const reservation = await reservationRepository.findOne({
      where: { id: reservationId },
      relations: ["space"],
    });

    if (!reservation) {
      throw new NotFoundError("La reserva solicitada no existe");
    }

    // Regla 9: Solo el propietario o el administrador pueden cancelar
    if (userRole !== "admin" && reservation.userId !== userId) {
      throw new ForbiddenError("No tienes permiso para cancelar esta reserva");
    }

    // Si ya está cancelada, no hacer nada
    if (reservation.status === "cancelled") {
      return reservation;
    }

    // Regla 10: Cancelación permitida únicamente con al menos 2 horas de anticipación
    const now = new Date();
    const reservationStartTime = new Date(reservation.startTime);
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if (reservationStartTime.getTime() - now.getTime() < twoHoursInMs) {
      throw new BadRequestError(
        "Solo es posible cancelar una reserva con al menos 2 horas de anticipación a su inicio"
      );
    }

    // Regla 11: La cancelación es lógica (status = 'cancelled'), no elimina físicamente
    reservation.status = "cancelled";
    return reservationRepository.save(reservation);
  }
}
