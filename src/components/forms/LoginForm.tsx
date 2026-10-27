"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/reservas";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message || "Error al iniciar sesión");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#222222]">Iniciar Sesión</h1>
        <p className="text-xs text-[#6a6a6a]">Ingresa tus credenciales para acceder a CoSpace</p>
      </div>

      {error && (
        <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-semibold text-[#c13515]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        Entrar
      </Button>

      <div className="border-t border-[#ebebeb] pt-4 text-center text-xs text-[#6a6a6a]">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="font-semibold text-[#222222] hover:text-[#ff385c]">
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
};
