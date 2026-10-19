import { z } from "zod/v4";

/* Gmail-style live validation helpers shared by waitlist + institutions forms */

/** Optional phone: digits/spaces/()- with optional leading +, no letters */
export const PHONE_RE = /^\+?\d[\d\s()-]{5,18}$/;

/** Run a schema, flatten issues into { field: firstMessage } */
export function fieldErrors(
  schema: z.ZodType,
  data: unknown
): Record<string, string> {
  const res = schema.safeParse(data);
  if (res.success) return {};
  const out: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Show a field's error only after the user touched it or tried to submit */
export function showError(
  errors: Record<string, string>,
  key: string,
  touched: Record<string, boolean>,
  attempted: boolean
): string | undefined {
  return (touched[key] || attempted) ? errors[key] : undefined;
}
