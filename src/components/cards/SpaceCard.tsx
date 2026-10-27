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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#ebebeb] bg-white p-3.5 transition-all duration-300 hover:border-[#dddddd] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      {/* Property Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f7f7]">
        <Image
          src={space.imageUrl || defaultImage}
          alt={space.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="neutral" className="bg-white/90 backdrop-blur shadow-sm text-[#222222]">
            {TYPE_LABELS[space.type] || space.type}
          </Badge>
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-1 flex-col justify-between pt-3.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors line-clamp-1">
              {space.name}
            </h3>
          </div>
          {space.description && (
            <p className="mt-1 line-clamp-2 text-xs text-[#6a6a6a] leading-relaxed">
              {space.description}
            </p>
          )}
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-[#ebebeb] pt-3 text-xs text-[#6a6a6a]">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-4 w-4 text-[#929292]" />
            <span>Hasta {space.capacity} {space.capacity === 1 ? "persona" : "personas"}</span>
          </span>
          <div className="text-right">
            <span className="text-sm font-bold text-[#222222]">${Number(space.pricePerHour).toFixed(2)}</span>
            <span className="text-xs text-[#6a6a6a]"> / hora</span>
          </div>
        </div>

        <Link
          href={`/spaces/${space.id}`}
          className="mt-3.5 block w-full rounded-xl bg-[#ff385c] py-2.5 text-center text-xs font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-sm active:scale-[0.98]"
        >
          Ver detalles y reservar
        </Link>
      </div>
    </article>
  );
};
