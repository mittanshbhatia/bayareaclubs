import "server-only";

/**
 * Lightweight MIME sniffing from magic bytes.
 * Client-declared MIME is never trusted alone when bytes are available.
 */
export function sniffMimeFromBytes(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  // GIF
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }
  // WEBP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  // PDF
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return "application/pdf";
  }
  // ZIP / DOCX / XLSX
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return "application/zip";
  }
  // MP4 / QuickTime often start with ....ftyp
  if (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    return "video/mp4";
  }
  // WebM / Matroska EBML
  if (
    bytes[0] === 0x1a &&
    bytes[1] === 0x45 &&
    bytes[2] === 0xdf &&
    bytes[3] === 0xa3
  ) {
    return "video/webm";
  }

  return null;
}

export function normalizeOfficeZipMime(
  sniffed: string | null,
  declared: string,
): string | null {
  if (sniffed !== "application/zip") return sniffed;
  if (
    declared ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    declared ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    declared === "application/zip"
  ) {
    return declared;
  }
  return sniffed;
}
