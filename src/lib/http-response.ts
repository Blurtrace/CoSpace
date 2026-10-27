import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export function jsonSuccess<T>(data: T, status = 200, message?: string): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      ...(message ? { message } : {}),
    },
    { status }
  );
}

export function jsonError(
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 500 = 400,
  code = "BAD_REQUEST",
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return jsonError(error.message, error.statusCode, error.code, error.details);
  }

  if (error instanceof ZodError) {
    return jsonError(
      "Datos de entrada inválidos",
      400,
      "VALIDATION_ERROR",
      error.flatten().fieldErrors
    );
  }

  console.error("[API_ERROR]", error instanceof Error ? error.message : "Error desconocido");
  return jsonError("Ha ocurrido un error interno en el servidor", 500, "INTERNAL_SERVER_ERROR");
}

