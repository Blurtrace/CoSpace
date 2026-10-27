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
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <Navbar />
      <div className="bg-[#1f1f1f] border-b border-[#2e2e2e] py-2 px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-xs font-semibold text-[#1ed760]">
          <span>Panel de Administración CoSpace</span>
          <span className="text-[#7c7c7c]">Acceso autorizado</span>
        </div>
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
