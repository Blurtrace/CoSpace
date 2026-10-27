import { ValueTransformer } from "typeorm";

export const numericTransformer: ValueTransformer = {
  to: (value: number | null | undefined): number | null | undefined => value,
  from: (value: string | number | null | undefined): number | null => {
    if (value === null || value === undefined) {
      return null;
    }
    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return Number.isNaN(parsed) ? null : parsed;
  },
};

