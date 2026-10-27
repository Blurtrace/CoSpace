import Link from "next/link";
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

  const spacesEntities = await SpaceService.listActiveSpaces(activeType);

  // Serializar a SpaceDTO para el componente de cliente
  const spaces: SpaceDTO[] = spacesEntities.map((s) => ({
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

  const filterTabs = [
    { label: "Todos los espacios", value: undefined },
    { label: "Puestos Flexibles", value: "desk" },
    { label: "Salas de Juntas", value: "meeting_room" },
    { label: "Oficinas Privadas", value: "private_office" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Catálogo de Espacios
        </h1>
        <p className="text-sm text-[#b3b3b3] max-w-2xl">
          Encuentra el lugar ideal para trabajar, colaborar o reunirte con tu equipo. Reserva por horas completas con confirmación inmediata.
        </p>

        {/* Filtros estilo Spotify pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {filterTabs.map((tab) => {
            const isActive = tab.value === activeType;
            const href = tab.value ? `/spaces?type=${tab.value}` : "/spaces";

            return (
              <Link
                key={tab.label}
                href={href}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-[#1ed760] text-black"
                    : "bg-[#1f1f1f] text-white hover:bg-[#282828]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {spaces.length === 0 ? (
          <div className="rounded-xl border border-[#282828] bg-[#181818] p-12 text-center text-[#b3b3b3]">
            <p className="text-base font-semibold text-white">No se encontraron espacios disponibles</p>
            <p className="mt-1 text-xs">Prueba seleccionando otra categoría o vuelve más tarde.</p>
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

