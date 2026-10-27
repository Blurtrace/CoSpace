import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, DollarSign, ArrowLeft } from "lucide-react";
import { SpaceService } from "@/services/space.service";
import { Badge } from "@/components/ui/Badge";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { SpaceDTO, SpaceType } from "@/types/space";

export const dynamic = "force-dynamic";

interface SpaceDetailPageProps {
  params: Promise<{ id: string }>;
}

const TYPE_LABELS: Record<SpaceType, string> = {
  desk: "Puesto Flexible",
  meeting_room: "Sala de Juntas",
  private_office: "Oficina Privada",
};

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { id } = await params;

  let spaceEntity;
  try {
    spaceEntity = await SpaceService.getSpaceById(id, true);
  } catch {
    notFound();
  }

  const space: SpaceDTO = {
    id: spaceEntity.id,
    name: spaceEntity.name,
    description: spaceEntity.description,
    type: spaceEntity.type,
    pricePerHour: Number(spaceEntity.pricePerHour),
    capacity: spaceEntity.capacity,
    imageUrl: spaceEntity.imageUrl,
    isActive: spaceEntity.isActive,
    createdAt: spaceEntity.createdAt.toISOString(),
    updatedAt: spaceEntity.updatedAt.toISOString(),
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80";

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al catálogo</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Columna Izquierda: Información del Espacio */}
        <div className="space-y-6 lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#282828] shadow-[rgba(0,0,0,0.5)_0px_8px_24px]">
            <Image
              src={space.imageUrl || defaultImage}
              alt={space.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="neutral">{TYPE_LABELS[space.type]}</Badge>
              <Badge variant="success">Disponible</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {space.name}
            </h1>
          </div>

          {space.description && (
            <div className="space-y-2 border-t border-[#282828] pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#b3b3b3]">
                Descripción del espacio
              </h2>
              <p className="text-sm leading-relaxed text-[#cbcbcb]">
                {space.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-[#282828] pt-4">
            <div className="flex items-center gap-3 rounded-lg bg-[#181818] p-4">
              <div className="rounded-full bg-[#1f1f1f] p-2.5 text-[#1ed760]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#7c7c7c]">Capacidad</p>
                <p className="text-sm font-bold text-white">
                  Hasta {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-[#181818] p-4">
              <div className="rounded-full bg-[#1f1f1f] p-2.5 text-[#1ed760]">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#7c7c7c]">Tarifa</p>
                <p className="text-sm font-bold text-white">
                  ${space.pricePerHour.toFixed(2)} <span className="text-xs font-normal text-[#7c7c7c]">/ hora</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Reserva */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <ReservationForm space={space} />
          </div>
        </div>
      </div>
    </main>
  );
}

