import { NextRequest } from "next/server";
import { SpaceService } from "@/services/space.service";
import { requireAdmin, getSession } from "@/lib/session";
import { updateSpaceSchema } from "@/lib/validations/space.schema";
import { jsonSuccess, handleApiError } from "@/lib/http-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = getSession(request);
    const isAdmin = session?.role === "admin";

    // Los administradores pueden ver espacios incluso si están inactivos
    const space = await SpaceService.getSpaceById(id, !isAdmin);

    return jsonSuccess({ space }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const body: unknown = await request.json();
    const validatedData = updateSpaceSchema.parse(body);

    const updatedSpace = await SpaceService.updateSpace(id, validatedData);

    return jsonSuccess({ space: updatedSpace }, 200, "Espacio actualizado exitosamente");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const deactivatedSpace = await SpaceService.deactivateSpace(id);

    return jsonSuccess(
      { space: deactivatedSpace },
      200,
      "Espacio desactivado exitosamente"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

