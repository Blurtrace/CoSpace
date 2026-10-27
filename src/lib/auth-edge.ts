import { JWTPayload } from "@/types/auth";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fallback_access_secret_cospace_dev_only";

/**
 * Validador de JWT para el Edge Runtime (Middleware).
 * Utiliza exclusivamente Web Crypto API (crypto.subtle) y APIs estándar Web (atob, TextEncoder).
 * No carga módulos nativos de Node.js como 'crypto', 'stream' o 'buffer'.
 */
export async function verifyAccessTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(ACCESS_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decodifica la firma base64url con padding si hace falta
    const base64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const rawSig = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify("HMAC", key, rawSig, data);
    if (!isValid) {
      return null;
    }

    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson) as JWTPayload & { exp?: number };

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    if (!payload.userId || !payload.role) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
