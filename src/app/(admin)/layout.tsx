import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME } from "@/lib/cookies";
import { verifyAccessTokenEdge } from "@/lib/auth-edge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const session = token ? await verifyAccessTokenEdge(token) : null;

  if (!session) {
    redirect("/login?redirect=/admin/spaces");
  }

  if (session.role !== "admin") {
    redirect("/dashboard/reservas");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#222222]">
      <Navbar />
      <div className="bg-[#fff1f3] border-b border-[#ffd1da] py-2 px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-xs font-semibold text-[#ff385c]">
          <span>Panel de Administración CoSpace</span>
          <span className="text-[#6a6a6a]">Acceso autorizado</span>
        </div>
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
