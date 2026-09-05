"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  useWatch,
  type FieldErrors,
  type UseFormRegisterReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  completeOAuthProfileAction,
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
} from "@/features/auth/actions";
import {
  completeProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type CompleteProfileInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validation/auth";

export type SchoolOption = {
  id: string;
  name: string;
  location: string;
};

function Field({
  error,
  label,
  registration,
  type = "text",
  autoComplete,
}: {
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
  type?: "email" | "password" | "text";
  autoComplete?: string;
}) {
  const errorId = `${registration.name}-error`;
  return (
    <div>
      <label
        htmlFor={registration.name}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>
      <input
        {...registration}
        id={registration.name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="bg-surface min-h-11 w-full rounded-md border px-3 py-2 text-base shadow-sm sm:text-sm"
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FormMessage({
  message,
  success = false,
}: {
  message?: string;
  success?: boolean;
}) {
  if (!message) return null;
  return (
    <p
      role={success ? "status" : "alert"}
      className={
        success
          ? "border-primary text-foreground border-l-2 pl-3 text-sm"
          : "border-l-2 border-red-700 pl-3 text-sm text-red-800"
      }
    >
      {message}
    </p>
  );
}

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(input: SignInInput) {
    setMessage(undefined);
    const result = await signInAction(input);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    router.replace(result.data.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          registration={form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          registration={form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <FormMessage message={message} />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {googleEnabled ? (
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/google">Continue with Google</Link>
        </Button>
      ) : null}

      <div className="flex flex-wrap justify-between gap-3 text-sm">
        <Link
          href="/forgot-password"
          className="text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
        <Link
          href="/sign-up"
          className="text-primary underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

type ProfileRegistrations = {
  firstName: UseFormRegisterReturn;
  lastInitial: UseFormRegisterReturn;
  ageBand: UseFormRegisterReturn;
  schoolId: UseFormRegisterReturn;
  gradeBand: UseFormRegisterReturn;
};

function ProfileFields({
  registrations,
  errors,
  schools,
  ageBand,
}: {
  registrations: ProfileRegistrations;
  errors: FieldErrors<CompleteProfileInput>;
  schools: SchoolOption[];
  ageBand?: string;
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <Field
          label="First name"
          autoComplete="given-name"
          registration={registrations.firstName}
          error={errors.firstName?.message}
        />
        <Field
          label="Last initial"
          autoComplete="family-name"
          registration={registrations.lastInitial}
          error={errors.lastInitial?.message}
        />
      </div>

      <div>
        <label
          htmlFor={registrations.ageBand.name}
          className="mb-2 block text-sm font-medium"
        >
          Age band
        </label>
        <select
          {...registrations.ageBand}
          id={registrations.ageBand.name}
          className="bg-surface min-h-11 w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Select an age band</option>
          <option value="under_13">Under 13</option>
          <option value="age_13_17">Age 13–17</option>
          <option value="adult">Adult</option>
        </select>
        {errors.ageBand?.message ? (
          <p className="mt-1.5 text-sm text-red-700">
            {errors.ageBand.message}
          </p>
        ) : null}
      </div>

      {ageBand === "under_13" ? (
        <p className="border-l-2 border-amber-600 pl-3 text-sm leading-6">
          Under-13 accounts cannot self-register. A verified guardian or an
          authorized school administrator must initiate and approve onboarding.
          Institutional configuration and legal review are required.
        </p>
      ) : null}

      {ageBand !== "adult" ? (
        <>
          <div>
            <label
              htmlFor={registrations.schoolId.name}
              className="mb-2 block text-sm font-medium"
            >
              School
            </label>
            <select
              {...registrations.schoolId}
              id={registrations.schoolId.name}
              className="bg-surface min-h-11 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} — {school.location}
                </option>
              ))}
            </select>
            {errors.schoolId?.message ? (
              <p className="mt-1.5 text-sm text-red-700">
                {errors.schoolId.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={registrations.gradeBand.name}
              className="mb-2 block text-sm font-medium"
            >
              Grade band
            </label>
            <select
              {...registrations.gradeBand}
              id={registrations.gradeBand.name}
              className="bg-surface min-h-11 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select a grade band</option>
              <option value="k_2">K–2</option>
              <option value="grade_3_5">Grades 3–5</option>
              <option value="grade_6_8">Grades 6–8</option>
              <option value="grade_9_12">Grades 9–12</option>
              <option value="college">College</option>
              <option value="other">Other</option>
            </select>
            {errors.gradeBand?.message ? (
              <p className="mt-1.5 text-sm text-red-700">
                {errors.gradeBand.message}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}

export function SignUpForm({ schools }: { schools: SchoolOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastInitial: "",
      ageBand: undefined,
      schoolId: "",
      gradeBand: undefined,
    },
  });
  const ageBand = useWatch({ control: form.control, name: "ageBand" });

  async function onSubmit(input: SignUpInput) {
    setMessage(undefined);
    const result = await signUpAction(input);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    router.push(result.data.redirectTo ?? "/verify-email");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        registration={form.register("email")}
        error={form.formState.errors.email?.message}
      />
      <Field
        label="Password"
        type="password"
        autoComplete="new-password"
        registration={form.register("password")}
        error={form.formState.errors.password?.message}
      />
      <ProfileFields
        registrations={{
          firstName: form.register("firstName"),
          lastInitial: form.register("lastInitial"),
          ageBand: form.register("ageBand"),
          schoolId: form.register("schoolId"),
          gradeBand: form.register("gradeBand"),
        }}
        errors={form.formState.errors}
        schools={schools}
        ageBand={ageBand}
      />
      <p className="text-muted-foreground text-sm leading-6">
        Signup creates a standard account only. Officer, advisor, reviewer, and
        administrator access is assigned separately by authorized institutions.
      </p>
      <FormMessage message={message} />
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting || ageBand === "under_13"}
      >
        {form.formState.isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm">
        Already registered?{" "}
        <Link
          href="/sign-in"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function CompleteProfileForm({ schools }: { schools: SchoolOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastInitial: "",
      ageBand: undefined,
      schoolId: "",
      gradeBand: undefined,
    },
  });
  const ageBand = useWatch({ control: form.control, name: "ageBand" });

  async function onSubmit(input: CompleteProfileInput) {
    setMessage(undefined);
    const result = await completeOAuthProfileAction(input);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    router.replace(result.data.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <ProfileFields
        registrations={{
          firstName: form.register("firstName"),
          lastInitial: form.register("lastInitial"),
          ageBand: form.register("ageBand"),
          schoolId: form.register("schoolId"),
          gradeBand: form.register("gradeBand"),
        }}
        errors={form.formState.errors}
        schools={schools}
        ageBand={ageBand}
      />
      <FormMessage message={message} />
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting || ageBand === "under_13"}
      >
        {form.formState.isSubmitting ? "Saving profile…" : "Complete profile"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(input: ForgotPasswordInput) {
    setMessage(undefined);
    const result = await requestPasswordResetAction(input);
    if (!result.ok) {
      setSuccess(false);
      setMessage(result.error.message);
      return;
    }
    setSuccess(true);
    setMessage(
      "If an account matches that address, a password reset link has been sent.",
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        registration={form.register("email")}
        error={form.formState.errors.email?.message}
      />
      <FormMessage message={message} success={success} />
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(input: ResetPasswordInput) {
    setMessage(undefined);
    const result = await updatePasswordAction(input);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    router.replace(result.data.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Field
        label="New password"
        type="password"
        autoComplete="new-password"
        registration={form.register("password")}
        error={form.formState.errors.password?.message}
      />
      <Field
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        registration={form.register("confirmPassword")}
        error={form.formState.errors.confirmPassword?.message}
      />
      <FormMessage message={message} />
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
