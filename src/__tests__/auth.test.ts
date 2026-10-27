import {
  hashPassword,
  comparePassword,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth.schema";

describe("Módulo de Criptografía y JWT (auth.ts)", () => {
  it("debe hashear contraseñas y verificarlas correctamente", async () => {
    const plain = "SuperSecret123!";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(await comparePassword(plain, hash)).toBe(true);
    expect(await comparePassword("WrongPassword", hash)).toBe(false);
  });

  it("debe generar un hash SHA-256 determinista para tokens", () => {
    const token = "sample-token-123";
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("debe firmar y verificar un access token válido", () => {
    const payload = {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      email: "test@cospacex.local",
      role: "user" as const,
    };

    const token = signAccessToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it("debe retornar null al verificar un access token manipulado o inválido", () => {
    const invalidToken = "invalid.bearer.token";
    expect(verifyAccessToken(invalidToken)).toBeNull();
  });

  it("debe firmar y verificar un refresh token válido", () => {
    const payload = { userId: "user-uuid-999" };
    const token = signRefreshToken(payload);

    const decoded = verifyRefreshToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
  });
});

describe("Esquemas de Validación Zod (auth.schema.ts)", () => {
  it("debe normalizar el email a minúsculas y recortar espacios en register", () => {
    const input = {
      name: "  Juan Pérez  ",
      email: "  JUAN.PEREZ@DOMAIN.COM  ",
      password: "password123",
    };

    const result = registerSchema.parse(input);
    expect(result.name).toBe("Juan Pérez");
    expect(result.email).toBe("juan.perez@domain.com");
  });

  it("debe rechazar correos inválidos", () => {
    const input = {
      name: "Test User",
      email: "invalid-email-address",
      password: "password123",
    };

    expect(() => registerSchema.parse(input)).toThrow();
  });

  it("debe rechazar contraseñas cortas (< 6 caracteres)", () => {
    const input = {
      name: "Test User",
      email: "test@domain.com",
      password: "123",
    };

    expect(() => registerSchema.parse(input)).toThrow();
  });

  it("debe validar credenciales en login", () => {
    const valid = {
      email: "USER@DOMAIN.COM",
      password: "secretpassword",
    };

    const result = loginSchema.parse(valid);
    expect(result.email).toBe("user@domain.com");
  });
});

