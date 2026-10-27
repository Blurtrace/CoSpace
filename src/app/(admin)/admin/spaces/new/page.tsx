import { redirect } from "next/navigation";

export default function AdminNewSpaceRedirect() {
  redirect("/admin/espacios/nuevo");
}
