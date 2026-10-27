import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { SpaceService } from "@/services/space.service";
import { SpaceType } from "@/database/entities/Space";
import { SpaceCard } from "@/components/cards/SpaceCard";
import { SpaceDTO } from "@/types/space";

// Forzar SSR dinámico para catálogo siempre fresco
export const dynamic = "force-dynamic";

interface SpacesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function SpacesCatalogPage({ searchParams }: SpacesPageProps) {
  const { type } = await searchParams;
  const activeType = type as SpaceType | undefined;

  let spaces: SpaceDTO[] = [];
  let fetchError: string | null = null;

  try {
    const spacesEntities = await SpaceService.listActiveSpaces(activeType);

    // Serializar a SpaceDTO para el componente de cliente
    spaces = spacesEntities.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      type: s.type,
      pricePerHour: Number(s.pricePerHour),
      capacity: s.capacity,
      imageUrl: s.imageUrl,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error al consultar el catálogo de espacios:", error);
    fetchError = "No fue posible consultar los espacios en este momento. Por favor, intenta de nuevo más tarde.";
  }

  const filterTabs = [
    { label: "Todos los espacios", value: undefined },
    { label: "Puestos Flexibles", value: "desk" },
    { label: "Salas de Juntas", value: "meeting_room" },
    { label: "Oficinas Privadas", value: "private_office" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#222222]">
            Catálogo de Espacios
          </h1>
          <p className="mt-1 text-sm text-[#6a6a6a] max-w-2xl">
            Encuentra el lugar ideal para trabajar, colaborar o reunirte con tu equipo. Reserva por horas completas con confirmación inmediata.
          </p>
        </div>

        {/* Filtros estilo categoría Airbnb */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {filterTabs.map((tab) => {
            const isActive = tab.value === activeType;
            const href = tab.value ? `/spaces?type=${tab.value}` : "/spaces";

            return (
              <Link
                key={tab.label}
                href={href}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#222222] text-white shadow-sm"
                    : "bg-[#f7f7f7] text-[#222222] border border-[#dddddd] hover:border-[#222222]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {fetchError && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-4 text-xs font-medium text-[#c13515]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{fetchError}</span>
        </div>
      )}

      <div className="mt-8">
        {spaces.length === 0 && !fetchError ? (
          <div className="rounded-2xl border border-[#ebebeb] bg-[#f7f7f7] p-12 text-center text-[#6a6a6a]">
            <p className="text-base font-semibold text-[#222222]">No se encontraron espacios disponibles</p>
            <p className="mt-1 text-xs text-[#929292]">Prueba seleccionando otra categoría o vuelve más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
