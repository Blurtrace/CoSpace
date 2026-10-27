"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message || "Error al crear la cuenta");
      }

      router.push("/dashboard/reservas");
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
        <h1 className="text-2xl font-bold tracking-tight text-[#222222]">Crear Cuenta</h1>
        <p className="text-xs text-[#6a6a6a]">Regístrate para comenzar a reservar tus espacios</p>
      </div>

      {error && (
        <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-semibold text-[#c13515]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Nombre Completo"
          type="text"
          name="name"
          autoComplete="name"
          required
          placeholder="Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          label="Contraseña (mínimo 6 caracteres)"
          type="password"
          name="password"
          autoComplete="new-password"
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
        Registrarse
      </Button>

      <div className="border-t border-[#ebebeb] pt-4 text-center text-xs text-[#6a6a6a]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[#222222] hover:text-[#ff385c]">
          Inicia sesión aquí
        </Link>
      </div>
    </form>
  );
};
