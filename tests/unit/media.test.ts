import { describe, expect, it } from "vitest";

import { sniffMimeFromBytes } from "@/lib/media/mime-sniff";
import {
  BUCKET_SIZE_LIMITS,
  prepareMediaUploadSchema,
  mediaTypeFromMime,
  isMimeAllowedForBucket,
  deleteMediaAssetSchema,
} from "@/lib/validation/media";

describe("media validation", () => {
  it("rejects public visibility at prepare time", () => {
    const parsed = prepareMediaUploadSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      bucket: "club-media",
      title: "Practice",
      mimeType: "image/jpeg",
      sizeBytes: 1024,
      visibility: "public",
      fileName: "photo.jpg",
    });
    expect(parsed.success).toBe(false);
  });

  it("defaults visibility to private", () => {
    const parsed = prepareMediaUploadSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      bucket: "club-media",
      title: "Practice",
      mimeType: "image/jpeg",
      sizeBytes: 1024,
      fileName: "photo.jpg",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.visibility).toBe("private");
    }
  });

  it("enforces bucket MIME allowlists and size limits", () => {
    expect(isMimeAllowedForBucket("club-branding", "video/mp4")).toBe(false);
    expect(isMimeAllowedForBucket("club-documents", "application/pdf")).toBe(
      true,
    );
    expect(BUCKET_SIZE_LIMITS["club-branding"]).toBeLessThan(
      BUCKET_SIZE_LIMITS["club-media"],
    );
  });

  it("maps MIME types to media kinds", () => {
    expect(mediaTypeFromMime("image/png")).toBe("image");
    expect(mediaTypeFromMime("video/webm")).toBe("video");
    expect(mediaTypeFromMime("application/pdf")).toBe("document");
  });

  it("requires an audited deletion reason", () => {
    expect(
      deleteMediaAssetSchema.safeParse({
        clubId: "11111111-1111-4111-8111-111111111111",
        mediaAssetId: "22222222-2222-4222-8222-222222222222",
        reason: "no",
      }).success,
    ).toBe(false);
  });
});

describe("mime sniffing", () => {
  it("detects PNG and PDF magic bytes", () => {
    const png = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]);
    const pdf = Uint8Array.from([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0, 0, 0, 0,
    ]);
    expect(sniffMimeFromBytes(png)).toBe("image/png");
    expect(sniffMimeFromBytes(pdf)).toBe("application/pdf");
  });
});
