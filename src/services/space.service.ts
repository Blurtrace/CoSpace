import { getDataSource } from "@/database/data-source";
import { Space, SpaceType } from "@/database/entities/Space";
import { Reservation } from "@/database/entities/Reservation";
import { CreateSpaceInput, UpdateSpaceInput } from "@/lib/validations/space.schema";
import { NotFoundError, ConflictError } from "@/lib/errors";

export class SpaceService {
  static async listActiveSpaces(typeFilter?: SpaceType): Promise<Space[]> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    const queryBuilder = spaceRepository
      .createQueryBuilder("space")
      .where("space.isActive = :isActive", { isActive: true })
      .orderBy("space.name", "ASC");

    if (typeFilter) {
      queryBuilder.andWhere("space.type = :type", { type: typeFilter });
    }

    return queryBuilder.getMany();
  }

  static async listAllSpaces(): Promise<Space[]> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    return spaceRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  static async getSpaceById(id: string, requireActive = false): Promise<Space> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    const space = await spaceRepository.findOne({
      where: { id },
    });

    if (!space) {
      throw new NotFoundError("El espacio solicitado no existe");
    }

    if (requireActive && !space.isActive) {
      throw new NotFoundError("El espacio no se encuentra disponible");
    }

    return space;
  }

  static async createSpace(input: CreateSpaceInput): Promise<Space> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    const space = spaceRepository.create({
      name: input.name,
      description: input.description ?? null,
      type: input.type,
      pricePerHour: input.pricePerHour,
      capacity: input.capacity,
      imageUrl: input.imageUrl ?? null,
      isActive: input.isActive ?? true,
    });

    return spaceRepository.save(space);
  }

  static async updateSpace(id: string, input: UpdateSpaceInput): Promise<Space> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    const space = await this.getSpaceById(id);

    // Si se intenta desactivar el espacio a través de la actualización, validar reservas futuras
    if (input.isActive === false && space.isActive === true) {
      await this.validateNoFutureReservations(id, dataSource);
    }

    Object.assign(space, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.pricePerHour !== undefined ? { pricePerHour: input.pricePerHour } : {}),
      ...(input.capacity !== undefined ? { capacity: input.capacity } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });

    return spaceRepository.save(space);
  }

  static async deactivateSpace(id: string): Promise<Space> {
    const dataSource = await getDataSource();
    const spaceRepository = dataSource.getRepository(Space);

    const space = await this.getSpaceById(id);

    if (!space.isActive) {
      return space; // Ya está desactivado
    }

    // Regla 13: No desactivar un espacio con reservas futuras confirmadas
    await this.validateNoFutureReservations(id, dataSource);

    // Regla 12: Desactivar no elimina físicamente el registro
    space.isActive = false;
    return spaceRepository.save(space);
  }

  private static async validateNoFutureReservations(
    spaceId: string,
    dataSource: Awaited<ReturnType<typeof getDataSource>>
  ): Promise<void> {
    const reservationRepository = dataSource.getRepository(Reservation);
    const now = new Date();

    const futureActiveCount = await reservationRepository
      .createQueryBuilder("reservation")
      .where("reservation.spaceId = :spaceId", { spaceId })
      .andWhere("reservation.status = :status", { status: "confirmed" })
      .andWhere("reservation.endTime > :now", { now })
      .getCount();

    if (futureActiveCount > 0) {
      throw new ConflictError(
        "No es posible desactivar el espacio porque cuenta con reservas futuras confirmadas"
      );
    }
  }
}

