import Link from "next/link";
import { Clock, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-6">
        <span className="inline-block rounded-full bg-[#1f1f1f] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1ed760] border border-[#2e2e2e]">
          Plataforma de Coworking CoSpace
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Espacios de trabajo diseñados para la productividad
        </h1>

        <p className="text-base text-[#b3b3b3] sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Reserva puestos individuales, salas de reuniones ejecutivas y oficinas privadas de forma flexible e instantánea.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/spaces"
            className="inline-flex items-center gap-2 rounded-full bg-[#1ed760] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-lg hover:bg-[#1fdf64]"
          >
            <span>Explorar Espacios</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-[#7c7c7c] bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/5"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>

      {/* Grid de Características según Reglas de Negocio */}
      <section className="mt-20 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="rounded-xl border border-[#282828] bg-[#181818] p-6 space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#1ed760]">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Horarios Flexibles</h3>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Reserva en bloques de 1 a 4 horas completas dentro del horario de atención permitido de 07:00 a 21:00.
          </p>
        </div>

        <div className="rounded-xl border border-[#282828] bg-[#181818] p-6 space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#1ed760]">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Confirmación Inmediata</h3>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Precios transparentes calculados por el servidor sin intermediarios. Cancela con hasta 2 horas de anticipación.
          </p>
        </div>

        <div className="rounded-xl border border-[#282828] bg-[#181818] p-6 space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-[#1ed760]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Control de Concurrencia</h3>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Garantía técnica de que ningún espacio ni usuario presente solapamiento de horarios en la base de datos.
          </p>
        </div>
      </section>
    </main>
  );
}
