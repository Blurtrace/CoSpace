"use client";

import React from "react";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ClientDate } from "@/components/shared/ClientDate";
import { ReservationStatus } from "@/types/reservation";

export interface ReservationWithSpace {
  id: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  space?: {
    id: string;
    name: string;
    type: string;
  };
}

interface ReservationCardProps {
  reservation: ReservationWithSpace;
  onCancelClick?: (reservationId: string) => void;
  isCancelling?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancelClick,
  isCancelling = false,
}) => {
  const isConfirmed = reservation.status === "confirmed";
  const startDate = new Date(reservation.startTime);
  const now = new Date();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const isCancellable = isConfirmed && startDate.getTime() - now.getTime() >= twoHoursMs;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#282828] bg-[#181818] p-5 shadow-sm transition-all hover:border-[#383838]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#1ed760] uppercase tracking-wider">
            {reservation.space?.type ? reservation.space.type.replace("_", " ") : "Espacio"}
          </span>
          <h4 className="text-lg font-bold text-white mt-0.5">
            {reservation.space?.name || "Espacio CoSpace"}
          </h4>
        </div>
        <Badge variant={isConfirmed ? "success" : "danger"}>
          {isConfirmed ? "Confirmada" : "Cancelada"}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-[#b3b3b3] border-t border-[#282828] pt-3 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#7c7c7c]" />
          <span>Inicio: <ClientDate date={reservation.startTime} format="datetime" className="font-medium text-white" /></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#7c7c7c]" />
          <span>Fin: <ClientDate date={reservation.endTime} format="datetime" className="font-medium text-white" /></span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#282828] pt-3">
        <div className="flex items-center gap-1 text-sm font-bold text-white">
          <DollarSign className="h-4 w-4 text-[#1ed760]" />
          <span>Total: ${Number(reservation.totalPrice).toFixed(2)}</span>
        </div>

        {isConfirmed && onCancelClick && (
          <div>
            {isCancellable ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelClick(reservation.id)}
                isLoading={isCancelling}
                className="hover:border-[#f3727f] hover:text-[#f3727f]"
              >
                Cancelar
              </Button>
            ) : (
              <span className="text-[11px] text-[#7c7c7c] italic">
                {startDate.getTime() <= now.getTime()
                  ? "Reserva finalizada o en curso"
                  : "No cancelable (< 2 horas)"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

