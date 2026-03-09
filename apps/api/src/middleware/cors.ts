import { cors } from "hono/cors";
import type { Env } from "../types.ts";
import type { MiddlewareHandler } from "hono";

export const corsMiddleware: MiddlewareHandler<Env> = (c, next) => {
  const origin = c.env.ALLOWED_ORIGIN;
  return cors({
    origin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })(c, next);
};
