import { NextRequest } from "next/server";
import { SpaceService } from "@/services/space.service";
import { SpaceType } from "@/database/entities/Space";
import { requireAdmin } from "@/lib/session";
import { createSpaceSchema } from "@/lib/validations/space.schema";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const typeParam = searchParams.get("type") as SpaceType | null;

    const spaces = await SpaceService.listActiveSpaces(typeParam ?? undefined);

    return jsonSuccess({ spaces }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body: unknown = await request.json();
    const validatedData = createSpaceSchema.parse(body);

    const createdSpace = await SpaceService.createSpace(validatedData);

    return jsonSuccess({ space: createdSpace }, 201, "Espacio creado exitosamente");
  } catch (error) {
    return handleApiError(error);
  }
}

