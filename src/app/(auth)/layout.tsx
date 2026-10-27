import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/gemini-svg.svg"
            alt="CoSpace"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-2xl font-extrabold tracking-tight text-[#ff385c] transition-colors">
            CoSpace
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[#dddddd] bg-white p-8 shadow-[rgba(0,0,0,0.06)_0px_8px_24px]">
        {children}
      </div>

      <div className="mt-8 text-center text-xs text-[#6a6a6a]">
        <Link href="/" className="hover:text-[#222222] transition-colors">
          &larr; Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
