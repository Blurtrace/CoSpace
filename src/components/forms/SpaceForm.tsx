"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SpaceType } from "@/types/space";

export const SpaceForm: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SpaceType>("desk");
  const [pricePerHour, setPricePerHour] = useState<number>(20);
  const [capacity, setCapacity] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        name,
        description: description || null,
        type,
        pricePerHour: Number(pricePerHour),
        capacity: Number(capacity),
        imageUrl: imageUrl || null,
        isActive: true,
      };

      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "Error al crear el espacio");
      }

      router.push("/admin/spaces");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-[#dddddd] shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-[#222222]">Nuevo Espacio de Coworking</h2>
        <p className="text-xs text-[#6a6a6a] mt-1">Completa los datos para publicar un nuevo puesto u oficina en el catálogo.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-semibold text-[#c13515]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Nombre del Espacio"
          required
          placeholder="Ej: Sala Innovación A"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-[#222222]">
            Descripción
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Características, servicios incluidos y comodidades..."
            className="w-full rounded-xl border border-[#dddddd] bg-white p-3 text-sm text-[#222222] placeholder-[#929292] focus:border-[#222222] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#222222]">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SpaceType)}
              className="w-full rounded-xl border border-[#dddddd] bg-white px-3 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
            >
              <option value="desk">Puesto Flexible (Desk)</option>
              <option value="meeting_room">Sala de Juntas</option>
              <option value="private_office">Oficina Privada</option>
            </select>
          </div>

          <Input
            label="Precio por Hora ($)"
            type="number"
            min={1}
            step={0.5}
            required
            value={pricePerHour}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />

          <Input
            label="Capacidad (Personas)"
            type="number"
            min={1}
            max={100}
            required
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        <Input
          label="URL de la Imagen (Unsplash o Supabase)"
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          helperText="Imagen representativa para el catálogo y la vista de detalle."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebebeb]">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          Guardar Espacio
        </Button>
      </div>
    </form>
  );
};
