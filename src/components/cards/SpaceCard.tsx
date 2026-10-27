import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SpaceDTO, SpaceType } from "@/types/space";

interface SpaceCardProps {
  space: SpaceDTO;
}

const TYPE_LABELS: Record<SpaceType, string> = {
  desk: "Puesto Flexible",
  meeting_room: "Sala de Juntas",
  private_office: "Oficina Privada",
};

export const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-[#181818] p-4 transition-all duration-300 hover:bg-[#222222] hover:shadow-[rgba(0,0,0,0.4)_0px_8px_16px]">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#282828]">
        <Image
          src={space.imageUrl || defaultImage}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="neutral">{TYPE_LABELS[space.type] || space.type}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-[#1ed760] transition-colors">
            {space.name}
          </h3>
          {space.description && (
            <p className="mt-1 line-clamp-2 text-xs text-[#b3b3b3]">
              {space.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#282828] pt-3 text-xs text-[#b3b3b3]">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-4 w-4 text-[#7c7c7c]" />
            <span>Hasta {space.capacity} {space.capacity === 1 ? "persona" : "personas"}</span>
          </span>
          <div className="text-right">
            <span className="text-sm font-bold text-white">${Number(space.pricePerHour).toFixed(2)}</span>
            <span className="text-[11px] text-[#7c7c7c]"> / hora</span>
          </div>
        </div>

        <Link
          href={`/spaces/${space.id}`}
          className="mt-4 block w-full rounded-full bg-[#1ed760] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
        >
          Ver detalles y reservar
        </Link>
      </div>
    </article>
  );
};

