"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Power, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/components/shared/LanguageContext";
import { SpaceDTO } from "@/types/space";

export default function AdminEspaciosPage() {
  const { t } = useTranslation();
  const [spaces, setSpaces] = useState<SpaceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal para desactivar
  const [deactivatingSpace, setDeactivatingSpace] = useState<SpaceDTO | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/spaces", { credentials: "include" });
      if (!res.ok) {
        throw new Error("No fue posible cargar el catálogo");
      }
      const json = await res.json();
      setSpaces(json.data.spaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar espacios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleOpenDeactivateModal = (space: SpaceDTO) => {
    setDeactivatingSpace(space);
    setDeactivateError(null);
  };

  const handleCloseDeactivateModal = () => {
    setDeactivatingSpace(null);
    setDeactivateError(null);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivatingSpace) return;

    try {
      setIsDeactivating(true);
      setDeactivateError(null);

      const res = await fetch(`/api/spaces/${deactivatingSpace.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || "No se pudo desactivar el espacio");
      }

      setSpaces((prev) =>
        prev.map((s) => (s.id === deactivatingSpace.id ? { ...s, isActive: false } : s))
      );

      handleCloseDeactivateModal();
    } catch (err) {
      setDeactivateError(err instanceof Error ? err.message : "Error al desactivar");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#ebebeb]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#222222]">{t("admin.title")}</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">
            {t("admin.subtitle")}
          </p>
        </div>
        <Link
          href="/admin/espacios/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff385c] px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#e00b41] hover:shadow-sm active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("admin.newSpace")}</span>
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
          <p>Cargando catálogo...</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#ebebeb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#3f3f3f]">
              <thead className="border-b border-[#ebebeb] bg-[#f7f7f7] text-xs font-bold uppercase tracking-wider text-[#222222]">
                <tr>
                  <th scope="col" className="px-6 py-4">{t("admin.spaceCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.typeCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.capacityCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.rateCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.statusCol")}</th>
                  <th scope="col" className="px-6 py-4 text-right">{t("admin.actionsCol")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#222222]">{space.name}</div>
                      {space.description && (
                        <div className="text-xs text-[#6a6a6a] line-clamp-1 max-w-xs">{space.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">{space.type.replace("_", " ")}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#929292]" />
                        {space.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#222222]">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-[#ff385c]" />
                        ${Number(space.pricePerHour).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={space.isActive ? "success" : "danger"}>
                        {space.isActive ? t("admin.active") : t("admin.inactive")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {space.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDeactivateModal(space)}
                          className="hover:border-[#c13515] hover:text-[#c13515]"
                        >
                          <Power className="h-3.5 w-3.5 mr-1" />
                          {t("admin.deactivate")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Desactivar Espacio */}
      <Modal
        isOpen={!!deactivatingSpace}
        onClose={handleCloseDeactivateModal}
        title={t("admin.deactivateTitle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#3f3f3f]">
            {t("admin.deactivatePrompt")}
          </p>

          <p className="text-xs text-[#6a6a6a] bg-[#f7f7f7] p-3 rounded-xl border border-[#ebebeb]">
            {t("admin.deactivateNotice")}
          </p>

          {deactivateError && (
            <div className="rounded-xl border border-[#ffd1da] bg-[#fff0f2] p-3 text-xs font-semibold text-[#c13515]">
              {deactivateError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseDeactivateModal}
              disabled={isDeactivating}
            >
              {t("admin.cancel")}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDeactivate}
              isLoading={isDeactivating}
            >
              {t("admin.deactivateConfirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
