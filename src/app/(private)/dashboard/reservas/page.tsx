"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, CalendarX } from "lucide-react";
import { ReservationCard, ReservationWithSpace } from "@/components/cards/ReservationCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/components/shared/LanguageContext";

export default function ReservasDashboardPage() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<ReservationWithSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del modal de cancelación
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/reservations", { credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/login?redirect=/dashboard/reservas";
        return;
      }
      if (!res.ok) {
        throw new Error("No fue posible cargar tus reservas");
      }
      const json = await res.json();
      setReservations(json.data.reservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenCancelModal = (id: string) => {
    setCancellingId(id);
    setCancelError(null);
  };

  const handleCloseCancelModal = () => {
    setCancellingId(null);
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;

    try {
      setIsSubmittingCancel(true);
      setCancelError(null);

      const res = await fetch(`/api/reservations/${cancellingId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "No fue posible cancelar la reserva");
      }

      setReservations((prev) =>
        prev.map((r) => (r.id === cancellingId ? { ...r, status: "cancelled" } : r))
      );

      handleCloseCancelModal();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Error al cancelar");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const now = new Date();
  const upcomingReservations = reservations.filter(
    (r) => r.status === "confirmed" && new Date(r.endTime).getTime() > now.getTime()
  );
  const pastOrCancelledReservations = reservations.filter(
    (r) => r.status === "cancelled" || new Date(r.endTime).getTime() <= now.getTime()
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#282828]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t("dashboard.title")}</h1>
          <p className="text-sm text-[#b3b3b3] mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 rounded-full bg-[#1ed760] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("dashboard.newReservation")}</span>
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-[#f3727f]/30 bg-[#f3727f]/10 p-4 text-sm font-semibold text-[#f3727f]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#b3b3b3]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#1ed760] border-t-transparent mb-3" />
          <p>Cargando tus reservas...</p>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {/* Sección de Reservas Próximas */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{t("dashboard.upcoming")}</h2>
              <span className="text-xs font-semibold text-[#1ed760] bg-[#1ed760]/10 px-3 py-1 rounded-full">
                {t("dashboard.maxNotice", { count: upcomingReservations.length })}
              </span>
            </div>

            {upcomingReservations.length === 0 ? (
              <div className="rounded-xl border border-[#282828] bg-[#181818] p-8 text-center text-[#b3b3b3]">
                <CalendarX className="mx-auto h-8 w-8 text-[#7c7c7c] mb-2" />
                <p className="text-sm font-bold text-white">{t("dashboard.empty")}</p>
                <p className="text-xs text-[#7c7c7c] mt-1 mb-4">{t("dashboard.emptyDesc")}</p>
                <Link
                  href="/spaces"
                  className="inline-block rounded-full border border-[#7c7c7c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:border-white transition-colors"
                >
                  {t("dashboard.exploreBtn")}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancelClick={handleOpenCancelModal}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sección de Historial */}
          {pastOrCancelledReservations.length > 0 && (
            <section className="space-y-4 border-t border-[#282828] pt-8">
              <h2 className="text-lg font-bold text-[#b3b3b3]">{t("dashboard.history")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
                {pastOrCancelledReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Modal de Confirmación de Cancelación */}
      <Modal
        isOpen={!!cancellingId}
        onClose={handleCloseCancelModal}
        title={t("dashboard.cancelTitle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#cbcbcb]">
            {t("dashboard.cancelPrompt")}
          </p>

          <p className="text-xs text-[#b3b3b3] bg-[#222222] p-3 rounded-lg border border-[#333333]">
            {t("dashboard.cancelRuleNotice")}
          </p>

          {cancelError && (
            <div className="rounded-md border border-[#f3727f]/30 bg-[#f3727f]/10 p-3 text-xs font-semibold text-[#f3727f]">
              {cancelError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseCancelModal}
              disabled={isSubmittingCancel}
            >
              {t("dashboard.cancelBackBtn")}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
              isLoading={isSubmittingCancel}
            >
              {t("dashboard.cancelConfirmBtn")}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

