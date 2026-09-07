import { describe, expect, it } from "vitest";

import {
  parseEnvFile,
  setEnvValue,
} from "../../scripts/configure-google-oauth.mjs";

describe("Google OAuth configuration helpers", () => {
  it("parses quoted values without exposing them through application code", () => {
    expect(
      parseEnvFile(
        [
          "# local configuration",
          "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false",
          'SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID="client.apps.googleusercontent.com"',
          "SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET='secret-value'",
        ].join("\n"),
      ),
    ).toEqual({
      NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: "false",
      SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID:
        "client.apps.googleusercontent.com",
      SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET: "secret-value",
    });
  });

  it("replaces an existing enable flag without changing other values", () => {
    expect(
      setEnvValue(
        [
          "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co",
          "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false",
          "OTHER=value",
        ].join("\n"),
        "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED",
        "true",
      ),
    ).toBe(
      [
        "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co",
        "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true",
        "OTHER=value",
      ].join("\n"),
    );
  });

  it("appends a missing enable flag", () => {
    expect(
      setEnvValue(
        "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co\n",
        "FLAG",
        "true",
      ),
    ).toBe("NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co\n\nFLAG=true");
  });
});
