import { z } from "zod";

export const commandPaletteQuerySchema = z.object({
  query: z.string().trim().max(120).default(""),
  limit: z.number().int().min(1).max(40).default(24),
});

export type CommandPaletteQuery = z.infer<typeof commandPaletteQuerySchema>;

export type CommandPaletteResult = {
  id: string;
  group: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  rank: number;
};
