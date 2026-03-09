import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createSupabaseClient } from "../lib/supabase.ts";
import type { Env } from "../types.ts";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing or invalid token" });
  }

  const token = authHeader.slice(7);

  const supabase = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  c.set("userId", data.user.id);

  await next();
});
