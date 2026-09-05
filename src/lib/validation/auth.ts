import { z } from "zod";

export const ageBandSchema = z.enum(["under_13", "age_13_17", "adult"]);
export const gradeBandSchema = z.enum([
  "k_2",
  "grade_3_5",
  "grade_6_8",
  "grade_9_12",
  "college",
  "adult",
  "other",
]);

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .regex(/[A-Za-z]/, "Password must contain a letter.")
  .regex(/[0-9]/, "Password must contain a number.");

export const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const governedProfileFields = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(80),
  lastInitial: z
    .string()
    .trim()
    .regex(/^[A-Za-z]$/, "Enter one letter.")
    .transform((value) => value.toUpperCase()),
  ageBand: ageBandSchema,
  schoolId: z.uuid("Select a valid school.").optional().or(z.literal("")),
  gradeBand: gradeBandSchema.optional(),
});

function validateGovernedProfile(
  value: z.infer<typeof governedProfileFields>,
  context: z.RefinementCtx,
) {
  if (value.ageBand !== "adult" && !value.schoolId) {
    context.addIssue({
      code: "custom",
      path: ["schoolId"],
      message: "Select your school.",
    });
  }
  if (value.ageBand !== "adult" && !value.gradeBand) {
    context.addIssue({
      code: "custom",
      path: ["gradeBand"],
      message: "Select your grade band.",
    });
  }
}

export const signUpSchema = governedProfileFields
  .extend({
    email: z.email("Enter a valid email address."),
    password: passwordSchema,
  })
  .superRefine(validateGovernedProfile);

export const completeProfileSchema = governedProfileFields.superRefine(
  validateGovernedProfile,
);
export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const profileSettingsSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastInitial: z
      .string()
      .trim()
      .regex(/^[A-Za-z]$/, "Enter one letter.")
      .transform((value) => value.toUpperCase()),
    displayFormat: z.enum([
      "first_name_last_initial",
      "first_name_only",
      "custom",
    ]),
    customDisplayName: z.string().trim().max(80).optional(),
    gradeBand: gradeBandSchema.optional(),
    showAvatarToClubMembers: z.boolean(),
    showSchoolToClubMembers: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.displayFormat === "custom" && !value.customDisplayName?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["customDisplayName"],
        message: "Enter a public display name.",
      });
    }
  });

export type SignInInput = z.input<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;
export type CompleteProfileInput = z.input<typeof completeProfileSchema>;
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>;
export type ProfileSettingsInput = z.input<typeof profileSettingsSchema>;
