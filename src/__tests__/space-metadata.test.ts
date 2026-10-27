import "reflect-metadata";
import { AppDataSource } from "@/database/data-source";
import { Space } from "@/database/entities/Space";
import { Reservation } from "@/database/entities/Reservation";
import { User } from "@/database/entities/User";
import { RefreshToken } from "@/database/entities/RefreshToken";

describe("Verificación de Metadatos de TypeORM (DataSource)", () => {
  it("debe registrar explícitamente las 4 entidades del sistema en AppDataSource", () => {
    const registeredEntities = AppDataSource.options.entities as unknown[];
    expect(registeredEntities).toBeDefined();
    expect(registeredEntities).toContain(Space);
    expect(registeredEntities).toContain(Reservation);
    expect(registeredEntities).toContain(User);
    expect(registeredEntities).toContain(RefreshToken);
  });

  it("debe contener las entidades con sus nombres de clase preservados", () => {
    expect(Space.name).toBe("Space");
    expect(User.name).toBe("User");
    expect(RefreshToken.name).toBe("RefreshToken");
    expect(Reservation.name).toBe("Reservation");
  });
});
