import { describe, expect, it } from "vitest";

import {
  profileSettingsSchema,
  resetPasswordSchema,
  signUpSchema,
} from "@/lib/validation/auth";

describe("authentication validation", () => {
  const validSignup = {
    email: "student@example.test",
    password: "securepass123",
    firstName: "Avery",
    lastInitial: "s",
    ageBand: "age_13_17" as const,
    schoolId: "10000000-0000-4000-8000-000000000001",
    gradeBand: "grade_9_12" as const,
  };

  it("accepts governed signup data and normalizes the last initial", () => {
    const result = signUpSchema.parse(validSignup);
    expect(result.lastInitial).toBe("S");
  });

  it("does not request or accept a date of birth field", () => {
    expect(
      signUpSchema.safeParse({ ...validSignup, dateOfBirth: "2010-01-01" })
        .success,
    ).toBe(true);
    expect("dateOfBirth" in signUpSchema.parse(validSignup)).toBe(false);
  });

  it("requires a school and grade band for non-adults", () => {
    const result = signUpSchema.safeParse({
      ...validSignup,
      schoolId: "",
      gradeBand: undefined,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        schoolId: ["Select your school."],
        gradeBand: ["Select your grade band."],
      });
    }
  });

  it("enforces password length and composition", () => {
    expect(
      signUpSchema.safeParse({ ...validSignup, password: "short" }).success,
    ).toBe(false);
    expect(
      signUpSchema.safeParse({
        ...validSignup,
        password: "letterswithoutdigits",
      }).success,
    ).toBe(false);
  });

  it("requires matching reset passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "securepass123",
        confirmPassword: "differentpass456",
      }).success,
    ).toBe(false);
  });

  it("requires a custom public name only for custom display format", () => {
    const result = profileSettingsSchema.safeParse({
      firstName: "Avery",
      lastInitial: "S",
      displayFormat: "custom",
      customDisplayName: "",
      showAvatarToClubMembers: false,
      showSchoolToClubMembers: false,
    });
    expect(result.success).toBe(false);
  });
});
