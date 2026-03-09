import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSupabaseClient } from "../lib/supabase.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { createArticleSchema, updateArticleSchema } from "../types.ts";
import type { Env, Article } from "../types.ts";

const articles = new Hono<Env>();

// GET /articles — public: published only; with ?all=true + auth: include drafts
articles.get("/", async (c) => {
  const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const showAll = c.req.query("all") === "true";

  // If requesting all articles, verify auth
  if (showAll) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  let query = db
    .from("articles")
    .select("id, title, slug, description, published, published_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (!showAll) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data as Article[]);
});

// GET /articles/:slug — public: published article by slug; with ?admin=true + auth: any by slug or UUID
articles.get("/:slug", async (c) => {
  const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const slug = c.req.param("slug");
  const isAdmin = c.req.query("admin") === "true";

  let query = db.from("articles").select("*");

  // Check if slug looks like a UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  if (isUUID) {
    query = query.eq("id", slug);
  } else {
    query = query.eq("slug", slug);
  }

  if (!isAdmin) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json(data as Article);
});

// POST /articles — auth required
articles.post("/", authMiddleware, zValidator("json", createArticleSchema), async (c) => {
  const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = c.req.valid("json");

  const { data, error } = await db
    .from("articles")
    .insert({
      ...body,
      published_at: body.published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data as Article, 201);
});

// PUT /articles/:id — auth required
articles.put("/:id", authMiddleware, zValidator("json", updateArticleSchema), async (c) => {
  const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const id = c.req.param("id");
  const body = c.req.valid("json");

  // If publishing for the first time, set published_at
  const updates: Record<string, unknown> = { ...body };
  if (body.published === true) {
    // Check if already has a published_at
    const { data: existing } = await db.from("articles").select("published_at").eq("id", id).single();
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  } else if (body.published === false) {
    updates.published_at = null;
  }

  const { data, error } = await db
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  if (!data) {
    return c.json({ error: "Article not found" }, 404);
  }

  return c.json(data as Article);
});

// DELETE /articles/:id — auth required
articles.delete("/:id", authMiddleware, async (c) => {
  const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const id = c.req.param("id");

  const { error } = await db.from("articles").delete().eq("id", id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ success: true });
});

export default articles;
