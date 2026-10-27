import { signAccessToken } from "@/lib/auth";
import { verifyAccessTokenEdge } from "@/lib/auth-edge";

describe("Módulo de Validación JWT para Edge Runtime (auth-edge.ts)", () => {
  it("debe verificar un token firmado por jsonwebtoken", async () => {
    const payload = {
      userId: "user-edge-123",
      email: "edge@cospace.local",
      role: "admin" as const,
    };

    const token = signAccessToken(payload);
    const verified = await verifyAccessTokenEdge(token);

    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe("admin");
  });

  it("debe rechazar tokens con firma manipulada", async () => {
    const payload = {
      userId: "user-edge-123",
      email: "edge@cospace.local",
      role: "user" as const,
    };

    const token = signAccessToken(payload);
    const tampered = token.slice(0, -4) + "abcd";
    const verified = await verifyAccessTokenEdge(tampered);

    expect(verified).toBeNull();
  });

  it("debe retornar null para formatos mal formados", async () => {
    expect(await verifyAccessTokenEdge("not.a.valid.jwt.token")).toBeNull();
    expect(await verifyAccessTokenEdge("")).toBeNull();
  });
});

