import { z } from "zod";

import { DASHBOARD_MODULE_IDS } from "@/features/dashboard-config/registry";

export const editableScopeSchema = z.enum(["global", "school", "club"]);

export const upsertModuleConfigSchema = z
  .object({
    moduleId: z.enum(DASHBOARD_MODULE_IDS),
    scopeType: editableScopeSchema,
    schoolId: z.string().uuid().optional().nullable(),
    clubId: z.string().uuid().optional().nullable(),
    enabled: z.boolean(),
    forRole: z.string().trim().min(1).max(64).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.scopeType === "school" && !value.schoolId) {
      ctx.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "Choose a school to override global defaults.",
      });
    }
    if (value.scopeType === "club" && !value.clubId) {
      ctx.addIssue({
        code: "custom",
        path: ["clubId"],
        message: "Choose a club to override global and school defaults.",
      });
    }
  });

export const reorderModulesSchema = z
  .object({
    scopeType: editableScopeSchema,
    schoolId: z.string().uuid().optional().nullable(),
    clubId: z.string().uuid().optional().nullable(),
    orderedModuleIds: z.array(z.enum(DASHBOARD_MODULE_IDS)).min(1).max(80),
  })
  .superRefine((value, ctx) => {
    if (value.scopeType === "school" && !value.schoolId) {
      ctx.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "Choose a school to reorder its override.",
      });
    }
    if (value.scopeType === "club" && !value.clubId) {
      ctx.addIssue({
        code: "custom",
        path: ["clubId"],
        message: "Choose a club to reorder its override.",
      });
    }
    const unique = new Set(value.orderedModuleIds);
    if (unique.size !== value.orderedModuleIds.length) {
      ctx.addIssue({
        code: "custom",
        path: ["orderedModuleIds"],
        message: "Module order cannot contain duplicates.",
      });
    }
  });

export type UpsertModuleConfigInput = z.infer<typeof upsertModuleConfigSchema>;
export type ReorderModulesInput = z.infer<typeof reorderModulesSchema>;
