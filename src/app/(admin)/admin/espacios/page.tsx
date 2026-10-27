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
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#282828]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t("admin.title")}</h1>
          <p className="text-sm text-[#b3b3b3] mt-1">
            {t("admin.subtitle")}
          </p>
        </div>
        <Link
          href="/admin/espacios/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-[#1ed760] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("admin.newSpace")}</span>
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
          <p>Cargando catálogo...</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-[#282828] bg-[#181818]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#b3b3b3]">
              <thead className="border-b border-[#282828] bg-[#1f1f1f] text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">{t("admin.spaceCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.typeCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.capacityCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.rateCol")}</th>
                  <th scope="col" className="px-6 py-4">{t("admin.statusCol")}</th>
                  <th scope="col" className="px-6 py-4 text-right">{t("admin.actionsCol")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-[#202020] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{space.name}</div>
                      {space.description && (
                        <div className="text-xs text-[#7c7c7c] line-clamp-1 max-w-xs">{space.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">{space.type.replace("_", " ")}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#7c7c7c]" />
                        {space.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-[#1ed760]" />
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
                          className="hover:border-[#f3727f] hover:text-[#f3727f]"
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
          <p className="text-sm text-[#cbcbcb]">
            {t("admin.deactivatePrompt")}
          </p>

          <p className="text-xs text-[#b3b3b3] bg-[#222222] p-3 rounded-lg border border-[#333333]">
            {t("admin.deactivateNotice")}
          </p>

          {deactivateError && (
            <div className="rounded-md border border-[#f3727f]/30 bg-[#f3727f]/10 p-3 text-xs font-semibold text-[#f3727f]">
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

