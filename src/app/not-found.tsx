import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#222222]">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex justify-center">
            <span className="rounded-full bg-[#fff1f3] px-4 py-1.5 text-xs font-semibold tracking-wider text-[#ff385c] border border-[#ffd1da]">
              Error 404
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222]">
            Página no encontrada
          </h1>

          <p className="text-sm text-[#6a6a6a] leading-relaxed max-w-sm mx-auto">
            La página que estás buscando no existe, ha sido movida o la dirección ingresada no es correcta.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-md active:scale-95"
            >
              <Home className="h-4 w-4" />
              <span>Volver al Home</span>
            </Link>

            <Link
              href="/spaces"
              className="inline-flex items-center gap-2 rounded-full border border-[#dddddd] bg-white px-6 py-3 text-sm font-semibold text-[#222222] transition-colors hover:border-[#222222] hover:bg-[#f7f7f7]"
            >
              <Compass className="h-4 w-4" />
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

