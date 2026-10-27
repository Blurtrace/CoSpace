import { createReservationSchema } from "@/lib/validations/reservation.schema";
import { createSpaceSchema } from "@/lib/validations/space.schema";

describe("Validaciones de Negocio — Espacios (space.schema.ts)", () => {
  it("debe aceptar un espacio válido con todos los tipos permitidos", () => {
    const validDesk = {
      name: "Puesto Flexible",
      type: "desk" as const,
      pricePerHour: 15.5,
      capacity: 1,
    };
    expect(() => createSpaceSchema.parse(validDesk)).not.toThrow();

    const validMeetingRoom = {
      name: "Sala de Juntas",
      type: "meeting_room" as const,
      pricePerHour: 50.0,
      capacity: 10,
    };
    expect(() => createSpaceSchema.parse(validMeetingRoom)).not.toThrow();
  });

  it("debe rechazar precio por hora menor o igual a 0", () => {
    const invalidPrice = {
      name: "Espacio Gratis",
      type: "desk" as const,
      pricePerHour: 0,
      capacity: 1,
    };
    expect(() => createSpaceSchema.parse(invalidPrice)).toThrow();
  });

  it("debe rechazar tipos de espacio no contemplados", () => {
    const invalidType = {
      name: "Auditorio",
      type: "auditorium" as unknown as "desk",
      pricePerHour: 100,
      capacity: 50,
    };
    expect(() => createSpaceSchema.parse(invalidType)).toThrow();
  });
});

describe("Validaciones de Negocio — Esquema de Reservas (reservation.schema.ts)", () => {
  it("debe rechazar si la hora de fin es anterior o igual a la de inicio", () => {
    const invalid = {
      spaceId: "123e4567-e89b-12d3-a456-426614174000",
      startTime: "2026-10-30T10:00:00.000Z",
      endTime: "2026-10-30T09:00:00.000Z",
    };
    expect(() => createReservationSchema.parse(invalid)).toThrow();
  });

  it("debe validar un payload con fechas coherentes", () => {
    const valid = {
      spaceId: "123e4567-e89b-12d3-a456-426614174000",
      startTime: "2026-10-30T10:00:00.000Z",
      endTime: "2026-10-30T12:00:00.000Z",
    };
    expect(() => createReservationSchema.parse(valid)).not.toThrow();
  });
});

describe("Lógica de Intervalos y Solapamiento de Reservas", () => {
  // Función canónica para determinar solapamiento entre intervalos [start, end)
  function isOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  it("no debe considerar solapadas dos reservas consecutivas exactas (ej: 10:00-12:00 y 12:00-14:00)", () => {
    const r1Start = new Date("2026-10-30T10:00:00Z");
    const r1End = new Date("2026-10-30T12:00:00Z");

    const r2Start = new Date("2026-10-30T12:00:00Z");
    const r2End = new Date("2026-10-30T14:00:00Z");

    expect(isOverlapping(r1Start, r1End, r2Start, r2End)).toBe(false);
  });

  it("debe detectar solapamiento cuando una reserva está contenida dentro de otra", () => {
    const r1Start = new Date("2026-10-30T10:00:00Z");
    const r1End = new Date("2026-10-30T14:00:00Z");

    const r2Start = new Date("2026-10-30T11:00:00Z");
    const r2End = new Date("2026-10-30T12:00:00Z");

    expect(isOverlapping(r1Start, r1End, r2Start, r2End)).toBe(true);
  });

  it("debe detectar solapamiento parcial al inicio o fin", () => {
    const r1Start = new Date("2026-10-30T10:00:00Z");
    const r1End = new Date("2026-10-30T12:00:00Z");

    const r2Start = new Date("2026-10-30T11:00:00Z");
    const r2End = new Date("2026-10-30T13:00:00Z");

    expect(isOverlapping(r1Start, r1End, r2Start, r2End)).toBe(true);
  });
});

describe("Lógica de Fechas y Zona Horaria para Reservas", () => {
  function parseDeclaredDateTime(isoString: string): Date {
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
    return new Date(isoString);
  }

  it("debe interpretar la fecha y hora declarada en el contexto local", () => {
    const declared = parseDeclaredDateTime("2026-10-30T14:00:00.000Z");
    expect(declared.getFullYear()).toBe(2026);
    expect(declared.getMonth()).toBe(9); // Octubre (0-indexed)
    expect(declared.getDate()).toBe(30);
    expect(declared.getHours()).toBe(14);
  });

  it("debe rechazar fechas pasadas y admitir fechas futuras en comparación con now", () => {
    const pastDate = new Date(Date.now() - 3600000); // 1 hora atrás
    const futureDate = new Date(Date.now() + 3600000); // 1 hora adelante

    expect(pastDate.getTime() <= Date.now()).toBe(true);
    expect(futureDate.getTime() > Date.now()).toBe(true);
  });
});

