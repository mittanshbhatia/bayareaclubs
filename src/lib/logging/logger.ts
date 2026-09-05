import "server-only";

type LogContext = Record<string, boolean | number | string | null | undefined>;

function write(
  level: "info" | "warn" | "error",
  message: string,
  context: LogContext = {},
) {
  const entry = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) =>
    write("info", message, context),
  warn: (message: string, context?: LogContext) =>
    write("warn", message, context),
  error: (message: string, context?: LogContext) =>
    write("error", message, context),
};
