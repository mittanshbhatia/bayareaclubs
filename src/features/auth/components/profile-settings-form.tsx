"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/features/auth/actions";
import {
  profileSettingsSchema,
  type ProfileSettingsInput,
} from "@/lib/validation/auth";

export function ProfileSettingsForm({
  initialValues,
}: {
  initialValues: ProfileSettingsInput;
}) {
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const form = useForm<ProfileSettingsInput>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: initialValues,
  });
  const displayFormat = useWatch({
    control: form.control,
    name: "displayFormat",
  });

  async function onSubmit(input: ProfileSettingsInput) {
    setMessage(undefined);
    const result = await updateProfileAction(input);
    if (!result.ok) {
      setSuccess(false);
      setMessage(result.error.message);
      return;
    }
    setSuccess(true);
    setMessage("Profile privacy settings saved.");
  }

  const inputClass =
    "min-h-11 w-full rounded-md border bg-surface px-3 py-2 text-sm";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-8 max-w-xl space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <label className="text-sm font-medium">
          First name
          <input
            {...form.register("firstName")}
            autoComplete="given-name"
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="text-sm font-medium">
          Last initial
          <input
            {...form.register("lastInitial")}
            autoComplete="family-name"
            className={`${inputClass} mt-2`}
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Public display format
        <select
          {...form.register("displayFormat")}
          className={`${inputClass} mt-2`}
        >
          <option value="first_name_last_initial">
            First name and last initial
          </option>
          <option value="first_name_only">First name only</option>
          <option value="custom">Custom display name</option>
        </select>
      </label>

      {displayFormat === "custom" ? (
        <label className="block text-sm font-medium">
          Public display name
          <input
            {...form.register("customDisplayName")}
            className={`${inputClass} mt-2`}
          />
          {form.formState.errors.customDisplayName?.message ? (
            <span className="mt-1 block text-red-700">
              {form.formState.errors.customDisplayName.message}
            </span>
          ) : null}
        </label>
      ) : null}

      <fieldset className="space-y-4 border-t pt-5">
        <legend className="font-semibold">Privacy</legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            {...form.register("showSchoolToClubMembers")}
            className="mt-1 size-4"
          />
          Show my school to members of clubs I have joined
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            {...form.register("showAvatarToClubMembers")}
            className="mt-1 size-4"
          />
          Show my avatar to members of clubs I have joined
        </label>
      </fieldset>

      <p className="text-muted-foreground text-sm">
        Your email address is never part of your public profile.
      </p>
      {message ? (
        <p role={success ? "status" : "alert"} className="text-sm">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
