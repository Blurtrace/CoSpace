import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ACCESS_COOKIE_NAME } from "@/lib/cookies";
import { verifyAccessTokenEdge } from "@/lib/auth-edge";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const session = token ? await verifyAccessTokenEdge(token) : null;

  // Si ya tiene sesión activa (con cualquier rol), no permitir acceso a /login ni a /register
  if (session) {
    redirect("/dashboard/reservas");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-full bg-[#1ed760] flex items-center justify-center font-black text-black text-sm transition-transform group-hover:scale-105">
            CS
          </div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#1ed760] transition-colors">
            CoSpace
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[#282828] bg-[#181818] p-8 shadow-[rgba(0,0,0,0.5)_0px_8px_24px]">
        {children}
      </div>

      <div className="mt-8 text-center text-xs text-[#7c7c7c]">
        <Link href="/" className="hover:text-white transition-colors">
          &larr; Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
