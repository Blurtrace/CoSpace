import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-[#b3b3b3]">Cargando formulario...</div>}>
      <LoginForm />
    </Suspense>
  );
}

