"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SpaceDTO } from "@/types/space";

interface ReservationFormProps {
  space: SpaceDTO;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ space }) => {
  const router = useRouter();

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, []);

  const [date, setDate] = useState(todayStr);
  const [startHour, setStartHour] = useState(9); // 09:00 por defecto
  const [duration, setDuration] = useState(2); // 2 horas por defecto
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcula la hora de finalización
  const endHour = startHour + duration;

  // Calcula el precio total estimado
  const calculatedTotal = Number((duration * space.pricePerHour).toFixed(2));

  // Opciones de horas de inicio permitidas (07:00 a 20:00)
  const allowedStartHours = Array.from({ length: 14 }, (_, i) => i + 7);

  // Opciones de duración según la hora de inicio seleccionada (máximo 4 horas, fin <= 21)
  const maxPossibleDuration = Math.min(4, 21 - startHour);
  const allowedDurations = Array.from({ length: maxPossibleDuration }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (endHour > 21) {
        throw new Error("El horario de la reserva no puede extenderse más allá de las 21:00");
      }

      const formattedStartHour = String(startHour).padStart(2, "0");
      const formattedEndHour = String(endHour).padStart(2, "0");

      const startTime = `${date}T${formattedStartHour}:00:00.000Z`;
      const endTime = `${date}T${formattedEndHour}:00:00.000Z`;

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: space.id,
          startTime,
          endTime,
        }),
        credentials: "include",
      });

      const json = await response.json();

      if (response.status === 401) {
        router.push(`/login?redirect=/spaces/${space.id}`);
        return;
      }

      if (!response.ok) {
        throw new Error(json.error?.message || "Error al confirmar la reserva");
      }

      router.push("/dashboard/reservas");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al procesar la reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#282828] bg-[#181818] p-6 shadow-md">
      <h3 className="text-lg font-bold text-white mb-1">Reservar este espacio</h3>
      <p className="text-xs text-[#b3b3b3] mb-5">
        Horario de atención: 07:00 a 21:00 en bloques de 1 a 4 horas completas.
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-md border border-[#f3727f]/30 bg-[#f3727f]/10 p-3 text-xs font-semibold text-[#f3727f]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Selector de fecha */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3] flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#1ed760]" />
            <span>Fecha de reserva</span>
          </label>
          <input
            type="date"
            min={todayStr}
            max={maxDateStr}
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-[#4d4d4d] bg-[#1f1f1f] px-3.5 py-2.5 text-sm text-white focus:border-white focus:outline-none"
          />
        </div>

        {/* Hora de inicio y duración */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#1ed760]" />
              <span>Hora de inicio</span>
            </label>
            <select
              value={startHour}
              onChange={(e) => {
                const newStart = Number(e.target.value);
                setStartHour(newStart);
                if (newStart + duration > 21) {
                  setDuration(Math.max(1, 21 - newStart));
                }
              }}
              className="w-full rounded-md border border-[#4d4d4d] bg-[#1f1f1f] px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none"
            >
              {allowedStartHours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00 hrs
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
              Duración
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border border-[#4d4d4d] bg-[#1f1f1f] px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none"
            >
              {allowedDurations.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "hora" : "horas"} (hasta las {String(startHour + d).padStart(2, "0")}:00)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumen de cálculo de precio */}
        <div className="mt-4 rounded-lg bg-[#222222] p-4 text-xs space-y-2 border border-[#2e2e2e]">
          <div className="flex justify-between text-[#b3b3b3]">
            <span>Precio por hora:</span>
            <span className="font-medium text-white">${Number(space.pricePerHour).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#b3b3b3]">
            <span>Horas reservadas:</span>
            <span className="font-medium text-white">{duration} hrs</span>
          </div>
          <div className="flex justify-between border-t border-[#333333] pt-2 text-sm font-bold text-white">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-[#1ed760]" />
              <span>Total a pagar:</span>
            </span>
            <span className="text-[#1ed760] text-base font-extrabold">${calculatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full mt-6"
      >
        Confirmar Reserva
      </Button>
    </form>
  );
};

