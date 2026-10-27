import Link from "next/link";
import Image from "next/image";
import { Search, Users } from "lucide-react";
import { HomeHeroActions } from "@/components/home/HomeHeroActions";

export default function HomePage() {
  const categoryHighlights = [
    {
      title: "Puestos Flexibles",
      type: "desk",
      description: "Puestos individuales ergonómicos en áreas abiertas con conexión de alta velocidad.",
      capacity: "1 persona",
      price: "$15.00",
      image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
      href: "/spaces?type=desk",
    },
    {
      title: "Salas de Juntas",
      type: "meeting_room",
      description: "Salas ejecutivas equipadas con pantalla 4K, proyector y sistema de videoconferencia.",
      capacity: "Hasta 8 personas",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      href: "/spaces?type=meeting_room",
    },
    {
      title: "Oficinas Privadas",
      type: "private_office",
      description: "Espacios cerrados y seguros diseñados para concentración y trabajo en equipo confidencial.",
      capacity: "Hasta 6 personas",
      price: "$50.00",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      href: "/spaces?type=private_office",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center px-6 py-12 md:py-16 text-center">
      {/* Hero Section */}
      <div className="max-w-4xl space-y-6">
        <span className="inline-block rounded-full bg-[#fff1f3] px-4 py-1.5 text-xs font-semibold tracking-wider text-[#ff385c] border border-[#ffd1da]">
          Plataforma de Coworking CoSpace
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-[#222222] sm:text-6xl">
          Espacios de trabajo diseñados para la productividad
        </h1>

        <p className="text-base text-[#6a6a6a] sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Reserva puestos individuales, salas de reuniones ejecutivas y oficinas privadas de forma flexible e instantánea.
        </p>

        {/* Barra de Búsqueda Estilo Airbnb Pill */}
        <div className="pt-2">
          <Link
            href="/spaces"
            className="group mx-auto flex max-w-2xl items-center justify-between rounded-full border border-[#dddddd] bg-white p-2 pl-6 shadow-[0_3px_12px_rgba(0,0,0,0.08)] transition-all hover:border-[#c1c1c1] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] text-left"
          >
            <div className="grid grid-cols-3 divide-x divide-[#ebebeb] flex-1 text-xs">
              <div className="pr-4">
                <span className="block font-bold text-[#222222]">Espacio</span>
                <span className="block text-[#6a6a6a] truncate">Todos los tipos</span>
              </div>
              <div className="px-4">
                <span className="block font-bold text-[#222222]">Horarios</span>
                <span className="block text-[#6a6a6a] truncate">07:00 a 21:00</span>
              </div>
              <div className="pl-4">
                <span className="block font-bold text-[#222222]">Capacidad</span>
                <span className="block text-[#6a6a6a] truncate">1 a 12 personas</span>
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white transition-transform group-hover:scale-105 active:scale-95 shadow-sm">
              <Search className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Botones de acción principales condicionados a la sesión real */}
        <HomeHeroActions />
      </div>

      {/* Sección de Tarjetas de Espacios Destacados */}
      <section className="mt-20 max-w-6xl w-full text-left">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#222222] sm:text-3xl">
            Explora por tipo de espacio
          </h2>
          <p className="mt-1 text-sm text-[#6a6a6a]">
            Espacios adaptados al ritmo de trabajo y tamaño de tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryHighlights.map((cat) => (
            <Link
              key={cat.type}
              href={cat.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#ebebeb] bg-white p-3.5 transition-all duration-300 hover:border-[#dddddd] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f7f7]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between pt-3.5">
                <div>
                  <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#6a6a6a] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-[#ebebeb] pt-3 text-xs text-[#6a6a6a]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="h-4 w-4 text-[#929292]" />
                    <span>{cat.capacity}</span>
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#222222]">Desde {cat.price}</span>
                    <span className="text-xs text-[#6a6a6a]"> / hora</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
