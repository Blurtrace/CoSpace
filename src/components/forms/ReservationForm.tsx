"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, DollarSign, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SpaceDTO } from "@/types/space";
import { useAuth } from "@/components/shared/AuthContext";

interface ReservationFormProps {
  space: SpaceDTO;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ space }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Fecha actual local en formato YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  // Si hoy ya cerró el horario de reserva (>= 20:00), la fecha por defecto es mañana
  const initialDateStr = useMemo(() => {
    const d = new Date();
    if (d.getHours() >= 20) {
      d.setDate(d.getDate() + 1);
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const [date, setDate] = useState(initialDateStr);

  // Calcula horas de inicio permitidas: si es hoy, excluye horas ya transcurridas
  const allowedStartHours = useMemo(() => {
    const baseHours = Array.from({ length: 14 }, (_, i) => i + 7); // 7..20
    if (date === todayStr) {
      const currentHour = new Date().getHours();
      return baseHours.filter((h) => h > currentHour);
    }
    return baseHours;
  }, [date, todayStr]);

  // Hora inicial por defecto: próxima hora válida
  const [startHour, setStartHour] = useState<number>(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 20) {
      return 9;
    }
    if (currentHour < 7) {
      return 7;
    }
    return currentHour + 1;
  });

  const [duration, setDuration] = useState(2); // 2 horas por defecto
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador del cambio de fecha con actualización automática de hora válida
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const baseHours = Array.from({ length: 14 }, (_, i) => i + 7);
    const validHours = newDate === todayStr
      ? baseHours.filter((h) => h > new Date().getHours())
      : baseHours;

    if (validHours.length > 0 && !validHours.includes(startHour)) {
      setStartHour(validHours[0]);
    }
  };

  // Calcula la hora de finalización
  const endHour = startHour + duration;

  // Calcula el precio total estimado
  const calculatedTotal = Number((duration * space.pricePerHour).toFixed(2));

  // Opciones de duración según la hora de inicio seleccionada (máximo 4 horas, fin <= 21)
  const maxPossibleDuration = Math.min(4, 21 - startHour);
  const allowedDurations = Array.from({ length: Math.max(1, maxPossibleDuration) }, (_, i) => i + 1);

  const hasNoHoursAvailable = date === todayStr && allowedStartHours.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Regla estricta: No se pueden crear reservas sin estar autenticado
    if (!user) {
      router.push(`/login?redirect=/spaces/${space.id}`);
      return;
    }

    if (hasNoHoursAvailable) {
      setError("No quedan horarios disponibles para hoy. Por favor selecciona una fecha posterior.");
      return;
    }

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

  const isFormDisabled = (!user && !authLoading) || isSubmitting || hasNoHoursAvailable;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dddddd] bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-extrabold text-[#222222]">${Number(space.pricePerHour).toFixed(2)}</span>
          <span className="text-xs text-[#6a6a6a]"> / hora</span>
        </div>
        <span className="text-xs font-medium text-[#137333] bg-[#eaf8ee] px-2.5 py-0.5 rounded-full border border-[#c6eccd]">
          Disponible
        </span>
      </div>

      <p className="text-xs text-[#6a6a6a] mb-5">
        Horario de atención: 07:00 a 21:00 en bloques de 1 a 4 horas completas.
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-medium text-[#c13515]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Selector de fecha */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-[#222222] flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#ff385c]" />
            <span>Fecha de reserva</span>
          </label>
          <input
            type="date"
            min={todayStr}
            max={maxDateStr}
            required
            value={date}
            disabled={(!user && !authLoading) || isSubmitting}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full rounded-xl border border-[#dddddd] bg-white px-3.5 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none disabled:bg-[#f7f7f7] disabled:text-[#6a6a6a] disabled:cursor-not-allowed"
          />
        </div>

        {hasNoHoursAvailable ? (
          <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-medium text-[#c13515] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>No quedan horarios disponibles para el día de hoy (horario hasta las 21:00). Selecciona una fecha posterior.</span>
          </div>
        ) : (
          /* Hora de inicio y duración */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-[#222222] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#ff385c]" />
                <span>Hora de inicio</span>
              </label>
              <select
                value={startHour}
                disabled={isFormDisabled}
                onChange={(e) => {
                  const newStart = Number(e.target.value);
                  setStartHour(newStart);
                  if (newStart + duration > 21) {
                    setDuration(Math.max(1, 21 - newStart));
                  }
                }}
                className="w-full rounded-xl border border-[#dddddd] bg-white px-3 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none disabled:bg-[#f7f7f7] disabled:text-[#6a6a6a] disabled:cursor-not-allowed"
              >
                {allowedStartHours.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00 hrs
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-[#222222]">
                Duración
              </label>
              <select
                value={duration}
                disabled={isFormDisabled}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-xl border border-[#dddddd] bg-white px-3 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none disabled:bg-[#f7f7f7] disabled:text-[#6a6a6a] disabled:cursor-not-allowed"
              >
                {allowedDurations.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? "hora" : "horas"} (hasta {String(startHour + d).padStart(2, "0")}:00)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Resumen de cálculo de precio */}
        <div className="mt-4 rounded-xl bg-[#f7f7f7] p-4 text-xs space-y-2 border border-[#ebebeb]">
          <div className="flex justify-between text-[#6a6a6a]">
            <span>Precio por hora:</span>
            <span className="font-medium text-[#222222]">${Number(space.pricePerHour).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#6a6a6a]">
            <span>Horas reservadas:</span>
            <span className="font-medium text-[#222222]">{duration} hrs</span>
          </div>
          <div className="flex justify-between border-t border-[#ebebeb] pt-2 text-sm font-bold text-[#222222]">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-[#ff385c]" />
              <span>Total a pagar:</span>
            </span>
            <span className="text-[#222222] text-base font-extrabold">${calculatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {!authLoading && !user ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-[#dddddd] bg-[#f7f7f7] p-3 text-xs text-[#6a6a6a] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#ff385c] shrink-0" />
            <span>Debes iniciar sesión con tu cuenta para crear una reserva.</span>
          </div>
          <Link
            href={`/login?redirect=/spaces/${space.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff385c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e00b41] hover:shadow focus:outline-none"
          >
            <LogIn className="h-4 w-4" />
            <span>Iniciar sesión para reservar</span>
          </Link>
        </div>
      ) : (
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting || authLoading}
          disabled={hasNoHoursAvailable}
          className="w-full mt-6"
        >
          Confirmar Reserva
        </Button>
      )}
    </form>
  );
};
