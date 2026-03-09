import { z } from "zod";

export type Env = {
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    ALLOWED_ORIGIN: string;
    TINYPNG_API_KEY: string;
  };
  Variables: {
    userId: string;
  };
};

export const createArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().default(""),
  body: z.string().optional().default(""),
  published: z.boolean().optional().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
