"use client";

import React, { useState, useEffect } from "react";

export interface ClientDateProps {
  date: string | Date;
  format?: "full" | "date" | "time" | "datetime";
  className?: string;
}

export const ClientDate: React.FC<ClientDateProps> = ({
  date,
  format = "datetime",
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!mounted) {
    // Renderizado seguro en servidor para evitar error de hidratación
    return (
      <time dateTime={dateObj.toISOString()} className={className}>
        {dateObj.toISOString().replace("T", " ").slice(0, 16)}
      </time>
    );
  }

  let formatted = "";
  if (format === "date") {
    formatted = dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else if (format === "time") {
    formatted = dateObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (format === "datetime") {
    formatted = dateObj.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    formatted = dateObj.toLocaleString("es-ES");
  }

  return (
    <time dateTime={dateObj.toISOString()} className={className}>
      {formatted}
    </time>
  );
};

