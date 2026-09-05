export type ActionError = {
  code: string;
  fieldErrors?: Record<string, string[]>;
  message: string;
};

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: ActionError };
