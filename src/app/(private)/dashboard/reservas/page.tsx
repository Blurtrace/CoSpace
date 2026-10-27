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
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#ebebeb]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#222222]">{t("dashboard.title")}</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff385c] px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-sm active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("dashboard.newReservation")}</span>
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-4 text-sm font-semibold text-[#c13515]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#6a6a6a]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#ff385c] border-t-transparent mb-3" />
          <p>Cargando tus reservas...</p>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {/* Sección de Reservas Próximas */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#222222]">{t("dashboard.upcoming")}</h2>
              <span className="text-xs font-semibold text-[#ff385c] bg-[#fff1f3] border border-[#ffd1da] px-3 py-1 rounded-full">
                {t("dashboard.maxNotice", { count: upcomingReservations.length })}
              </span>
            </div>

            {upcomingReservations.length === 0 ? (
              <div className="rounded-2xl border border-[#ebebeb] bg-[#f7f7f7] p-8 text-center text-[#6a6a6a]">
                <CalendarX className="mx-auto h-8 w-8 text-[#929292] mb-2" />
                <p className="text-sm font-bold text-[#222222]">{t("dashboard.empty")}</p>
                <p className="text-xs text-[#6a6a6a] mt-1 mb-4">{t("dashboard.emptyDesc")}</p>
                <Link
                  href="/spaces"
                  className="inline-block rounded-xl border border-[#dddddd] bg-white px-5 py-2 text-xs font-semibold text-[#222222] hover:border-[#222222] transition-colors"
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
            <section className="space-y-4 border-t border-[#ebebeb] pt-8">
              <h2 className="text-lg font-bold text-[#6a6a6a]">{t("dashboard.history")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
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
          <p className="text-sm text-[#3f3f3f]">
            {t("dashboard.cancelPrompt")}
          </p>

          <p className="text-xs text-[#6a6a6a] bg-[#f7f7f7] p-3 rounded-xl border border-[#ebebeb]">
            {t("dashboard.cancelRuleNotice")}
          </p>

          {cancelError && (
            <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-semibold text-[#c13515]">
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
